/**
 * @fileoverview 消息存储实现，用于管理 playground 消息
 * 提供基于 IndexedDB 存储的消息 CRUD 操作功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了消息存储管理功能，用于处理聊天消息的持久化存储和状态管理。
 *          主要功能包括：
 *          - 基于 IndexedDB 的消息持久化存储
 *          - 消息 CRUD 操作（创建、读取、更新、删除）
 *          - 实现观察者模式进行状态更新通知
 *          - 支持消息拖拽重排序
 *          - 并发编辑操作处理（使用 Promise 队列）
 *          - 批量删除消息功能
 *          - 会话消息管理
 *
 *          使用场景：
 *          - 管理聊天对话中的消息
 *          - 支持用户编辑和删除消息
 *          - 通过拖拽调整消息顺序
 *          - 从特定位置重新生成对话
 *          - 持久化存储聊天内容
 *          - 处理并发编辑操作
 *
 *          工作流程：
 *          1. init() 方法从 IndexedDB 加载消息数据
 *          2. 通过 subscribe() 订阅消息状态变化
 *          3. 所有 CRUD 操作自动通知订阅者
 *          4. 编辑操作使用 Promise 队列防止并发冲突
 *          5. 重排序时更新时间戳保持顺序
 *          6. 删除消息时自动更新会话消息计数
 *
 *          依赖关系：
 *          - 依赖 @/stores/playground 获取 PlaygroundMessage 类型
 *          - 依赖 @/db/index 获取 db 实例
 *          - 依赖 ./conversation-store 管理会话
 *          - 依赖 @/utils/logger 进行日志记录
 *          - 使用 @dnd-kit/sortable 实现拖拽排序
 */

import { PlaygroundMessage } from '@/stores/playground'
import { arrayMove } from '@dnd-kit/sortable'
import { db } from '.'
import { conversationStore } from './conversation-store'
import { logger } from '@/utils/logger'

/**
 * 消息状态变化的回调类型
 */
type Listener = (messages: PlaygroundMessage[]) => void

/**
 * 管理 playground 消息的状态和持久化
 * 实现观察者模式进行状态更新，处理并发操作
 *
 * @class
 */
class MessageStore {
  private listeners: Set<Listener> = new Set()
  private messages: PlaygroundMessage[] = []
  private editOperations = new Map<string, Promise<void>>()
  private isSavingReorder = false
  private currentConversationId: number | null = null

  /**
   * 订阅消息状态变化的监听器
   */
    subscribe(listener: Listener) {    this.listeners.add(listener)
    listener(this.messages)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 通知所有监听器状态变化
   * 创建消息的深拷贝以防止外部修改
   * @private
   * @since 2024-11-20
   */
  private notify() {
    const messagesCopy = this.messages.map(msg => ({...msg}))
    this.listeners.forEach(listener => listener(messagesCopy))
  }

  /**
   * 通过从 IndexedDB 加载消息来初始化消息存储
   * @async
   * @since 2024-11-20
   */
  async init() {
    this.currentConversationId = conversationStore.getCurrentConversationId()
    await this.loadMessages()
  }

  /**
   * 加载当前会话的消息
   * @async
   * @private
   * @since 2025-12-24
   */
  private async loadMessages() {
    if (!this.currentConversationId) {
      this.messages = []
      this.notify()
      return
    }

    const messages = await db.messages
      .where('conversationId')
      .equals(this.currentConversationId)
      .sortBy('timestamp')

    this.messages = messages
    this.notify()
  }

  /**
   * 切换到指定会话并加载消息
   * @async
   */
    async switchConversation(conversationId: number) {    this.currentConversationId = conversationId
    await this.loadMessages()
  }

  /**
   * 向存储中添加新消息
   * @async
   */
    async addMessage(message: Omit<PlaygroundMessage, 'timestamp' | 'conversationId'>) {    if (!this.currentConversationId) {
      logger.warn('No current conversation, cannot add message', { module: 'MessageStore' })
      return
    }

    const timestamp = Date.now()
    const newMessage = { ...message, timestamp, conversationId: this.currentConversationId }

    logger.debug('Adding new message', {
      context: { messageId: message.id, role: message.role, conversationId: this.currentConversationId },
      module: 'MessageStore'
    })

    const updatedMessages = [...this.messages, newMessage]
    this.messages = updatedMessages
    this.notify()

    await db.messages.add(newMessage)

    // 更新会话的消息计数
    await conversationStore.updateMessageCount(this.currentConversationId, 1)

    logger.info('Message added successfully', {
      context: { messageId: message.id },
      module: 'MessageStore'
    })
  }

  /**
   * 更新现有消息
   * 使用基于 Promise 的队列处理并发编辑
   * @async
   */
    async editMessage(id: string, update: PlaygroundMessage | string) {    const currentOperation = this.editOperations.get(id)
    if (currentOperation) {
      await currentOperation
    }

    const operation = (async () => {
      try {
        const message = await db.messages.get(id)
        if (!message) return

        const currentMessage = this.messages.find(msg => msg.id === id)
        if (!currentMessage) return

        const updatedMessage = typeof update === 'string'
          ? { ...currentMessage, content: update }
          : { ...currentMessage, ...update }

        await db.messages.put(updatedMessage)
        this.messages = this.messages.map(msg =>
          msg.id === id ? updatedMessage : msg
        )
        this.notify()
      } finally {
        this.editOperations.delete(id)
      }
    })()

    this.editOperations.set(id, operation)
    await operation
  }

  /**
   * 根据 ID 删除消息
   * 在删除前等待任何待处理的编辑操作
   * @async
   */
    async deleteMessage(id: string) {    logger.debug('Deleting message', {
      context: { messageId: id },
      module: 'MessageStore'
    })

    const currentOperation = this.editOperations.get(id)
    if (currentOperation) {
      await currentOperation
    }

    await db.messages.delete(id)
    this.messages = this.messages.filter(msg => msg.id !== id)
    this.notify()

    // 更新会话的消息计数
    if (this.currentConversationId) {
      await conversationStore.updateMessageCount(this.currentConversationId, -1)
    }

    logger.info('Message deleted successfully', {
      context: { messageId: id },
      module: 'MessageStore'
    })
  }

  /**
   * 使用拖放功能重新排序消息
   * 更新时间戳以在 IndexedDB 中保持顺序
   * @async
   */
    async reorderMessages(activeId: string, overId: string) {    if (this.isSavingReorder) return

    logger.debug('Reordering messages', {
      context: { activeId, overId },
      module: 'MessageStore'
    })

    try {
      this.isSavingReorder = true

      const newMessages = arrayMove(
        this.messages,
        this.messages.findIndex(item => item.id === activeId),
        this.messages.findIndex(item => item.id === overId)
      )

      this.messages = newMessages
      this.notify()

      for (const operation of this.editOperations.values()) {
        await operation
      }

      const updatedMessages = newMessages.map((msg, index) => ({
        ...msg,
        timestamp: Date.now() + index
      }))

      await Promise.all(updatedMessages.map(msg => db.messages.put(msg)))

      this.messages = updatedMessages
      this.notify()

      logger.info('Messages reordered successfully', {
        context: { activeId, overId },
        module: 'MessageStore'
      })
    } catch (error) {
      logger.error('Error reordering messages', error as Error, {
        context: { activeId, overId },
        module: 'MessageStore'
      })
      throw error
    } finally {
      this.isSavingReorder = false
    }
  }

  /**
   * 从指定消息开始删除所有后续消息
   * @async
   */
    async deleteMessagesFrom(id: string) {    for (const operation of this.editOperations.values()) {
      await operation
    }

    const index = this.messages.findIndex(msg => msg.id === id)
    if (index === -1) return

    const messagesToDelete = this.messages.slice(index).map(msg => msg.id!)
    await db.messages.bulkDelete(messagesToDelete)

    const deletedCount = messagesToDelete.length
    this.messages = this.messages.slice(0, index)
    this.notify()

    // 更新会话的消息计数
    if (this.currentConversationId) {
      await conversationStore.updateMessageCount(this.currentConversationId, -deletedCount)
    }
  }

  /**
   * 清除当前会话的所有消息
   * @async
   * @since 2024-11-20
   */
  async clear() {
    logger.info('Clearing all messages', { module: 'MessageStore' })

    for (const operation of this.editOperations.values()) {
      await operation
    }

    if (!this.currentConversationId) {
      this.messages = []
      this.notify()
      return
    }

    const deletedCount = this.messages.length
    await db.messages.where('conversationId').equals(this.currentConversationId).delete()

    this.messages = []

    this.notify()

    // 更新会话的消息计数
    await conversationStore.updateMessageCount(this.currentConversationId, -deletedCount)

    logger.info('All messages cleared successfully', { module: 'MessageStore' })
  }

  /**
   * 从存储中检索所有消息
   * 如果有缓存消息则返回缓存，否则从 IndexedDB 加载
   * @async
   */
    async getAllMessages(): Promise<PlaygroundMessage[]> {    if (this.messages.length > 0) {
      return [...this.messages]
    }

    const messages = await db.messages.orderBy('timestamp').toArray()
    return messages
  }
}

/**
 * MessageStore 的单例实例
 * 所有消息操作使用此实例
 * @constant
 */
export const messageStore = new MessageStore()
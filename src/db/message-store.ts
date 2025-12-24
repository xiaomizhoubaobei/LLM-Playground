/**
 * @fileoverview 消息存储实现，用于管理 playground 消息
 * 提供基于 IndexedDB 存储的消息 CRUD 操作功能
 * @author zpl
 * @created 2024-11-20
 * @modified 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 实现观察者模式进行状态更新，处理并发操作，支持国际化
 */

import { PlaygroundMessage } from '@/stores/playground'
import { arrayMove } from '@dnd-kit/sortable'
import { db } from '.'
import { logger } from '@/utils/logger'

/**
 * 消息状态变化的回调类型
 * @callback Listener
 * @param {PlaygroundMessage[]} messages - 更新后的消息数组
 */
type Listener = (messages: PlaygroundMessage[]) => void

/**
 * 管理 playground 消息的状态和持久化
 * 实现观察者模式进行状态更新，处理并发操作
 * 
 * @class
 * @since 2024-11-20
 * @modified 2025-12-24
 */
class MessageStore {
  private listeners: Set<Listener> = new Set()
  private messages: PlaygroundMessage[] = []
  private editOperations = new Map<string, Promise<void>>()
  private isSavingReorder = false

  /**
   * 订阅消息状态变化的监听器
   * @param {Listener} listener - 状态变化时调用的回调函数
   * @returns {Function} 取消订阅的函数
   * @since 2024-11-20
   */
  subscribe(listener: Listener) {
    this.listeners.add(listener)
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
    const messages = await db.messages.orderBy('timestamp').toArray()
    this.messages = messages
    this.notify()
  }

  /**
   * 向存储中添加新消息
   * @async
   * @param {Omit<PlaygroundMessage, 'timestamp'>} message - 要添加的消息
   * @since 2024-11-20
   */
  async addMessage(message: Omit<PlaygroundMessage, 'timestamp'>) {
    const timestamp = Date.now()
    const newMessage = { ...message, timestamp }
    
    logger.debug('Adding new message', { 
      context: { messageId: message.id, role: message.role },
      module: 'MessageStore'
    })
    
    const updatedMessages = [...this.messages, newMessage]
    this.messages = updatedMessages
    this.notify()

    await db.messages.add(newMessage)
    logger.info('Message added successfully', { 
      context: { messageId: message.id },
      module: 'MessageStore'
    })
  }

  /**
   * 更新现有消息
   * 使用基于 Promise 的队列处理并发编辑
   * @async
   * @param {string} id - 要编辑的消息 ID
   * @param {PlaygroundMessage | string} update - 更新的消息或内容
   * @since 2024-11-20
   */
  async editMessage(id: string, update: PlaygroundMessage | string) {
    const currentOperation = this.editOperations.get(id)
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
   * @param {string} id - 要删除的消息 ID
   * @since 2024-11-20
   */
  async deleteMessage(id: string) {
    logger.debug('Deleting message', { 
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
    
    logger.info('Message deleted successfully', { 
      context: { messageId: id },
      module: 'MessageStore'
    })
  }

  /**
   * 使用拖放功能重新排序消息
   * 更新时间戳以在 IndexedDB 中保持顺序
   * @async
   * @param {string} activeId - 被移动的消息 ID
   * @param {string} overId - 目标位置的消息 ID
   * @since 2024-11-20
   */
  async reorderMessages(activeId: string, overId: string) {
    if (this.isSavingReorder) return
    
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
   * @param {string} id - 要删除的第一个消息的 ID
   * @since 2024-11-20
   */
  async deleteMessagesFrom(id: string) {
    for (const operation of this.editOperations.values()) {
      await operation
    }

    const index = this.messages.findIndex(msg => msg.id === id)
    if (index === -1) return

    const messagesToDelete = this.messages.slice(index).map(msg => msg.id!)
    await db.messages.bulkDelete(messagesToDelete)
    
    this.messages = this.messages.slice(0, index)
    this.notify()
  }

  /**
   * 清除存储中的所有消息
   * @async
   * @since 2024-11-20
   */
  async clear() {
    logger.info('Clearing all messages', { module: 'MessageStore' })
    
    for (const operation of this.editOperations.values()) {
      await operation
    }

    await db.messages.clear()
    
    this.messages = []
    
    this.notify()
    logger.info('All messages cleared successfully', { module: 'MessageStore' })
  }

  /**
   * 从存储中检索所有消息
   * 如果有缓存消息则返回缓存，否则从 IndexedDB 加载
   * @async
   * @returns {Promise<PlaygroundMessage[]>} 所有消息的数组
   * @since 2024-11-20
   */
  async getAllMessages(): Promise<PlaygroundMessage[]> {
    if (this.messages.length > 0) {
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
 * @type {MessageStore}
 * @since 2024-11-20
 */
export const messageStore = new MessageStore()
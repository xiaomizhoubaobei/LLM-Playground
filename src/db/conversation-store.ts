/**
 * @fileoverview 会话存储实现，用于管理对话会话
 * 提供基于 IndexedDB 存储的会话 CRUD 操作功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了会话存储管理功能，用于处理对话会话的持久化存储和状态管理。
 *          主要功能包括：
 *          - 基于 IndexedDB 的会话持久化存储
 *          - 会话 CRUD 操作（创建、读取、更新、删除）
 *          - 实现观察者模式进行状态更新通知
 *          - 会话切换和当前会话管理
 *          - 会话消息计数统计
 *          - 自动创建默认会话
 *
 *          使用场景：
 *          - 管理多个聊天对话会话
 *          - 在不同会话之间切换
 *          - 删除会话及其关联消息
 *          - 订阅会话状态变化
 *          - 统计会话中的消息数量
 *
 *          工作流程：
 *          1. init() 方法从 IndexedDB 加载会话数据
 *          2. 如果没有会话，自动创建默认会话
 *          3. 通过 subscribe() 订阅会话状态变化
 *          4. 所有 CRUD 操作自动通知订阅者
 *          5. 删除会话时自动清理关联消息
 *          6. 切换会话时更新最后访问时间
 *
 *          依赖关系：
 *          - 依赖 @/db/index 获取 Conversation 类型和 db 实例
 *          - 依赖 @/utils/logger 进行日志记录
 */

import { Conversation } from '.'
import { db } from '.'
import { logger } from '@/utils/logger'

/**
 * 会话状态变化的回调类型
 */
type Listener = (conversations: Conversation[]) => void

/**
 * 管理对话会话的状态和持久化
 * 实现观察者模式进行状态更新
 *
 * @class
 * @since 2025-12-24
 */
class ConversationStore {
  private listeners: Set<Listener> = new Set()
  private conversations: Conversation[] = []
  private currentConversationId: number | null = null

  /**
   * 订阅会话状态变化的监听器
   */
    subscribe(listener: Listener) {    this.listeners.add(listener)
    listener(this.conversations)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 通知所有监听器状态变化
   * 创建会话的深拷贝以防止外部修改
   * @private
   * @since 2025-12-24
   */
  private notify() {
    const conversationsCopy = this.conversations.map(conv => ({...conv}))
    this.listeners.forEach(listener => listener(conversationsCopy))
  }

  /**
   * 通过从 IndexedDB 加载会话来初始化会话存储
   * @async
   * @since 2025-12-24
   */
  async init() {
    const conversations = await db.conversations.orderBy('updatedAt').reverse().toArray()
    this.conversations = conversations

    // 如果没有会话，创建默认会话
    if (conversations.length === 0) {
      await this.createConversation()
    } else {
      // 加载最近更新的会话
      this.currentConversationId = conversations[0].id || null
    }

    this.notify()
  }

  /**
   * 创建新对话会话
   * @async
   */
    async createConversation(title?: string): Promise<number> {    const timestamp = Date.now()
    const newConversation: Conversation = {
      title: title || '新对话',
      createdAt: timestamp,
      updatedAt: timestamp,
      messageCount: 0
    }

    logger.debug('Creating new conversation', {
      context: { title: newConversation.title },
      module: 'ConversationStore'
    })

    const id = await db.conversations.add(newConversation)
    newConversation.id = id

    this.conversations.unshift(newConversation)
    this.currentConversationId = id
    this.notify()

    logger.info('Conversation created successfully', {
      context: { conversationId: id },
      module: 'ConversationStore'
    })

    return id
  }

  /**
   * 更新会话信息
   * @async
   */
    async updateConversation(id: number, updates: Partial<Conversation>) {    const conversation = await db.conversations.get(id)
    if (!conversation) return

    const updatedConversation = {
      ...conversation,
      ...updates,
      updatedAt: Date.now()
    }

    await db.conversations.put(updatedConversation)

    this.conversations = this.conversations.map(conv =>
      conv.id === id ? updatedConversation : conv
    )

    this.notify()

    logger.info('Conversation updated successfully', {
      context: { conversationId: id, updates },
      module: 'ConversationStore'
    })
  }

  /**
   * 删除会话及其所有消息
   * @async
   */
    async deleteConversation(id: number) {    logger.debug('Deleting conversation', {
      context: { conversationId: id },
      module: 'ConversationStore'
    })

    // 删除会话的所有消息
    await db.messages.where('conversationId').equals(id).delete()

    // 删除会话
    await db.conversations.delete(id)

    this.conversations = this.conversations.filter(conv => conv.id !== id)

    // 如果删除的是当前会话，切换到其他会话或创建新会话
    if (this.currentConversationId === id) {
      if (this.conversations.length > 0) {
        this.currentConversationId = this.conversations[0].id || null
      } else {
        await this.createConversation()
      }
    }

    this.notify()

    logger.info('Conversation deleted successfully', {
      context: { conversationId: id },
      module: 'ConversationStore'
    })
  }

  /**
   * 切换到指定会话
   * @async
   */
    async switchConversation(id: number) {    const conversation = await db.conversations.get(id)
    if (!conversation) {
      logger.warn('Conversation not found', {
        context: { conversationId: id },
        module: 'ConversationStore'
      })
      return
    }

    this.currentConversationId = id

    // 更新会话的最后访问时间
    await this.updateConversation(id, {})

    logger.info('Switched to conversation', {
      context: { conversationId: id },
      module: 'ConversationStore'
    })
  }

  /**
   * 获取当前会话 ID
   */
    getCurrentConversationId(): number | null {    return this.currentConversationId
  }

  /**
   * 更新会话的消息计数
   * @async
   */
    async updateMessageCount(id: number, delta: number) {    const conversation = await db.conversations.get(id)
    if (!conversation) return

    const newCount = Math.max(0, (conversation.messageCount || 0) + delta)
    await this.updateConversation(id, { messageCount: newCount })
  }

  /**
   * 获取所有会话
   */
    getAllConversations(): Conversation[] {    return [...this.conversations]
  }

  /**
   * 获取当前会话
   */
    getCurrentConversation(): Conversation | null {    if (!this.currentConversationId) return null
    return this.conversations.find(conv => conv.id === this.currentConversationId) || null
  }
}

/**
 * ConversationStore 的单例实例
 * 所有的会话操作使用此实例
 * @constant
 */
export const conversationStore = new ConversationStore()
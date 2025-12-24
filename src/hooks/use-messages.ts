/**
 * @fileoverview React Hook，用于管理具有持久化功能的 Playground 消息
 * 提供CRUD操作、拖拽排序和状态管理功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 实现消息的增删改查、拖拽重排序、持久化存储和状态管理
 */

import { messageStore } from '@/db/message-store'
import { PlaygroundMessage } from '@/stores/playground'
import type { DragEndEvent } from '@dnd-kit/core'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

/**
 * 提供消息管理功能的 React Hook
 * 处理消息持久化、状态管理和用户交互
 * 
 * @function useMessages
 * @param {string} [defaultSystemMessage] - 可选的用于初始化的系统消息
 * @returns {Object} 消息管理接口
 * @property {PlaygroundMessage[]} messages - 当前消息列表
 * @property {boolean} loading - 加载状态指示器
 * @property {Function} setMessages - 消息状态设置器（占位符）
 * @property {Function} handleEdit - 消息编辑处理器
 * @property {Function} handleDelete - 消息删除处理器
 * @property {Function} handleDragEnd - 拖拽处理器
 * @property {Function} addMessage - 消息添加处理器
 * @property {Function} removeMessagesFrom - 批量消息移除处理器
 */
export function useMessages(defaultSystemMessage?: string) {
  // 跟踪消息列表和加载状态
  const [messages, setMessages] = useState<PlaygroundMessage[]>([])
  const [loading, setLoading] = useState(true)

  // 初始化消息存储并设置订阅
  useEffect(() => {
    messageStore.init().then(async () => {
      const allMessages = await messageStore.getAllMessages()
      
      // 如果不存在消息，则添加默认系统消息
      if (allMessages.length === 0 && defaultSystemMessage) {
        await messageStore.addMessage({
          id: uuidv4(),
          role: 'system',
          content: defaultSystemMessage,
        })
      }
      
      setLoading(false)
    })
    
    // 订阅消息存储更新
    return messageStore.subscribe(setMessages)
  }, [defaultSystemMessage])

  /**
   * 处理消息编辑
   * 
   * @param {string} id - 要编辑的消息ID
   * @param {PlaygroundMessage | string} update - 更新的消息或内容
   */
  const handleEdit = useCallback((id: string, update: PlaygroundMessage | string) => {
    messageStore.editMessage(id, update)
  }, [])

  /**
   * 处理消息删除
   * 
   * @param {string} id - 要删除的消息ID
   */
  const handleDelete = useCallback((id: string) => {
    messageStore.deleteMessage(id)
  }, [])

  /**
   * 处理消息的拖拽重排序
   * 
   * @param {DragEndEvent} event - 来自 dnd-kit 的拖拽结束事件
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    messageStore.reorderMessages(active.id as string, over.id as string)
  }, [])

  /**
   * 向存储添加新消息
   * 
   * @param {PlaygroundMessage} message - 要添加的消息
   */
  const addMessage = useCallback((message: PlaygroundMessage) => {
    messageStore.addMessage(message)
  }, [])

  /**
   * 从指定消息开始删除所有消息
   * 
   * @param {string} id - 要删除的第一个消息ID
   */
  const removeMessagesFrom = useCallback((id: string) => {
    messageStore.deleteMessagesFrom(id)
  }, [])

  return {
    messages,
    loading,
    setMessages: () => {}, // 兼容性占位符
    handleEdit,
    handleDelete,
    handleDragEnd,
    addMessage,
    removeMessagesFrom,
  }
}
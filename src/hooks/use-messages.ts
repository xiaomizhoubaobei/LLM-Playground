/**
 * @fileoverview React Hook，用于管理具有持久化功能的 Playground 消息
 * 提供CRUD操作、拖拽排序和状态管理功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了消息管理功能的 Hook，用于处理聊天消息的持久化存储和交互操作。
 *          主要功能包括：
 *          - 消息的增删改查（CRUD）操作
 *          - 消息拖拽重排序功能
 *          - 基于 PGlite 的持久化存储
 *          - 自动初始化默认系统消息
 *          - 批量删除消息功能
 *          - 实时订阅消息存储更新
 *
 *          使用场景：
 *          - 管理聊天对话历史记录
 *          - 支持用户编辑和删除消息
 *          - 通过拖拽调整消息顺序
 *          - 从特定位置重新生成对话
 *          - 持久化存储聊天内容
 *
 *          工作流程：
 *          1. Hook 初始化时加载消息存储
 *          2. 如果没有消息且提供默认系统消息，则自动添加
 *          3. 订阅消息存储的更新事件
 *          4. 提供 handleEdit、handleDelete 等操作函数
 *          5. 所有操作自动同步到持久化存储
 *          6. 组件卸载时自动清理订阅
 *
 *          依赖关系：
 *          - 依赖 @/db/message-store 进行消息持久化
 *          - 依赖 @/stores/playground 获取 PlaygroundMessage 类型
 *          - 使用 @dnd-kit/core 实现拖拽功能
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
   */
    const handleEdit = useCallback((id: string, update: PlaygroundMessage | string) => {    messageStore.editMessage(id, update)
  }, [])

  /**
   * 处理消息删除
   */
    const handleDelete = useCallback((id: string) => {    messageStore.deleteMessage(id)
  }, [])

  /**
   * 处理消息的拖拽重排序
   */
    const handleDragEnd = useCallback((event: DragEndEvent) => {    const { active, over } = event
    if (!over || active.id === over.id) return
    messageStore.reorderMessages(active.id as string, over.id as string)
  }, [])

  /**
   * 向存储添加新消息
   */
    const addMessage = useCallback((message: PlaygroundMessage) => {    messageStore.addMessage(message)
  }, [])

  /**
   * 从指定消息开始删除所有消息
   */
    const removeMessagesFrom = useCallback((id: string) => {    messageStore.deleteMessagesFrom(id)
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
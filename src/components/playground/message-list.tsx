/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 消息列表组件，处理聊天消息的显示、排序和管理，包括拖拽功能、自动滚动和消息重新生成
 */

import { messageStore } from '@/db/message-store'
import { useChatGeneration } from '@/hooks/use-chat-generation'
import { MessageSkeleton } from '@/components/playground/message-skeleton'
import { PlaygroundMessage, playgroundSettiongsAtom } from '@/stores/playground'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useAtom } from 'jotai'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SortableMessage } from './sortable-message'

const MemoizedSortableMessage = memo(SortableMessage)

/**
 * MessageList组件的属性接口
 * @interface MessageListProps
 * @property {PlaygroundMessage[]} messages - 要显示的消息数组
 * @property {PlaygroundMessage | null} generatingMessage - 当前正在生成的消息（如果有）
 * @property {boolean} isRunning - 消息生成是否正在进行
 * @property {Function} onDragEnd - 拖拽操作结束时的处理函数
 * @property {Function} onEdit - 编辑消息的处理函数
 * @property {Function} onDelete - 删除消息的处理函数
 */
interface MessageListProps {
  messages: PlaygroundMessage[]
  generatingMessage: PlaygroundMessage | null
  isRunning: boolean
  loading?: boolean
  onDragEnd: (event: DragEndEvent) => void
  onEdit: (id: string, message: PlaygroundMessage) => void
  onDelete: (id: string) => void
}

/**
 * 显示聊天消息列表的记忆化组件，具有拖拽排序、自动滚动和消息重新生成功能
 *
 * @component
 * @param {MessageListProps} props - 组件属性
 * @returns {JSX.Element} 渲染的消息列表
 */
export const MessageList = memo(function MessageList({
  messages,
  generatingMessage,
  isRunning,
  loading = false,
  onDragEnd,
  onEdit,
  onDelete,
}: MessageListProps) {
  /**
   * 拖拽功能的传感器
   */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 管理滚动行为和位置的引用
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastScrollHeightRef = useRef<number>(0)
  const lastScrollTopRef = useRef<number>(0)
  const scrollTimeoutRef = useRef<number>()
  const isScrollingRef = useRef(false)

  /**
   * 根据自动滚动偏好和之前的滚动位置更新滚动位置
   */
  const updateScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isScrollingRef.current) return

    if (shouldAutoScroll) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'instant',
      })
    } else {
      // 保持相对滚动位置
      const scrollDiff = container.scrollHeight - lastScrollHeightRef.current
      container.scrollTop = lastScrollTopRef.current + scrollDiff
    }

    // 更新记录的高度和滚动位置
    lastScrollHeightRef.current = container.scrollHeight
    lastScrollTopRef.current = container.scrollTop
  }, [shouldAutoScroll])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      // 清除之前的计时器
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }

      isScrollingRef.current = true

      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setShouldAutoScroll(isAtBottom)

      // 记录滚动位置
      lastScrollHeightRef.current = scrollHeight
      lastScrollTopRef.current = scrollTop

      // 设置新的计时器在滚动停止后重置状态
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false
      }, 150) // 滚动停止150ms后重置状态
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isScrollingRef.current) {
      requestAnimationFrame(() => {
        updateScroll()
      })
    }
  }, [messages, generatingMessage, updateScroll])

  const [settings] = useAtom(playgroundSettiongsAtom)

  const {
    generate,
    isRunning: isRegenerating,
    generatingMessage: regeneratingMessage,
  } = useChatGeneration()

  /**
   * 重新生成指定索引处的消息
   * @param {string} id - 要重新生成的消息ID
   */
  const handleRegenerate = useCallback(
    async (id: string) => {
      const currentIndex = messages.findIndex((msg) => msg.id === id)
      if (currentIndex === -1) return

      const messageHistory = messages.slice(0, currentIndex)
      await messageStore.deleteMessagesFrom(id)
      const result = await generate(messageHistory, settings)

      if (result) {
        const { id, content, logprobs } = result
        await messageStore.addMessage({
          id,
          role: 'assistant',
          content,
          logprobs,
        })
      }
    },
    [messages, generate, settings]
  )

  /**
   * 将原始消息与正在生成的消息合并（如果有）
   */
  const allMessages = useMemo(() => {
    const result = [...messages]
    const generatingMsg = (isRunning && generatingMessage) || (isRegenerating && regeneratingMessage)
    
    if (generatingMsg) {
      const existingIndex = result.findIndex(msg => msg.id === generatingMsg.id)
      if (existingIndex >= 0) {
        result[existingIndex] = generatingMsg
      } else {
        result.push(generatingMsg)
      }
    }
    
    return result
  }, [messages, generatingMessage, regeneratingMessage, isRunning, isRegenerating])

  return (
    <div className='flex h-full w-full flex-col'>
      <div
        ref={containerRef}
        className='h-full w-full overflow-y-auto custom-scrollbar'
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        <div className='w-full p-4 space-y-3'>
          {loading && allMessages.length === 0 ? (
            <MessageSkeleton count={3} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={allMessages}
                strategy={verticalListSortingStrategy}
              >
                {allMessages.map((message) => (
                  <MemoizedSortableMessage
                    key={message.id}
                    message={message}
                    handleEdit={onEdit}
                    handleDelete={onDelete}
                    handleRegenerate={handleRegenerate}
                    isRunning={
                      message.id === (generatingMessage?.id || regeneratingMessage?.id)
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
})

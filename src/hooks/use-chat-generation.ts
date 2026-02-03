/**
 * @fileoverview React Hook，用于管理支持流式传输的聊天消息生成
 * 提供实时消息生成、取消和错误处理功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了支持流式传输的聊天消息生成 Hook，用于处理 AI 聊天对话的实时生成。
 *          主要功能包括：
 *          - 支持流式消息生成，实时更新 UI
 *          - 提供消息生成状态管理（进行中/停止）
 *          - 完整的错误处理和用户友好的错误提示
 *          - 支持手动停止正在进行的生成
 *          - 国际化错误消息支持
 *          - 生成消息的唯一 ID 管理
 *
 *          使用场景：
 *          - 在聊天界面中实时显示 AI 回复
 *          - 处理用户中断生成操作
 *          - 管理聊天会话的上下文和状态
 *          - 显示本地化的错误提示信息
 *
 *          工作流程：
 *          1. generate 函数被调用，传入历史消息和设置
 *          2. 创建新消息 ID，初始化 AbortController
 *          3. 调用 /api/chat-stream API 路由
 *          4. 解析流式响应，实时更新消息内容
 *          5. 用户可通过 stop 函数随时停止生成
 *          6. 完成或出错时清理状态和引用
 *
 *          依赖关系：
 *          - 依赖 @/stores/playground 获取 PlaygroundMessage 类型
 *          - 依赖 @/utils/logger 进行日志记录
 *          - 依赖 next-intl 进行国际化处理
 *          - 使用 sonner 显示 toast 通知
 */

import { PlaygroundMessage, LogProbs } from '@/stores/playground'
import { logger } from '@/utils/logger'
import { useLocale, useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

/**
 * 管理支持流式传输的聊天消息生成的 React Hook
 * 处理消息生成状态、流式更新和错误处理
 *
 * @function useChatGeneration
 */
export function useChatGeneration() {
  // 跟踪生成状态和当前消息
  const [state, setState] = useState<{
    isRunning: boolean
    generatingMessage: PlaygroundMessage | null
  }>({
    isRunning: false,
    generatingMessage: null,
  })

  // 用于管理生成流程的引用
  const shouldStopRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const contentRef = useRef('')
  const logprobsRef = useRef<LogProbs | undefined>(undefined)
  // 国际化 Hooks
  const t = useTranslations('playground')
  const locale = useLocale()

  /**
   * 停止当前的消息生成
   * 设置停止标志，在流式传输过程中会被检查
   */
  const stop = () => {
    logger.info('Stopping chat generation', { module: 'ChatGeneration' })
    shouldStopRef.current = true
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  /**
   * 生成新的聊天消息，支持流式更新
   *
   * @async
   */
    const generate = async (messages: PlaygroundMessage[], settings: any) => {    const messageId = uuidv4()
    shouldStopRef.current = false
    contentRef.current = ''
    logprobsRef.current = undefined
    abortControllerRef.current = new AbortController()

    logger.info('Starting chat generation', {
      context: { messageId, messagesCount: messages.length },
      module: 'ChatGeneration'
    })

    // 设置生成状态
    setState({
      isRunning: true,
      generatingMessage: {
        id: messageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      },
    })

    try {
      logger.info('Generating chat via API', { context: { settings }, module: 'ChatGeneration' })

      // 调用 API 路由
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          messages,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'API request failed')
      }

      logger.debug('Processing chat stream', { module: 'ChatGeneration' })

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let chunkCount = 0

      while (true) {
        // 检查手动停止
        if (shouldStopRef.current) {
          logger.info('Chat generation stopped by user', {
            context: { messageId },
            module: 'ChatGeneration'
          })
          if (abortControllerRef.current) {
            abortControllerRef.current.abort()
          }
          return {
            id: messageId,
            content: contentRef.current
          }
        }

        const { done, value } = await reader.read()
        if (done) {
          logger.info('Stream completed', {
            context: { messageId, totalChunks: chunkCount, finalContentLength: contentRef.current.length },
            module: 'ChatGeneration'
          })
          break
        }

        chunkCount++
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6)
            if (data === '[DONE]') {
              logger.info('Stream received DONE signal', {
                context: { messageId, totalChunks: chunkCount },
                module: 'ChatGeneration'
              })
              return { id: messageId, content: contentRef.current, logprobs: logprobsRef.current }
            }

            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices?.[0]?.delta

              if (delta?.content) {
                contentRef.current += delta.content
                setState((prev) => ({
                  ...prev,
                  generatingMessage: {
                    id: messageId,
                    role: 'assistant',
                    content: contentRef.current,
                    timestamp: Date.now(),
                  },
                }))
              }

              if (parsed.choices?.[0]?.finish_reason) {
                // 流结束
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      logger.info('Chat generation completed successfully', {
        context: { messageId },
        module: 'ChatGeneration'
      })
      return { id: messageId, content: contentRef.current, logprobs: logprobsRef.current }
    } catch (error: unknown) {
      logger.error('Error in chat generation', error as Error, {
        context: { messageId },
        module: 'ChatGeneration'
      })

      // 处理本地化错误消息
      if (typeof error === 'string') {
        try {
          const parsedError = JSON.parse(error)
          const key = {
            zh: 'cn',
            en: 'en',
            ja: 'jp',
          }[locale]
          const errorMessage = parsedError.error?.[`message_${key}`] || parsedError.error?.message || error
          toast.error(errorMessage)
        } catch (parseError) {
          logger.error('Error parsing error message', parseError as Error, {
            context: { messageId, originalError: error },
            module: 'ChatGeneration'
          })
          toast.error(t('error.chatFailed'))
        }
      } else if (error instanceof Error) {
        toast.error(error.message || t('error.chatFailed'))
      } else {
        toast.error(t('error.chatFailed'))
      }
      return null
    } finally {
      // 重置状态和引用
      shouldStopRef.current = false
      contentRef.current = ''
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      setState({
        isRunning: false,
        generatingMessage: null,
      })
    }
  }

  return {
    generate,
    stop,
    isRunning: state.isRunning,
    generatingMessage: state.generatingMessage,
  }
}

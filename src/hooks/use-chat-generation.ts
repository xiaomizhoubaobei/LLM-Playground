/**
 * @fileoverview React Hook，用于管理支持流式传输的聊天消息生成
 * 提供实时消息生成、取消和错误处理功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 实现完整的聊天生成功能，包括流式更新、状态管理、错误处理和国际化支持
 */

import { chat } from '@/actions/chat'
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
 * @returns {Object} 聊天生成接口
 * @property {Function} generate - 开始消息生成
 * @property {Function} stop - 停止正在进行的生成
 * @property {boolean} isRunning - 生成是否正在进行
 * @property {PlaygroundMessage | null} generatingMessage - 当前正在生成的消息
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
  }

  /**
   * 生成新的聊天消息，支持流式更新
   * 
   * @async
   * @param {PlaygroundMessage[]} messages - 用于上下文的先前消息
   * @param {any} settings - 生成设置和配置
   * @returns {Promise<{id: string, content: string} | null>} 生成的消息，错误时返回 null
   */
  const generate = async (messages: PlaygroundMessage[], settings: any) => {
    const messageId = uuidv4()
    shouldStopRef.current = false
    contentRef.current = ''
    logprobsRef.current = undefined
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
      logger.info('Generating chat', { context: { settings }, module: 'ChatGeneration' })
      const { output } = await chat({
        ...settings,
        messages,
      })

      logger.debug('Processing chat stream', { module: 'ChatGeneration' })
      // 处理流式响应
      for await (const delta of output) {
        // 检查手动停止
        if (shouldStopRef.current) {
          logger.info('Chat generation stopped by user', { 
            context: { messageId },
            module: 'ChatGeneration'
          })
          return {
            id: messageId,
            content: contentRef.current
          }
        }

        // 累积内容并更新状态
        if (delta?.type === 'text-delta') {
          contentRef.current += delta.textDelta
          setState((prev) => ({
            ...prev,
            generatingMessage: {
              id: messageId,
              role: 'assistant',
              content: contentRef.current,
              timestamp: Date.now(),
            },
          }))
        } else if (delta?.type === 'logprobs') {
          logprobsRef.current = delta.logprobs
          setState((prev) => {
            if (!prev.generatingMessage) return prev;
            return {
              ...prev,
              generatingMessage: {
                ...prev.generatingMessage,
                logprobs: delta.logprobs,
              },
            };
          });
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
          const errorMessage = parsedError.error[`message_${key}`] || parsedError.error.message
          toast.error(errorMessage)
        } catch (parseError) {
          logger.error('Error parsing error message', parseError as Error, { 
            context: { messageId, originalError: error },
            module: 'ChatGeneration'
          })
          toast.error(t('error.chatFailed'))
        }
      } else {
        toast.error(t('error.chatFailed'))
      }
      return null
    } finally {
      // 重置状态和引用
      shouldStopRef.current = false
      contentRef.current = ''
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

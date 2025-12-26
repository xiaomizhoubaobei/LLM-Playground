/**
 * @fileoverview 处理使用 AI 模型生成聊天消息的服务器操作（非流式）
 * 支持非流式响应和各种模型配置
 * @author zpl
 * @date 2025-12-26
 * @license AGPL-3.0 license
 * @remark 处理聊天消息生成和非流式响应
 */

'use server'

import { env } from '@/env'
import { PlaygroundMessage } from '@/stores/playground'
import { normalizeUrl } from '@/utils/api'
import { logger } from '@/utils/logger'
import ky from 'ky'

/**
 * 模型响应允许的最大 token 数量
 * 当前设置为兼容 Claude 3.5 模型
 * @constant
 * @type {number}
 */
const MAX_TOKENS = 8192

/**
 * 聊天错误类
 * 用于处理聊天生成过程中的错误
 * @class
 * @extends {Error}
 */
class ChatError extends Error {
  constructor(message: string, options?: { cause: any }) {
    super(message, options)
    this.name = 'ChatError'
  }
}

/**
 * 非流式聊天响应类型
 */
export type ChatCompletionResponse = {
  id: string
  object: string
  created: number
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * 使用 AI 模型生成聊天响应的服务器操作（非流式）
 * 支持非流式响应和各种模型参数以微调输出
 *
 * @async
 * @function chatNonStream
 * @param {Object} params - 聊天生成参数
 * @param {string} params.model - AI 模型标识符
 * @param {string} params.apiKey - 模型访问的 API 密钥
 * @param {PlaygroundMessage[]} params.messages - 对话历史
 * @param {number} [params.frequencyPenalty] - 频繁使用 token 的惩罚
 * @param {number} [params.presencePenalty] - token 存在的惩罚
 * @param {number} [params.temperature] - 响应生成中的随机性
 * @param {number} [params.topP] - 核采样参数
 * @param {number} [params.maxTokens] - 模型响应的最大 token 数
 * @returns {Promise<{content: string, usage: any}>} 聊天响应内容和使用情况
 */
export async function chatNonStream({
  model,
  apiKey,
  messages,
  frequencyPenalty,
  presencePenalty,
  temperature,
  topP,
  maxTokens,
}: {
  model: string
  apiKey: string
  messages: PlaygroundMessage[]
  frequencyPenalty?: number
  presencePenalty?: number
  temperature?: number
  topP?: number
  maxTokens?: number
}) {
  const formattedMessages = messages.map((msg) => {
    if (!msg.files || !msg.files.length) {
      return {
        role: msg.role,
        content: msg.content,
      }
    }

    const parts = []
    if (msg.content) {
      parts.push({
        type: 'text' as const,
        text: msg.content,
      })
    }

    if (msg.files?.length) {
      parts.push(
        ...msg.files.map((file) => ({
          type: file.type,
          [file.type === 'image' ? 'image_url' : 'data']: { url: file.url },
        }))
      )
    }

    return {
      role: msg.role,
      content: parts,
    }
  })

  logger.info('Starting non-stream chat generation', {
    context: {
      model,
      messagesCount: messages.length,
      messages,
      formattedMessages,
      frequencyPenalty,
      presencePenalty,
      temperature,
      topP,
      maxTokens,
    },
    module: 'ChatNonStream',
  })

  const baseUrl = normalizeUrl(env.AI_302_API_URL || 'https://api.302.ai') + '/v1'
  
  const requestBody: any = {
    model,
    messages,
  }

  if (frequencyPenalty !== undefined) requestBody.frequency_penalty = frequencyPenalty
  if (presencePenalty !== undefined) requestBody.presence_penalty = presencePenalty
  if (temperature !== undefined) requestBody.temperature = temperature
  if (topP !== undefined) requestBody.top_p = topP
  if (maxTokens !== undefined) requestBody.max_tokens = maxTokens

  // Claude 3.5 特殊配置
  if (model.includes('claude-3-5')) {
    requestBody.max_tokens = maxTokens || MAX_TOKENS
  }

  try {
    const response = await ky.post(`${baseUrl}/chat/completions`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      json: requestBody,
      retry: 0,
      timeout: false,
    }).json<ChatCompletionResponse>()

    logger.info('Non-stream chat completed successfully', { 
      context: { 
        responseId: response.id,
        usage: response.usage 
      },
      module: 'ChatNonStream'
    })

    const content = response.choices[0]?.message?.content || ''
    
    return {
      content,
      usage: response.usage,
    }
  } catch (error) {
    logger.error('Non-stream chat API request failed', error as Error, { module: 'ChatNonStream' })
    throw new ChatError('Non-stream chat API request failed', { cause: error })
  }
}
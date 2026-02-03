/**
 * @fileoverview 处理使用 AI 模型生成聊天消息的服务器操作
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了流式聊天消息生成的服务器端操作。
 *          通过调用 AI 模型 API，根据对话历史和模型参数生成流式聊天响应。
 *
 *          主要功能包括：
 *          - 支持流式聊天响应（Server-Sent Events）
 *          - 支持多种模型参数配置（temperature、topP、frequencyPenalty 等）
 *          - 支持包含文件（如图像）的多模态消息
 *          - 支持多种 API 提供商（302AI、魔力方舟）
 *          - 消息格式化和流式响应解析
 *          - 统一的错误处理和日志记录
 *
 *          导出类型：
 *          - StreamChunk: 流式数据类型
 *
 *          导出函数：
 *          - chat: 生成流式聊天响应
 *
 *          请求参数（chat）：
 *          - model: AI 模型标识符
 *          - apiKey: 模型访问的 API 密钥
 *          - provider: API 提供商（默认 '302AI'）
 *          - messages: 对话历史（PlaygroundMessage[]）
 *          - frequencyPenalty: 频繁使用 token 的惩罚（可选）
 *          - presencePenalty: token 存在的惩罚（可选）
 *          - temperature: 响应生成中的随机性（可选）
 *          - topP: 核采样参数（可选）
 *          - maxTokens: 模型响应的最大 token 数（可选）
 *
 *          响应格式：
 *          - output: AsyncIterable<StreamChunk> 可流式响应的值
 *
 *          依赖关系：
 *          - @/env: 环境变量配置
 *          - @/stores/playground: PlaygroundMessage 和 LogProbs 类型
 *          - @/utils/api: normalizeUrl 工具函数
 *          - @/utils/logger: 日志记录工具
 *          - ky: HTTP 客户端库
 *
 *          注意：Claude 3.5 模型会自动设置 max_tokens 为 8192
 */

'use server'

import { env } from '@/env'
import { PlaygroundMessage, LogProbs } from '@/stores/playground'
import { normalizeUrl } from '@/utils/api'
import { logger } from '@/utils/logger'
import ky from 'ky'

/**
 * 模型响应允许的最大 token 数量
 * 当前设置为兼容 Claude 3.5 模型
 */
const MAX_TOKENS = 8192

/**
 * 聊天错误类
 * 用于处理聊天生成过程中的错误
 */
class ChatError extends Error {
  constructor(message: string, options?: { cause: any }) {
    super(message, options)
    this.name = 'ChatError'
  }
}

/**
 * 流式数据类型
 */
type StreamChunk = {
  type: string
  textDelta?: string
  logprobs?: LogProbs
}

/**
 * 异步生成器函数，用于处理流式响应
 */
async function* streamChatResponse(
  model: string,
  apiKey: string,
  provider: string,
  messages: any[],
  frequencyPenalty?: number,
  presencePenalty?: number,
  temperature?: number,
  topP?: number,
  maxTokens?: number
): AsyncGenerator<StreamChunk> {
  // 根据 provider 选择 API URL
  let baseUrl = ''
  if (provider === '魔力方舟') {
    baseUrl = normalizeUrl('https://ai.gitee.com') + '/v1'
  } else {
    baseUrl = normalizeUrl(env.AI_302_API_URL || 'https://api.302.ai') + '/v1'
  }
  
  const requestBody: any = {
    model,
    messages,
    stream: true,
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
      },
      json: requestBody,
      retry: 0,
      timeout: false,
    })

    const reader = response.body?.getReader()
    if (!reader) {
      throw new ChatError('No response body')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6)
          if (data === '[DONE]') {
            return
          }

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta

            if (delta?.content) {
              yield {
                type: 'text-delta',
                textDelta: delta.content,
              }
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
  } catch (error) {
    logger.error('Chat API request failed', error as Error, { module: 'Chat' })
    throw new ChatError('Chat API request failed', { cause: error })
  }
}

/**
 * 使用 AI 模型生成聊天响应的服务器操作
 * 支持流式响应和各种模型参数以微调输出
 */
export async function chat({
  model,
  apiKey,
  provider,
  messages,
  frequencyPenalty,
  presencePenalty,
  temperature,
  topP,
  maxTokens,
}: {
  model: string
  apiKey: string
  provider?: string
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

  // 根据 provider 选择 API 密钥
  let effectiveApiKey = ''
  if (provider === '魔力方舟') {
    effectiveApiKey = apiKey || env.AI_GITEE_API_KEY || ''
  } else {
    effectiveApiKey = apiKey || env.AI_302_API_KEY || ''
  }

  logger.info('Starting chat generation', {
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
      hasApiKey: !!effectiveApiKey,
      apiKeySource: apiKey ? 'user' : 'environment',
    },
    module: 'Chat',
  })

  return {
    output: streamChatResponse(
      model,
      effectiveApiKey,
      provider || '302AI',
      formattedMessages,
      frequencyPenalty,
      presencePenalty,
      temperature,
      topP,
      maxTokens
    ),
  }
}
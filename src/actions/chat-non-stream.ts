/**
 * @fileoverview 处理使用 AI 模型生成聊天消息的服务器操作（非流式）
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了非流式聊天消息生成的服务器端操作。
 *          通过调用 AI 模型 API，根据对话历史和模型参数生成完整的聊天响应。
 *
 *          主要功能包括：
 *          - 支持非流式聊天响应
 *          - 支持多种模型参数配置（temperature、topP、frequencyPenalty 等）
 *          - 支持包含文件（如图像）的多模态消息
 *          - 消息格式化和 API 请求构建
 *          - 统一的错误处理和日志记录
 *
 *          导出函数：
 *          - chatNonStream: 生成非流式聊天响应
 *
 *          请求参数：
 *          - model: AI 模型标识符
 *          - apiKey: 模型访问的 API 密钥
 *          - messages: 对话历史（PlaygroundMessage[]）
 *          - frequencyPenalty: 频繁使用 token 的惩罚（可选）
 *          - presencePenalty: token 存在的惩罚（可选）
 *          - temperature: 响应生成中的随机性（可选）
 *          - topP: 核采样参数（可选）
 *          - maxTokens: 模型响应的最大 token 数（可选）
 *
 *          响应格式：
 *          - content: 聊天响应内容
 *          - usage: token 使用情况统计
 *
 *          依赖关系：
 *          - @/env: 环境变量配置
 *          - @/stores/playground: PlaygroundMessage 类型
 *          - @/utils/api: normalizeUrl 工具函数
 *          - @/utils/logger: 日志记录工具
 *          - ky: HTTP 客户端库
 *
 *          注意：Claude 3.5 模型会自动设置 max_tokens 为 8192
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

  logger.info('开始非流式聊天生成', {
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

    logger.info('非流式聊天成功完成', {
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
    logger.error('非流式聊天 API 请求失败', error as Error, { module: 'ChatNonStream' })
    throw new ChatError('Non-stream chat API request failed', { cause: error })
  }
}
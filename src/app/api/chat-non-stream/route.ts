/**
 * @fileoverview 非流式聊天 API 路由处理
 * 提供非流式聊天响应的 API 端点
 * @author 祁筱欣
 * @date 2025-12-30
 * @license AGPL-3.0 license
 * @remark 处理非流式聊天请求
 */

import { env } from '@/env'
import { normalizeUrl } from '@/utils/api'
import { logger } from '@/utils/logger'

/**
 * 处理非流式聊天 API 的 POST 请求
 *
 * @function POST
 * @async
 * @param {Request} req - HTTP 请求对象
 * @returns {Promise<Response>} 响应对象
 */
export async function POST(req: Request) {
  try {
    const {
      model,
      apiKey,
      provider,
      messages,
      frequencyPenalty,
      presencePenalty,
      temperature,
      topP,
      maxTokens,
    } = await req.json()

    // 根据 provider 选择 API URL 和密钥
    let effectiveApiKey = ''
    let baseUrl = ''

    if (provider === '魔力方舟') {
      effectiveApiKey = apiKey || env.AI_GITEE_API_KEY || ''
      baseUrl = normalizeUrl('https://ai.gitee.com') + '/v1'
    } else {
      // 默认使用 302AI
      effectiveApiKey = apiKey || env.AI_302_API_KEY || ''
      baseUrl = normalizeUrl(env.AI_302_API_URL || 'https://api.302.ai') + '/v1'
    }

    if (!effectiveApiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // 过滤 messages，只保留 role 和 content
    const filteredMessages = messages.map((msg: any) => {
      if (typeof msg.content === 'string') {
        return {
          role: msg.role,
          content: msg.content,
        }
      }
      return {
        role: msg.role,
        content: msg.content,
      }
    })

const requestBody: any = {
      model,
      messages: filteredMessages,
    }

    // 魔力方舟支持的参数：frequency_penalty, temperature, top_p, max_tokens
    if (frequencyPenalty !== undefined) requestBody.frequency_penalty = frequencyPenalty
    if (temperature !== undefined) requestBody.temperature = temperature
    if (topP !== undefined) requestBody.top_p = topP
    if (maxTokens !== undefined) requestBody.max_tokens = maxTokens

    logger.info('Starting non-stream chat API request', {
      context: { model, messagesCount: messages.length },
      module: 'ChatNonStreamAPI'
    })

    logger.debug('Request details', {
      context: {
        model,
        messagesCount: messages.length,
        frequencyPenalty,
        presencePenalty,
        temperature,
        topP,
        maxTokens,
        hasApiKey: !!effectiveApiKey,
      },
      module: 'ChatNonStreamAPI'
    })

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    logger.debug('API response received', {
      context: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      },
      module: 'ChatNonStreamAPI'
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Non-stream chat API request failed', new Error(errorText), {
        context: {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          requestBody: JSON.stringify(requestBody, null, 2)
        },
        module: 'ChatNonStreamAPI'
      })
      return new Response(
        JSON.stringify({ error: errorText || '请求处理失败，请稍后重试' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await response.json()
    logger.info('Non-stream chat API request completed successfully', {
      context: {
        model,
        messagesCount: messages.length,
        usage: data.usage,
      },
      module: 'ChatNonStreamAPI'
    })
    return Response.json(data)
  } catch (error) {
    logger.error('Non-stream chat API error:', error as Error, { module: 'ChatNonStreamAPI' })
    return new Response(
      JSON.stringify({ error: '请求处理失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
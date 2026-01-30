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
      messages,
      frequencyPenalty,
      presencePenalty,
      temperature,
      topP,
      maxTokens,
    } = await req.json()

    // 优先使用传入的 apiKey，如果没有则使用环境变量
    const effectiveApiKey = apiKey || env.AI_302_API_KEY || ''

    if (!effectiveApiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

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
        context: { status: response.status, statusText: response.statusText },
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
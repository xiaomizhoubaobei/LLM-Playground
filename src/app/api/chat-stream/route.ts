/**
 * @fileoverview 流式聊天 API 路由处理
 * 提供流式聊天响应的 API 端点
 * @author 祁筱欣
 * @date 2025-12-30
 * @license AGPL-3.0 license
 * @remark 处理流式聊天请求
 */

import { env } from '@/env'
import { normalizeUrl } from '@/utils/api'
import { logger } from '@/utils/logger'

/**
 * 处理流式聊天 API 的 POST 请求
 *
 * @function POST
 * @async
 * @param {Request} req - HTTP 请求对象
 * @returns {Promise<Response>} 流式响应对象
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
      stream: true,
    }

    // 魔力方舟支持的参数：frequency_penalty, temperature, top_p, max_tokens
    if (frequencyPenalty !== undefined) requestBody.frequency_penalty = frequencyPenalty
    if (temperature !== undefined) requestBody.temperature = temperature
    if (topP !== undefined) requestBody.top_p = topP
    if (maxTokens !== undefined) requestBody.max_tokens = maxTokens

    logger.info('Starting stream chat API request', {
      context: { model, messagesCount: messages.length },
      module: 'ChatStreamAPI'
    })

    logger.debug('Request details', {
      context: {
        model,
        messagesCount: messages.length,
        originalMessages: JSON.stringify(messages, null, 2),
        filteredMessages: JSON.stringify(filteredMessages, null, 2),
        requestBody: JSON.stringify(requestBody, null, 2),
        frequencyPenalty,
        presencePenalty,
        temperature,
        topP,
        maxTokens,
        hasApiKey: !!effectiveApiKey,
        baseUrl,
      },
      module: 'ChatStreamAPI'
    })

    // 转发请求到上游 API
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
      module: 'ChatStreamAPI'
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Stream chat API request failed', new Error(`API request failed: ${response.statusText}`), {
        context: {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          requestBody: JSON.stringify(requestBody, null, 2)
        },
        module: 'ChatStreamAPI'
      })
      throw new Error(`API request failed: ${response.statusText} - ${errorText}`)
    }

    logger.info('Stream chat API request initiated successfully', {
      context: { model, messagesCount: messages.length },
      module: 'ChatStreamAPI'
    })

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    logger.error('Stream chat API error:', error as Error, { module: 'ChatStreamAPI' })
    return new Response(
      JSON.stringify({ error: '请求处理失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
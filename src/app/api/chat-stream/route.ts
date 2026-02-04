/**
 * @fileoverview 流式聊天 API 路由处理
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了流式聊天 API 路由处理，用于处理实时流式聊天请求。
 *          主要功能包括：
 *          - 支持流式聊天响应（Server-Sent Events）
 *          - 支持多种 API 提供商（302AI、魔力方舟）
 *          - 消息内容过滤和标准化
 *          - 支持多种模型参数（temperature、top_p、max_tokens、frequency_penalty）
 *          - 统一的错误处理和日志记录
 *
 *          API 端点：POST /api/chat-stream
 *
 *          请求参数：
 *          - model: 模型名称
 *          - apiKey: API 密钥（可选，使用环境变量作为默认值）
 *          - provider: API 提供商（302AI 或 魔力方舟）
 *          - messages: 消息数组 [{ role, content }]
 *          - frequencyPenalty: 频率惩罚（可选）
 *          - presencePenalty: 存在惩罚（可选，当前未使用）
 *          - temperature: 温度参数（可选）
 *          - topP: 采样概率（可选）
 *          - maxTokens: 最大令牌数（可选）
 *
 *          响应格式：
 *          - 成功：流式响应（text/event-stream）
 *          - 失败：{ error: "错误信息" }
 *
 *          依赖关系：
 *          - @/env: 环境变量配置
 *          - @/utils/api: normalizeUrl 函数用于 URL 标准化
 *          - @/utils/logger: 日志记录工具
 */

import { env } from '@/env'
import { normalizeUrl } from '@/utils/api'
import { logger } from '@/utils/logger'

/**
 * 处理流式聊天 API 的 POST 请求
 *
 * @function POST
 * @async
 * @param req - HTTP 请求对象
 * @returns 流式响应对象
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

    logger.info('开始流式聊天 API 请求', {
      context: { model, messagesCount: messages.length },
      module: 'ChatStreamAPI'
    })

    logger.debug('请求详情', {
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

    logger.debug('收到 API 响应', {
      context: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      },
      module: 'ChatStreamAPI'
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('流式聊天 API 请求失败', new Error(`API request failed: ${response.statusText}`), {
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

    logger.info('流式聊天 API 请求成功启动', {
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
    logger.error('流式聊天 API 错误:', error as Error, { module: 'ChatStreamAPI' })
    return new Response(
      JSON.stringify({ error: '请求处理失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
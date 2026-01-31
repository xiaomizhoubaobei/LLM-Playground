/**
 * @fileoverview 聊天 API 路由处理
 * 提供基于 OpenAI 兼容 API 的聊天流式响应功能
 * @author zpl
 * @created 2024-11-20
 * @modified 2025-12-26
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理聊天请求，返回流式响应
 */

import { env } from '@/env'

/**
 * 允许流式响应的最长时间（30秒）
 * @constant
 * @type {number}
 * @since 2024-11-20
 */
export const maxDuration = 3000

/**
 * 处理聊天 API 的 POST 请求
 * 接收消息数组，返回流式 AI 响应
 * 
 * @function POST
 * @async
 * @param {Request} req - HTTP 请求对象，包含消息数组
 * @returns {Promise<Response>} 流式响应对象
 * @since 2024-11-20
 */
export async function POST(req: Request) {
  const { messages, apiKey, provider } = await req.json()

  // 根据 provider 选择 API URL 和密钥
  let effectiveApiKey = ''
  let apiUrl = ''

  if (provider === '魔力方舟') {
    effectiveApiKey = apiKey || env.AI_GITEE_API_KEY || ''
    apiUrl = 'https://ai.gitee.com/v1/chat/completions'
  } else {
    // 默认使用 302AI
    effectiveApiKey = apiKey || env.AI_302_API_KEY || ''
    apiUrl = 'https://api.302.ai/v1/chat/completions'
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

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(
      JSON.stringify({ error: '请求处理失败，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
/**
 * @fileoverview 聊天 API 路由处理
 * 提供基于 OpenAI 兼容 API 的聊天流式响应功能
 * @author zpl
 * @created 2024-11-20
 * @modified 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理聊天请求，返回流式响应，支持 logprobs 和数据流注释
 */

import { env } from '@/env'
import { createOpenAI } from '@ai-sdk/openai'
import { createDataStreamResponse, generateId, JSONValue, streamText } from 'ai'

/**
 * 允许流式响应的最长时间（30秒）
 * @constant
 * @type {number}
 * @since 2024-11-20
 */
export const maxDuration = 3000

/**
 * 创建 OpenAI 兼容的模型实例
 * 使用 302.ai 作为 API 提供商
 * @constant
 * @type {Object}
 * @since 2024-11-20
 */
const model = createOpenAI({
  apiKey: env.AI_302_API_KEY,
  baseURL: 'https://api.302.ai/v1',
})

/**
 * 处理聊天 API 的 POST 请求
 * 接收消息数组，返回流式 AI 响应
 * 
 * @function POST
 * @async
 * @param {Request} req - HTTP 请求对象，包含消息数组
 * @returns {Promise<Response>} 流式响应对象
 * @since 2024-11-20
 * 
 * @example
 * // 请求示例：
 * // POST /api/chat
 * // Body: { "messages": [{ "role": "user", "content": "Hello" }] }
 * 
 * @example
 * // 响应示例：
 * // 返回流式文本数据，包含 AI 生成的响应和 logprobs
 */
export async function POST(req: Request) {
  const { messages } = await req.json()

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData('initialized call')

      const result = streamText({
        model: model('gpt-4o', { logprobs: 3 }),
        messages,
        onChunk() {
          dataStream.writeMessageAnnotation({ chunk: '123' })
        },
        onFinish: (res) => {
          // 消息注释：
          dataStream.writeMessageAnnotation({
            id: generateId(),
            other: {
              logprobs: res.logprobs
            } as JSONValue,
          })

          // 调用注释：
          dataStream.writeData('call completed')
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error) => {
      /**
       * 安全的错误处理函数
       * 过滤敏感信息，仅向客户端公开安全的错误消息
       * 
       * @function getSafeErrorMessage
       * @param {unknown} error - 错误对象
       * @returns {string} 安全的错误消息
       * @since 2024-11-20
       */
      const getSafeErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
          // 记录完整错误信息用于调试
          console.error('Chat API Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          })

          // 检查是否为已知的可安全公开的错误
          const safeErrors = [
            'Network timeout',
            'Rate limit exceeded',
            'Invalid API key',
            'Model not available',
            'Content policy violation'
          ]

          // 如果错误消息包含已知的安全错误，则返回
          if (safeErrors.some(safeError => 
            error.message.toLowerCase().includes(safeError.toLowerCase())
          )) {
            return error.message
          }

          // 对于其他错误，返回通用错误消息
          return '请求处理失败，请稍后重试'
        }
        
        // 对于非 Error 对象的错误
        console.error('Unknown error type:', error)
        return '服务器内部错误'
      }

      return getSafeErrorMessage(error)
    },
  })
}

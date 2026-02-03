/**
 * @fileoverview 错误处理工具函数，提供统一的错误处理和错误信息提取功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了统一的错误处理工具函数，用于从各种错误对象中提取可读的错误信息，
 *          并识别常见的错误类型（网络错误、认证错误、速率限制错误等）。
 *          主要功能包括：
 *          - 从错误对象中提取可读的错误信息
 *          - 判断错误类型（网络错误、认证错误、速率限制错误）
 *          - 获取用户友好的错误提示
 *
 *          使用场景：
 *          - API 请求错误处理
 *          - 用户界面错误提示
 *          - 日志记录和错误追踪
 */

/**
 * 从错误对象中提取可读的错误信息
 * @param {unknown} error - 错误对象
 * @returns {string} 可读的错误信息
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  if (error && typeof error === 'object' && 'toString' in error) {
    try {
      return String(error)
    } catch {
      return '未知错误'
    }
  }

  return '未知错误'
}

/**
 * 判断是否为网络错误
 * @param {unknown} error - 错误对象
 * @returns {boolean} 是否为网络错误
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('connection')
  )
}

/**
 * 判断是否为认证错误
 * @param {unknown} error - 错误对象
 * @returns {boolean} 是否为认证错误
 */
export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes('unauthorized') ||
    message.includes('401') ||
    message.includes('authentication') ||
    message.includes('api key')
  )
}

/**
 * 判断是否为速率限制错误
 * @param {unknown} error - 错误对象
 * @returns {boolean} 是否为速率限制错误
 */
export function isRateLimitError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes('rate limit') ||
    message.includes('429') ||
    message.includes('too many requests')
  )
}

/**
 * 获取用户友好的错误提示
 * @param {unknown} error - 错误对象
 * @param {string} defaultMessage - 默认错误信息
 * @returns {string} 用户友好的错误提示
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  defaultMessage: string = '操作失败，请稍后重试'
): string {
  const message = getErrorMessage(error)

  if (isNetworkError(error)) {
    return '网络连接失败，请检查网络设置后重试'
  }

  if (isAuthError(error)) {
    return '认证失败，请检查 API Key 是否正确'
  }

  if (isRateLimitError(error)) {
    return '请求过于频繁，请稍后再试'
  }

  // 如果错误信息比较短，直接返回
  if (message.length < 100) {
    return message
  }

  // 否则返回默认信息
  return defaultMessage
}
/**
 * @fileoverview Next.js 国际化（i18n）代理配置
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理应用程序的语言路由和本地化中间件
 */

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

/**
 * 创建并导出国际化代理函数
 * 处理基于语言的路由和应用程序本地化
 *
 * @function proxy
 * @param {NextRequest} request - Next.js 请求对象
 * @returns {Response} Next.js 响应对象
 * @see {@link https://next-intl-docs.vercel.app/docs/routing/middleware|Next-intl Middleware}
 */
export function proxy(request: NextRequest) {
  const intlMiddleware = createMiddleware(routing)
  return intlMiddleware(request)
}

/**
 * 代理配置对象，指定要匹配的 URL 模式
 * @constant
 * @type {Object}
 * @property {string[]} matcher - URL 模式数组：
 *   - '/' : 匹配根路径
 *   - '/(zh|en|ja)/:path*' : 匹配以语言代码（zh、en、ja）开头的路径
 * @example 匹配的路径示例：
 * - '/' → 根路径
 * - '/zh/about' → 中文页面
 * - '/en/contact' → 英文页面
 * - '/ja/products' → 日文页面
 */
export const config = {
  matcher: ['/', '/(zh|en|ja)/:path*'],
}

/**
 * @fileoverview Next.js 国际化（i18n）代理配置
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了基于 next-intl 的国际化代理中间件，负责处理应用程序的语言路由和本地化功能。
 *          该代理作为 Next.js 中间件运行，自动处理以下任务：
 *          - 根据用户的语言偏好自动重定向到对应的本地化路径
 *          - 解析和验证 URL 中的语言前缀（zh/en/ja）
 *          - 提供当前语言环境信息给其他模块使用
 *          - 确保未匹配的路径正确路由到默认语言版本
 *
 *          工作流程：
 *          1. 接收 Next.js 请求对象
 *          2. 使用 createMiddleware 创建国际化中间件实例
 *          3. 应用 routing 配置（定义在 ./i18n/routing）处理路由逻辑
 *          4. 返回处理后的响应对象
 *
 *          依赖关系：
 *          - 依赖 ./i18n/routing 模块获取路由配置
 *          - 作为 Next.js 项目的核心中间件，在 next.config.mjs 中配置
 */

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

/**
 * 创建并导出国际化代理函数
 * 处理基于语言的路由和应用程序本地化
 *
 * @function proxy
 * @param request - Next.js 请求对象
 * @see {@link https://next-intl-docs.vercel.app/docs/routing/middleware|Next-intl Middleware}
 */
export function proxy(request: NextRequest): Response {
  const intlMiddleware = createMiddleware(routing)
  return intlMiddleware(request)
}

/**
 * 代理配置对象，指定要匹配的 URL 模式
 * @example 匹配的路径示例：
 * - '/' → 根路径
 * - '/zh/about' → 中文页面
 * - '/en/contact' → 英文页面
 * - '/ja/products' → 日文页面
 */
export const config: {
  matcher: string[]
} = {
  matcher: ['/', '/(zh|en|ja)/:path*'],
}

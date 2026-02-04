/**
 * @fileoverview next-intl 国际化的请求配置
 * 处理应用程序的语言环境检测和消息加载
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块配置 next-intl 的请求国际化设置，自动检测用户的语言环境并加载对应的翻译消息。
 *          主要功能包括：
 *          - 根据路由配置自动检测语言环境
 *          - 动态加载语言特定的消息文件
 *          - 提供服务端的国际化请求配置
 *
 *          使用场景：
 *          - Next.js 应用的多语言支持
 *          - 用户语言偏好检测
 *          - 服务端渲染时的国际化内容加载
 */

import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * 配置传入请求的国际化设置
 *
 * @function getRequestConfig
 * @async
 * @param params - 配置参数
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // 如果请求的语言环境无效，则回退到默认语言环境
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})

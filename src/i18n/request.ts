/**
 * @fileoverview next-intl 国际化的请求配置
 * 处理应用程序的语言环境检测和消息加载
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 配置传入请求的国际化设置，自动加载语言特定的消息文件
 */

import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * 配置传入请求的国际化设置
 * 
 * @function getRequestConfig
 * @async
 * @param {Object} params - 配置参数
 * @param {Promise<string>} params.requestLocale - 来自客户端的请求语言环境
 * @returns {Promise<{locale: string, messages: Object}>} 语言环境配置和消息
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

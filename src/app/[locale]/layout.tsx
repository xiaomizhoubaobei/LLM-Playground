/**
 * @fileoverview 应用程序的根布局组件，提供国际化支持和全局样式
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理应用程序的根布局、国际化和全局状态管理
 */

import { routing } from '@/i18n/routing'
import '@/styles/globals.css'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'

/**
 * 页面元数据配置
 * @constant
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'LLM Playground',
  description: '302AI\'s playground for LLM',
}

/**
 * 根布局组件，为应用程序提供基础结构和国际化支持
 * 
 * @async
 * @function RootLayout
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {Object} props.params - 路由参数
 * @param {string} props.params.locale - 语言代码
 * @returns {Promise<JSX.Element>} 渲染的布局组件
 */
export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // 验证语言代码是否在支持的语言列表中
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // 获取国际化消息
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body className='min-h-screen antialiased'>
        <JotaiProvider>
          <NextIntlClientProvider messages={messages}>
            <Toaster />
            {children}
          </NextIntlClientProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}

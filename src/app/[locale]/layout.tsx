/**
 * @fileoverview LLM 游乐场根布局组件，提供国际化支持和全局样式
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块是应用程序的根布局组件，为整个应用提供基础结构和全局功能支持。
 *          主要功能包括：
 *          - 国际化支持：基于 next-intl 实现多语言切换（中文、英文、日文）
 *          - 主题切换：基于 next-themes 实现明暗主题切换
 *          - 全局状态管理：基于 Jotai 提供应用级状态管理
 *          - 全局样式：引入 Tailwind CSS 和自定义全局样式
 *          - 消息通知：集成 Sonner 提供全局消息提示功能
 *          - 页面元数据：配置页面标题、描述和图标
 *          - 语言验证：验证 URL 中的语言参数是否在支持的语言列表中
 *
 *          工作流程：
 *          1. 接收 Next.js 路由参数（包含语言代码）
 *          2. 验证语言代码是否在支持的语言列表中
 *          3. 如果无效，调用 notFound() 返回 404 页面
 *          4. 如果有效，获取对应语言的国际化消息
 *          5. 渲染包含所有 Provider 的根布局
 *
 *          依赖关系：
 *          - @/i18n/routing: 路由配置和语言列表
 *          - @/styles/globals.css: 全局样式文件
 *          - next-intl: 国际化支持
 *          - jotai: 状态管理
 *          - next-themes: 主题切换
 *          - sonner: 消息通知
 */

import { routing } from '@/i18n/routing'
import '@/styles/globals.css'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'

/**
 * 页面元数据配置
 * @constant
 */
export const metadata: Metadata = {
  title: 'LLM Playground',
  description: '302AI\'s playground for LLM',
  icons: {
    icon: '/favicon.webp',
    shortcut: '/favicon.webp',
    apple: '/apple-touch-icon.png',
  },
}

/**
 * 根布局组件，为应用程序提供基础结构和国际化支持
 *
 * @async
 * @function RootLayout
 * @param props - 组件属性
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // 解构 params 中的 locale（Next.js 16 需要使用 await）
  const { locale } = await params

  // 验证语言代码是否在支持的语言列表中
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // 获取国际化消息
  const messages = await getMessages()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className='min-h-screen antialiased'>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <JotaiProvider>
            <NextIntlClientProvider messages={messages}>
              <Toaster />
              {children}
            </NextIntlClientProvider>
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

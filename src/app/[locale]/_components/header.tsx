/**
 * @fileoverview 头部组件，提供导航栏和操作按钮
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块是应用程序的头部导航栏组件，提供完整的导航和操作功能。
 *          主要功能包括：
 *          - 会话列表切换：显示/隐藏会话列表侧边栏
 *          - 新建对话：创建新的对话会话
 *          - 导出功能：将当前对话导出为 Markdown 文件
 *          - 清空消息：清空当前会话的所有消息
 *          - 主题切换：支持明暗主题切换
 *          - 键盘快捷键：显示可用的键盘快捷键
 *          - 设置触发：打开设置侧边栏
 *          - 响应式设计：适配不同屏幕尺寸
 *
 *          工作流程：
 *          1. 渲染左侧导航区域（会话列表、新对话、应用标题）
 *          2. 渲染右侧操作区域（导出、清空、主题、快捷键、设置）
 *          3. 所有操作通过回调函数通知父组件
 *          4. 提供提示信息增强用户体验
 *
 *          依赖关系：
 *          - @/components/playground/setting-trigger: 设置触发器组件
 *          - @/components/theme-switcher: 主题切换组件
 *          - @/components/keyboard-shortcuts: 键盘快捷键组件
 *          - @/components/ui: UI 组件库（Button、Tooltip 等）
 *          - next-intl: 国际化支持
 */

'use client'

import { SettingTrigger } from '@/components/playground/setting-trigger'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageSquare, FileDown, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils/tailwindcss'

/**
 * 头部组件的属性接口
 * @interface HeaderProps
 * @property {Function} onExport - 导出聊天记录的处理函数
 * @property {Function} onResetMessages - 重置消息历史记录的处理函数
 * @property {Function} onNewConversation - 创建新对话的处理函数
 * @property {boolean} showConversationList - 是否显示会话列表
 * @property {Function} onToggleConversationList - 切换会话列表显示的处理函数
 */
interface HeaderProps {
  onExport: () => void
  onResetMessages: () => void
  onNewConversation: () => Promise<void>
  showConversationList?: boolean
  onToggleConversationList?: () => void
}

/**
 * 头部组件，提供导航栏和操作按钮
 *
 * @function Header
 * @param props - 组件属性
 */
export function Header({
  onExport,
  onResetMessages,
  onNewConversation,
  showConversationList = false,
  onToggleConversationList,
}: HeaderProps) {
  // 获取国际化翻译函数
  const t = useTranslations('playground')
  return (
    <header className='flex h-14 items-center justify-between border-b border-border/40 bg-gradient-to-r from-background via-background to-muted/20 px-5 shadow-sm backdrop-blur-sm'>
      <div className='flex items-center gap-2.5'>
        {onToggleConversationList && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn(
                    'h-8 w-8 rounded-md transition-all duration-200',
                    showConversationList
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-primary/10 hover:text-primary'
                  )}
                  onClick={onToggleConversationList}
                >
                  <MessageSquare className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={4}
                className='max-w-xs select-text break-words rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-gray-50 shadow-md'
              >
                <p>历史对话</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200'
                onClick={onNewConversation}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-gray-50 shadow-md'
            >
              <p>新对话</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='flex items-center gap-1.5'>
          <div className='h-6 w-0.5 rounded-full bg-gradient-to-b from-primary to-primary/60' />
          <span className='text-base font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            Playground
          </span>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200'
                onClick={onExport}
              >
                <FileDown className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-gray-50 shadow-md'
            >
              <p>{t('exportTooltipMD')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-md hover:bg-destructive/10 hover:text-destructive transition-all duration-200'
                onClick={onResetMessages}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-gray-50 shadow-md'
            >
              <p>{t('clearMessagesTooltip')}</p>
            </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        <ThemeSwitcher />

        <KeyboardShortcuts />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SettingTrigger />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-gray-50 shadow-md'
            >
              <p>{t('settingsTooltip')}</p>
            </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
  )
}

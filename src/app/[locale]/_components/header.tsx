/**
 * @fileoverview 头部组件，提供导航栏和操作按钮
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 licens
 * @remark 处理应用程序顶部导航栏，包括返回按钮、导出和清空消息功能
 */

'use client'

import { SettingTrigger } from '@/components/playground/setting-trigger'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, FileDown, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

/**
 * 头部组件的属性接口
 * @interface HeaderProps
 * @property {Function} onExport - 导出聊天记录的处理函数
 * @property {Function} onResetMessages - 重置消息历史记录的处理函数
 */
interface HeaderProps {
  onExport: () => void
  onResetMessages: () => void
}

/**
 * 头部组件，提供导航栏和操作按钮
 * 
 * @function Header
 * @param {HeaderProps} props - 组件属性
 * @returns {JSX.Element} 渲染的头部组件
 */
export function Header({ onExport, onResetMessages }: HeaderProps) {
  // 获取国际化翻译函数
  const t = useTranslations('playground')
  // 获取路由器实例，用于页面导航
  const router = useRouter()

  /**
   * 处理返回上一页的操作
   * @function handleBack
   */
  const handleBack = () => {
    router.back()
  }

  return (
    <header className='flex h-16 items-center justify-between border-b border-gray-200 bg-background px-6'>
      <div className='flex items-center gap-2'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' onClick={handleBack}>
                <ArrowLeft className='h-5 w-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
            >
              <p>{t('backTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className='text-xl font-semibold'>Playground</span>
      </div>
      <div className='flex items-center gap-4'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onExport}>
                <FileDown className='h-5 w-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
            >
              <p>{t('exportTooltipMD')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onResetMessages}>
                <Trash2 className='h-5 w-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
            >
              <p>{t('clearMessagesTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SettingTrigger />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
            >
              <p>{t('settingsTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

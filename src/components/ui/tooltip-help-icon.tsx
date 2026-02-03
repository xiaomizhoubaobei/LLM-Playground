/**
 * @fileoverview 帮助图标工具提示组件，显示带有帮助图标的可点击提示信息
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了帮助图标工具提示组件，显示带有帮助图标的可点击提示信息。
 *
 *          主要功能包括：
 *          - 帮助图标显示
 *          - 工具提示显示
 *          - 自定义样式
 *          - 无障碍支持
 *
 *          导出组件：
 *          - TooltipHelpIcon: 工具提示帮助图标组件
 *
 *          使用场景：
 *          - 帮助信息提示
 *          - 功能说明
 *          - 工具提示
 *          - 辅助信息
 */

import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

/**
 * 工具提示帮助图标组件的属性接口
 */
interface TooltipHelpIconProps {
  content: React.ReactNode
  className?: string
}

/**
 * 工具提示帮助图标组件
 * 显示一个可点击的帮助图标，悬停时显示提示内容
 */
export function TooltipHelpIcon({ content, className = 'h-4 w-4 text-gray-400 hover:text-gray-500' }: TooltipHelpIconProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* 帮助图标按钮 */}
          <button
            type='button'
            className='cursor-help'
            onClick={(e) => e.preventDefault()}
          >
            <HelpCircle className={className} />
          </button>
        </TooltipTrigger>
        {/* 工具提示内容 */}
        <TooltipContent
          sideOffset={4}
          className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
        >
          {typeof content === 'string' ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

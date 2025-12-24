/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 帮助图标工具提示组件，显示带有帮助图标的可点击提示信息
 */

import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

/**
 * 工具提示帮助图标组件的属性接口
 */
interface TooltipHelpIconProps {
  /** 提示内容，可以是字符串或React节点 */
  content: React.ReactNode
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 工具提示帮助图标组件
 * 显示一个可点击的帮助图标，悬停时显示提示内容
 * 
 * @param {TooltipHelpIconProps} props - 组件属性
 * @returns {JSX.Element} 渲染的帮助图标组件
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

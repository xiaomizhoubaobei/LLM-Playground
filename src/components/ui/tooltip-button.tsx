/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 带工具提示的按钮组件，结合了按钮功能和工具提示显示
 */

import { ButtonProps } from "@/components/ui/button"
import { ReactNode } from "react"
import { Button } from "./button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip"

/**
 * 工具提示按钮组件的属性接口，继承自ButtonProps
 */
interface TooltipButtonProps extends ButtonProps {
  /** 工具提示内容 */
  tooltipContent: ReactNode
  /** 工具提示侧边偏移量 */
  tooltipSideOffset?: number
  /** 工具提示延迟时间 */
  tooltipDelayDuration?: number
  /** 工具提示的自定义CSS类名 */
  tooltipClassName?: string
  /** 按钮子元素 */
  children: ReactNode
}

/**
 * 工具提示按钮组件
 * 结合了按钮功能和工具提示显示，支持自定义样式和行为
 * 
 * @param {TooltipButtonProps} props - 组件属性
 * @returns {JSX.Element} 渲染的工具提示按钮组件
 */
export function TooltipButton({
  tooltipContent,
  tooltipSideOffset = 4,
  tooltipDelayDuration = 0,
  tooltipClassName = "max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50",
  children,
  ...buttonProps
}: TooltipButtonProps) {
  return (
    <TooltipProvider delayDuration={tooltipDelayDuration}>
      <Tooltip>
        {/* 按钮触发器 */}
        <TooltipTrigger asChild>
          <Button {...buttonProps}>{children}</Button>
        </TooltipTrigger>
        {/* 工具提示内容 */}
        <TooltipContent sideOffset={tooltipSideOffset} className={tooltipClassName}>
          {typeof tooltipContent === "string" ? (
            <p>{tooltipContent}</p>
          ) : (
            tooltipContent
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

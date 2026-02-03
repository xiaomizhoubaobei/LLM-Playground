/**
 * @fileoverview 带工具提示的按钮组件，结合了按钮功能和工具提示显示
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了带工具提示的按钮组件，结合了按钮功能和工具提示显示。
 *
 *          主要功能包括：
 *          - 按钮功能
 *          - 工具提示显示
 *          - 自定义延迟
 *          - 自定义样式
 *
 *          导出组件：
 *          - TooltipButton: 工具提示按钮组件
 *
 *          使用场景：
 *          - 操作按钮说明
 *          - 功能提示
 *          - 快捷键提示
 *          - 帮助信息
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
  tooltipContent: ReactNode
  tooltipSideOffset?: number
  tooltipDelayDuration?: number
  tooltipClassName?: string
  children: ReactNode
}

/**
 * 工具提示按钮组件
 * 结合了按钮功能和工具提示显示，支持自定义样式和行为
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

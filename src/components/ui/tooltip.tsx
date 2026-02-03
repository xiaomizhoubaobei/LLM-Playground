/**
 * @fileoverview 工具提示组件套件，提供完整的工具提示功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了工具提示组件套件，支持自定义定位和动画效果。
 *
 *          主要功能包括：
 *          - 自定义定位
 *          - 动画效果
 *          - 延迟显示
 *          - 无障碍支持
 *
 *          导出组件：
 *          - Tooltip: 工具提示根组件
 *          - TooltipProvider: 工具提示提供者
 *          - TooltipTrigger: 工具提示触发器
 *          - TooltipContent: 工具提示内容
 *
 *          使用场景：
 *          - 信息提示
 *          - 帮助信息
 *          - 快捷键提示
 *          - 功能说明
 */

'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

// 工具提示提供者组件，为工具提示提供上下文
const TooltipProvider = TooltipPrimitive.Provider

// 工具提示根组件，管理工具提示的状态
const Tooltip = TooltipPrimitive.Root

// 工具提示触发器组件，用于触发工具提示的显示
const TooltipTrigger = TooltipPrimitive.Trigger

// 工具提示内容组件，显示工具提示的实际内容
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }


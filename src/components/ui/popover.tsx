/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 弹出框组件，基于Radix UI提供的基础弹出框功能，支持自定义定位和动画效果
 */

'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

// 弹出框根组件
const Popover = PopoverPrimitive.Root

// 弹出框触发器组件
const PopoverTrigger = PopoverPrimitive.Trigger

// 弹出框锚点组件
const PopoverAnchor = PopoverPrimitive.Anchor

/**
 * 弹出框内容组件
 * 提供弹出框的主要内容区域，支持自定义对齐和偏移
 * 
 * @param {Object} props - 组件属性
 * @param {string} [props.className] - 额外的CSS类名
 * @param {'start'|'center'|'end'} [props.align='center'] - 内容对齐方式
 * @param {number} [props.sideOffset=4] - 侧边偏移量
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }

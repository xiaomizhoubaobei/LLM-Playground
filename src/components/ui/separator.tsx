/**
 * @fileoverview 分隔符组件，基于Radix UI提供的基础分隔符功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了分隔符组件，基于Radix UI提供的基础分隔符功能。
 *
 *          主要功能包括：
 *          - 水平分隔线
 *          - 垂直分隔线
 *          - 自定义样式
 *
 *          导出组件：
 *          - Separator: 分隔符组件
 *
 *          使用场景：
 *          - 内容分隔
 *          - 视觉分组
 *          - 布局分割
 */

'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 分隔符组件
 * 提供水平或垂直的分隔线，用于视觉上分隔内容区域
 *
 * @param props - 组件属性
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

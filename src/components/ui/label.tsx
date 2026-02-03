/**
 * @fileoverview 标签组件，基于Radix UI提供的基础标签功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了标签组件，基于Radix UI提供的基础标签功能。
 *
 *          主要功能包括：
 *          - 表单字段标识
 *          - 无障碍支持
 *          - 变体样式支持
 *
 *          导出组件：
 *          - Label: 标签组件
 *
 *          使用场景：
 *          - 表单标签
 *          - 输入框标识
 *          - 字段说明
 */

'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

// 标签变体定义，包含基础样式
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

/**
 * 标签组件
 * 用于表单字段的标识和说明
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

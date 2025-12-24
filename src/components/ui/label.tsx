/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 标签组件，基于Radix UI提供的基础标签功能，用于表单字段标识
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

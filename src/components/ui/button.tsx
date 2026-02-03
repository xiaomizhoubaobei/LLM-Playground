/**
 * @fileoverview 按钮组件，提供多种样式和尺寸的交互式按钮
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了按钮组件，支持多种样式、尺寸、状态和插槽功能。
 *
 *          主要功能包括：
 *          - 多种样式变体（默认、危险、描边、次要、幽灵、链接）
 *          - 多种尺寸选项（默认、小、大、图标）
 *          - 支持插槽模式（asChild）
 *          - 完整的键盘导航和无障碍支持
 *
 *          导出组件：
 *          - Button: 按钮组件
 *          - buttonVariants: 按钮变体配置
 *
 *          样式变体：
 *          - default: 默认主样式
 *          - destructive: 危险操作样式
 *          - outline: 描边样式
 *          - secondary: 次要样式
 *          - ghost: 幽灵样式
 *          - link: 链接样式
 *
 *          尺寸选项：
 *          - default: 默认尺寸
 *          - sm: 小尺寸
 *          - lg: 大尺寸
 *          - icon: 图标尺寸
 *
 *          使用场景：
 *          - 表单提交按钮
 *          - 操作触发按钮
 *          - 导航链接按钮
 *          - 图标按钮
 */

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 按钮组件的变体配置
 * 定义不同样式变体和尺寸的CSS类名及默认值
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/**
 * 按钮组件的属性接口
 * 继承HTML button属性和变体属性，支持插槽功能
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * 按钮组件
 * 提供多种样式和尺寸的交互式按钮，支持插槽模式
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供完整的卡片布局系统，用于组织内容展示和分组
 */

import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 卡片容器组件
 * 提供基础的内容容器样式和布局
 * 
 * @component Card
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div属性
 * @returns {JSX.Element} 返回卡片容器组件
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

/**
 * 卡片头部组件
 * 用于显示卡片的标题区域，通常包含标题和描述
 * 
 * @component CardHeader
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div属性
 * @returns {JSX.Element} 返回卡片头部组件
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * 卡片标题组件
 * 用于显示卡片的主要标题文本
 * 
 * @component CardTitle
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div属性
 * @returns {JSX.Element} 返回卡片标题组件
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * 卡片描述组件
 * 用于显示卡片的辅助描述文本
 * 
 * @component CardDescription
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div属性
 * @returns {JSX.Element} 返回卡片描述组件
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * 卡片内容组件
 * 用于显示卡片的主要内容区域
 * 
 * @component CardContent
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div属性
 * @returns {JSX.Element} 返回卡片内容组件
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

/**
 * 卡片底部组件
 * 用于显示卡片的操作按钮或底部信息
 * 
 * @component CardFooter
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div属性
 * @returns {JSX.Element} 返回卡片底部组件
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }


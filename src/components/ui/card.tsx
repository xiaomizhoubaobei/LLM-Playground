/**
 * @fileoverview 卡片组件套件，用于组织内容展示和分组
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了卡片组件套件，用于组织内容展示和分组。
 *
 *          主要功能包括：
 *          - 提供完整的卡片布局系统
 *          - 支持头部、内容、底部等区域划分
 *          - 支持标题和描述文本
 *          - 统一的样式和间距
 *
 *          导出组件：
 *          - Card: 卡片容器
 *          - CardHeader: 卡片头部
 *          - CardTitle: 卡片标题
 *          - CardDescription: 卡片描述
 *          - CardContent: 卡片内容
 *          - CardFooter: 卡片底部
 *
 *          使用场景：
 *          - 内容分组展示
 *          - 信息卡片
 *          - 功能模块展示
 *          - 数据统计卡片
 */

import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 卡片容器组件
 * 提供基础的内容容器样式和布局
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


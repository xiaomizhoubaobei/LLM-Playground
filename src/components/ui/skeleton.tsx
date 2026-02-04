/**
 * @fileoverview 骨架屏组件，用于在内容加载时显示占位符动画
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了骨架屏组件，用于在内容加载时显示占位符动画。
 *
 *          主要功能包括：
 *          - 脉冲动画效果
 *          - 自定义尺寸
 *          - 占位符显示
 *
 *          导出组件：
 *          - Skeleton: 骨架屏组件
 *
 *          使用场景：
 *          - 内容加载占位
 *          - 图片加载占位
 *          - 数据加载占位
 *          - 组件加载占位
 */

import { cn } from '@/utils/tailwindcss'

/**
 * 骨架屏组件
 * 在内容加载时显示带脉冲动画的占位符
 *
 * @param props - HTML div元素属性
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  )
}

export { Skeleton }

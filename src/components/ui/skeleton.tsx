/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 骨架屏组件，用于在内容加载时显示占位符动画
 */

import { cn } from '@/utils/tailwindcss'

/**
 * 骨架屏组件
 * 在内容加载时显示带脉冲动画的占位符
 * 
 * @param {React.HTMLAttributes<HTMLDivElement>} props - HTML div元素属性
 * @returns {JSX.Element} 渲染的骨架屏组件
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

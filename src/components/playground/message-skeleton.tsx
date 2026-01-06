/**
 * @fileoverview 消息列表骨架屏组件，在消息加载时显示
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供消息加载时的骨架屏效果，改善用户体验
 */

import React from 'react'
import { cn } from '@/utils/tailwindcss'

/**
 * 消息骨架屏组件的属性
 */
interface MessageSkeletonProps {
  /**
   * 是否显示头像
   */
  showAvatar?: boolean
  /**
   * 骨架屏数量
   */
  count?: number
  /**
   * 额外的CSS类名
   */
  className?: string
}

/**
 * 单条消息骨架屏
 */
function SingleMessageSkeleton({ showAvatar = true }: { showAvatar?: boolean }) {
  return (
    <div className='flex gap-3 p-4 animate-pulse'>
      {/* 头像骨架 */}
      {showAvatar && (
        <div className='h-8 w-8 shrink-0 rounded-full bg-muted' />
      )}

      {/* 消息内容骨架 */}
      <div className='flex-1 space-y-2'>
        {/* 用户名骨架 */}
        <div className='h-4 w-24 bg-muted rounded' />

        {/* 消息文本骨架 */}
        <div className='space-y-1.5'>
          <div className='h-4 w-full bg-muted rounded' />
          <div className='h-4 w-5/6 bg-muted rounded' />
          <div className='h-4 w-4/6 bg-muted rounded' />
        </div>

        {/* 操作按钮骨架 */}
        <div className='flex gap-2 pt-2'>
          <div className='h-6 w-16 bg-muted rounded' />
          <div className='h-6 w-16 bg-muted rounded' />
        </div>
      </div>
    </div>
  )
}

/**
 * 消息列表骨架屏组件
 *
 * @function MessageSkeleton
 * @param {MessageSkeletonProps} props - 组件属性
 * @returns {JSX.Element} 渲染的骨架屏组件
 */
export function MessageSkeleton({
  showAvatar = true,
  count = 3,
  className,
}: MessageSkeletonProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SingleMessageSkeleton key={index} showAvatar={showAvatar} />
      ))}
    </div>
  )
}
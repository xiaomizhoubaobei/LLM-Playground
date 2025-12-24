/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 分隔符组件，基于Radix UI提供的基础分隔符功能，用于视觉上分隔内容区域
 */

'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 分隔符组件
 * 提供水平或垂直的分隔线，用于视觉上分隔内容区域
 * 
 * @param {Object} props - 组件属性
 * @param {string} [props.className] - 额外的CSS类名
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal'] - 分隔符方向
 * @param {boolean} [props.decorative=true] - 是否为纯装饰性分隔符
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

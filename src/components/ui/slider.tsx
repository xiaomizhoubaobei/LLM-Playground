/**
 * @fileoverview 滑块组件，基于Radix UI提供的基础滑块功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了滑块组件，基于Radix UI提供的基础滑块功能。
 *
 *          主要功能包括：
 *          - 可拖动滑块
 *          - 数值选择
 *          - 范围调整
 *          - 自定义样式
 *
 *          导出组件：
 *          - Slider: 滑块组件
 *
 *          使用场景：
 *          - 数值调整
 *          - 音量控制
 *          - 进度设置
 *          - 范围选择
 */

'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 滑块组件
 * 提供可拖动的滑块控件，用于数值选择和范围调整
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    {/* 滑块轨道 */}
    <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
      {/* 滑块进度范围 */}
      <SliderPrimitive.Range className='absolute h-full bg-primary' />
    </SliderPrimitive.Track>
    {/* 滑块手柄 */}
    <SliderPrimitive.Thumb className='block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

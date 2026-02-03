/**
 * @fileoverview 开关组件，基于Radix UI提供的基础开关功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了开关组件，基于Radix UI提供的基础开关功能。
 *
 *          主要功能包括：
 *          - 两种状态切换
 *          - 自定义样式
 *          - 动画效果
 *          - 无障碍支持
 *
 *          导出组件：
 *          - Switch: 开关组件
 *
 *          使用场景：
 *          - 设置开关
 *          - 功能启用/禁用
 *          - 状态切换
 *          - 选项切换
 */

'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 开关组件
 * 提供可切换的开关控件，支持自定义样式和属性
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className
    )}
    {...props}
    ref={ref}
  >
    {/* 开关滑块 */}
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

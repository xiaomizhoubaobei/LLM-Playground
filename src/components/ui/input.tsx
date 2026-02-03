/**
 * @fileoverview 输入框组件，提供文本输入功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了输入框组件，支持文本输入功能。
 *
 *          主要功能包括：
 *          - 文本输入
 *          - 自定义样式和HTML属性
 *          - 文件上传支持
 *          - 占位符显示
 *
 *          导出组件：
 *          - Input: 输入框组件
 *
 *          使用场景：
 *          - 表单输入
 *          - 搜索输入
 *          - 数据输入
 *          - 密码输入
 */

import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 输入框组件的属性接口，继承自HTMLInputElement属性
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * 输入框组件
 * 提供文本输入功能，支持自定义样式和HTML属性
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

/**
 * @fileoverview 文本区域组件，提供多行文本输入功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了文本区域组件，支持多行文本输入功能。
 *
 *          主要功能包括：
 *          - 多行文本输入
 *          - 自定义样式
 *          - 自适应高度
 *          - 占位符显示
 *
 *          导出组件：
 *          - Textarea: 文本区域组件
 *
 *          使用场景：
 *          - 表单文本输入
 *          - 评论输入
 *          - 描述输入
 *          - 长文本编辑
 */

import * as React from 'react'

import { cn } from '@/utils/tailwindcss'

/**
 * 文本区域组件的属性接口，继承自HTMLTextAreaElement属性
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * 文本区域组件
 * 提供多行文本输入功能，支持自定义样式和HTML属性
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }

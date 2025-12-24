/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供文本复制到剪贴板的交互功能，带有视觉反馈动画
 */

'use client'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/utils/tailwindcss'

/**
 * CopyButton 组件的属性接口定义
 * 
 * @interface CopyButtonProps
 * @property {string} content - 要复制到剪贴板的文本内容
 * @property {string} [copyMessage] - 复制成功后显示的可选消息
 */
type CopyButtonProps = {
  content: string
  copyMessage?: string
}

/**
 * 复制到剪贴板的按钮组件，具有视觉反馈功能
 * 复制后短暂显示勾选图标
 * 
 * @component CopyButton
 * @param {CopyButtonProps} props - 组件属性
 * @param {string} props.content - 要复制到剪贴板的文本内容
 * @param {string} [props.copyMessage] - 复制成功后显示的可选消息
 * @returns {JSX.Element} 返回一个带有复制功能的按钮组件
 * @example
 * ```tsx
 * <CopyButton
 *   content="要复制的文本"
 *   copyMessage="已复制到剪贴板！"
 * />
 * ```
 */
/**
 * CopyButton 组件的主函数
 * 实现复制到剪贴板功能，带有视觉反馈动画
 * 
 * @function CopyButton
 * @param {CopyButtonProps} { content, copyMessage } - 解构的组件属性
 * @returns {JSX.Element} 返回渲染的按钮组件
 */
export function CopyButton({ content, copyMessage }: CopyButtonProps) {
  // 使用自定义 hook 处理复制逻辑和状态管理
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage,
  })

  // 渲染按钮组件，包含复制和勾选图标的切换动画
  return (
    <Button
      variant='ghost'
      size='icon'
      className='relative h-6 w-6'
      aria-label='Copy to clipboard'
      onClick={handleCopy}
    >
      {/* 勾选图标容器，用于显示复制成功状态 */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <Check
          className={cn(
            'h-4 w-4 transition-transform ease-in-out',
            isCopied ? 'scale-100' : 'scale-0'
          )}
        />
      </div>
      {/* 复制图标，根据复制状态进行缩放动画 */}
      <Copy
        className={cn(
          'h-4 w-4 transition-transform ease-in-out',
          isCopied ? 'scale-0' : 'scale-100'
        )}
      />
    </Button>
  )
}

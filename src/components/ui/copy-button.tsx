/**
 * @fileoverview 复制按钮组件，提供文本复制到剪贴板的交互功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了复制按钮组件，支持文本复制到剪贴板并带有视觉反馈动画。
 *
 *          主要功能包括：
 *          - 文本复制到剪贴板
 *          - 复制成功后的视觉反馈
 *          - 勾选图标切换动画
 *          - 自定义复制消息
 *
 *          导出组件：
 *          - CopyButton: 复制按钮组件
 *
 *          组件属性：
 *          - content: 要复制的文本内容
 *          - copyMessage: 复制成功后显示的消息（可选）
 *
 *          使用场景：
 *          - 代码块复制
 *          - 文本内容复制
 *          - URL 复制
 *          - API 响应复制
 */

'use client'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/utils/tailwindcss'

/**
 * CopyButton 组件的属性接口定义
 */
type CopyButtonProps = {
  content: string
  copyMessage?: string
}

/**
 * 复制到剪贴板的按钮组件，具有视觉反馈功能
 * 复制后短暂显示勾选图标
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

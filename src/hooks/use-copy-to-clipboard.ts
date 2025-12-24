/**
 * @fileoverview React Hook，用于复制文本到剪贴板并提供反馈
 * 提供复制功能，包含成功/错误提示和临时复制状态管理
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 实现剪贴板复制功能，支持视觉反馈和国际化错误提示
 */

import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * useCopyToClipboard Hook 的属性接口
 * 
 * @interface UseCopyToClipboardProps
 * @property {string} text - 要复制到剪贴板的文本
 * @property {string} [copyMessage='Copied to clipboard!'] - 复制成功后显示的消息
 */
type UseCopyToClipboardProps = {
  text: string
  copyMessage?: string
}

/**
 * 提供剪贴板复制功能的 React Hook，带有视觉反馈
 * 管理复制状态并显示成功/失败的通知消息
 * 
 * @function useCopyToClipboard
 * @param {UseCopyToClipboardProps} props - 配置选项
 * @returns {Object} 包含复制状态和处理函数的对象
 * @property {boolean} isCopied - 文本是否最近被复制
 * @property {() => void} handleCopy - 触发复制操作的函数
 */
export function useCopyToClipboard({
  text,
  copyMessage = 'Copied to clipboard!',
}: UseCopyToClipboardProps) {
  // 跟踪文本是否最近被复制
  const [isCopied, setIsCopied] = useState(false)
  // 存储用于重置复制状态的超时ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  // 获取错误消息的翻译
  const t = useTranslations('playground')

  /**
   * 处理复制操作
   * - 使用 navigator.clipboard 复制文本到剪贴板
   * - 显示成功/错误提示
   * - 更新复制状态，2秒后重置
   */
  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(copyMessage)
        setIsCopied(true)
        // 清除现有的超时（如果存在）
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        // 2秒后重置复制状态
        timeoutRef.current = setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
      .catch(() => {
        toast.error(t('copiedError'))
      })
  }, [t, text, copyMessage])

  return { isCopied, handleCopy }
}

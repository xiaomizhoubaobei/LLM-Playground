/**
 * @fileoverview React Hook，用于复制文本到剪贴板并提供反馈
 * 提供复制功能，包含成功/错误提示和临时复制状态管理
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了剪贴板复制功能的 Hook，用于处理文本复制操作和用户反馈。
 *          主要功能包括：
 *          - 使用 navigator.clipboard API 实现文本复制
 *          - 提供复制成功/失败的 toast 通知
 *          - 管理临时复制状态（2秒后自动重置）
 *          - 支持自定义成功消息
 *          - 国际化错误消息支持
 *
 *          使用场景：
 *          - 复制聊天消息内容
 *          - 复制代码片段
 *          - 复制 API 响应结果
 *          - 任何需要复制文本到剪贴板的场景
 *
 *          工作流程：
 *          1. 调用 handleCopy 函数触发复制操作
 *          2. 使用 navigator.clipboard.writeText 写入剪贴板
 *          3. 成功时显示成功 toast 并设置 isCopied 状态
 *          4. 失败时显示错误 toast
 *          5. 2秒后自动重置 isCopied 状态
 *
 *          依赖关系：
 *          - 依赖 next-intl 进行国际化处理
 *          - 使用 sonner 显示 toast 通知
 */

import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * useCopyToClipboard Hook 的属性接口
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

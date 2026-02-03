/**
 * @fileoverview Markdown编辑器组件，具有预览和编辑模式，支持实时编辑、Markdown预览和KaTeX数学公式
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了 Markdown 编辑器组件，具有预览和编辑模式。
 *
 *          主要功能包括：
 *          - Markdown 实时编辑
 *          - Markdown 预览渲染
 *          - KaTeX 数学公式支持
 *          - 防抖内容更新
 *          - 编辑模式切换
 *          - 纯文本粘贴
 *          - 自定义键盘处理
 *
 *          导出组件：
 *          - MarkdownEditor: Markdown 编辑器主组件
 *          - EditableContent: 可编辑内容区域组件
 *          - EmptyContent: 空内容占位组件
 *
 *          使用场景：
 *          - 聊天消息编辑
 *          - Markdown 文档预览
 *          - 富文本编辑
 *          - 数学公式显示
 *
 *          依赖关系：
 *          - @/components/ui/markdown-renderer: Markdown 渲染器
 *          - usehooks-ts: 防抖和事件回调 Hooks
 *          - katex: KaTeX 数学公式库
 */

import { cn } from '@/utils/tailwindcss'
import 'katex/dist/katex.min.css'
import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useDebounceCallback, useEventCallback } from 'usehooks-ts'
import { MarkdownRenderer } from '../ui/markdown-renderer'

/**
 * 主MarkdownEditor组件的属性
 */
interface MarkdownEditorProps {
  content: string
  isEditing?: boolean
  onChange: (content: string) => void
}

/**
 * 内容为空时显示的组件
 * 显示带有图标的占位消息
 */
const EmptyContent = () => {
  const t = useTranslations('playground')
  return (
    <div className='flex items-center gap-2 py-2 text-gray-400'>
      <FileText className='h-4 w-4' />
      <span className='text-sm'>{t('emptyContent')}</span>
    </div>
  )
}

/**
 * 可编辑内容区域的属性
 */
interface EditableProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

/**
 * 具有粘贴和键盘处理功能的可编辑内容区域组件
 * 提供带有自定义事件处理的contentEditable div
 */
const EditableContent = memo(function EditableContent({
  content,
  onChange,
  className,
}: EditableProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  /**
   * 处理粘贴事件以确保纯文本粘贴
   * 防止富文本格式被粘贴
   */
  const handlePaste = useEventCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  })

  /**
   * 处理输入事件并更新内容状态
   * 将contentEditable div的内容与父状态同步
   */
  const handleInput = useEventCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerText
      onChange(newContent)
    }
  })

  /**
   * 处理特殊键的键盘事件
   * 为Tab和Enter键实现自定义行为
   */
  const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    // 处理Tab键 - 插入空格而不是改变焦点
    if (e.key === 'Tab') {
      e.preventDefault()
      document.execCommand('insertText', false, '  ')
    }

    // 处理Enter键 - 在不按shift时插入换行符
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
  })

  // 与外部更改同步内容
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== content) {
      editorRef.current.innerText = content
    }
  }, [content])

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onPaste={handlePaste}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        'min-h-[1.5em] w-full whitespace-pre-wrap break-words rounded px-0',
        'focus:outline-none',
        'text-gray-900',
        'overflow-wrap-anywhere',
        className
      )}
      style={{
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        maxWidth: '100%',
      }}
    />
  )
})

/**
 * 具有编辑和预览模式的主markdown编辑器组件
 * 具有防抖内容更新和同步状态功能
 */
export const MarkdownEditor = memo(function MarkdownEditor({
  content,
  isEditing = false,
  onChange,
}: MarkdownEditorProps) {
  // 本地内容状态以启用防抖
  const [localContent, setLocalContent] = useState(content)

  // 防抖内容更新以减少更新频率
  const debouncedOnChange = useDebounceCallback((value: string) => {
    onChange(value)
  }, 300)

  // 带防抖的内容变更处理
  const handleChange = useCallback(
    (newContent: string) => {
      setLocalContent(newContent)
      debouncedOnChange(newContent)
    },
    [debouncedOnChange]
  )

  // 在非编辑时与外部更改同步本地内容
  useEffect(() => {
    if (content !== localContent && !isEditing) {
      setLocalContent(content)
    }
  }, [content, isEditing, localContent])

  // 渲染编辑模式或预览模式
  if (isEditing) {
    return (
      <EditableContent
        content={localContent}
        onChange={handleChange}
        className={cn(
          'h-fit overflow-hidden rounded border-none',
          'text-gray-900 shadow-none'
        )}
      />
    )
  }

  return (
    <div>
      {content ? (
        <MarkdownRenderer>{content}</MarkdownRenderer>
      ) : (
        <EmptyContent />
      )}
    </div>
  )
})

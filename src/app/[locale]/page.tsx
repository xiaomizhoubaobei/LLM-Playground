/**
 * @fileoverview 提供与 AI 模型交互聊天界面的主要游乐场页面组件
 * 功能包括消息管理、模型选择、设置配置和国际支持
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 应用程序的主要聊天交互界面，提供完整的 AI 对话功能
 */

'use client'

import { ClientOnly } from '@/components/client-only'
import { MessageList } from '@/components/playground/message-list'
import { SidebarProvider } from '@/components/ui/sidebar'
import { messageStore } from '@/db/message-store'
import { useChatGeneration } from '@/hooks/use-chat-generation'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useMessages } from '@/hooks/use-messages'

import {
  PlaygroundMessage,
  playgroundSettiongsAtom,
  uiModeAtom,
  validateMessage,
} from '@/stores/playground'
import { saveAs } from 'file-saver'
import { useAtom } from 'jotai'

import { marked, Tokens } from 'marked'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { SettingsSidebar } from './_components/settings-sidebar'
import { getModels, ModelInfo } from '@/actions/models'
import { chatNonStream } from '@/actions/chat-non-stream'
import { Header } from './_components/header'
import { InputSection } from './_components/input-section'

/**
 * AI 模型的默认设置
 * @constant
 * @type {Object}
 */
const DEFAULT_SETTINGS = {
  temperature: 0.7,
  topP: 0.7,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
}

/**
 * 主要游乐场组件，提供与 AI 模型交互的聊天界面
 * 功能包括：
 * - 消息编写和管理
 * - 模型选择和配置
 * - 设置调整
 * - 拖放消息重新排序
 * - 导出功能
 * - 响应式布局和可调整大小的面板
 *
 * @component Component
 * @returns {JSX.Element} 渲染的游乐场界面
 */
export default function Component() {
  const t = useTranslations('playground')
  const [settings, setSettings] = useAtom(playgroundSettiongsAtom)
  const [uiMode, setUiMode] = useAtom(uiModeAtom)
  const [newMessage, setNewMessage] = useState<PlaygroundMessage>({
    id: uuidv4(),
    role: 'user',
    content: '',
  })

  const { messages, handleEdit, handleDelete, handleDragEnd } = useMessages(
    t('message.systemDefaultContent')
  )

  const { generate, stop, isRunning, generatingMessage } = useChatGeneration()

  /**
   * 向聊天历史添加新消息
   * @param {PlaygroundMessage} message - 要添加的消息
   */
  const handleAddMessage = async (message: PlaygroundMessage) => {
    if (!message.content?.trim()) {
      toast.error(t('message.emptyContent'))
      return
    }

    if (!validateMessage(message.content)) {
      return
    }

    const newMsg = {
      ...message,
      id: uuidv4(),
      ...(uiMode === 'expert'
        ? { role: message.role as PlaygroundMessage['role'] }
        : { role: 'user' as PlaygroundMessage['role'] }),
      files: message.role === 'user' ? message.files : undefined,
    }

    await messageStore.addMessage(newMsg)
    setNewMessage((prev) => ({
      ...prev,
      id: uuidv4(),
      content: '',
      files: [],
    }))
  }

  /**
   * 重置聊天历史到初始状态
   */
  const handleResetMessages = useCallback(async () => {
    await messageStore.clear()
    await messageStore.addMessage({
      id: uuidv4(),
      role: 'system',
      content: t('message.systemDefaultContent'),
    })
    setNewMessage((prev) => ({
      ...prev,
      id: uuidv4(),
      content: '',
      files: [],
    }))
  }, [t])

  // 底部面板调整大小的状态
  const [bottomHeight, setBottomHeight] = useState(150)
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  /**
   * 处理调整底部面板大小的鼠标拖动事件
   * @param {React.MouseEvent} e - 鼠标事件
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const startY = e.clientY
    const startHeight = bottomHeight

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startY - e.clientY
      const newHeight = Math.min(
        Math.max(startHeight + delta, 150),
        window.innerHeight * 0.6
      )
      setBottomHeight(newHeight)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // 模型选择状态
  const [models, setModels] = useState<ModelInfo[]>([])

  useEffect(() => {
    if (settings.provider && settings.modelProvider) {
      getModels(settings.provider, settings.modelProvider).then(setModels).catch(console.error)
    }
  }, [settings.provider, settings.modelProvider])

  /**
   * 启动与 AI 模型的聊天生成
   */
  const handleRun = async () => {
    if (!settings.apiKey) {
      toast.error(t('settings.apiKeyRequired'))
      return
    }
    let _messages = messages
    if (uiMode !== 'expert') {
      const currentMessage = {
        ...newMessage,
        content: newMessage.content,
      }

      if (!currentMessage.content?.trim()) {
        toast.error(t('message.emptyContent'))
        return
      }

      await handleAddMessage(currentMessage)
      _messages = [...messages, currentMessage]
    }

    // 根据流式模式选择不同的处理方式
    if (settings.streamMode !== false) {
      // 流式模式
      const result = await generate(_messages, settings)
      if (result) {
        const { id, content, logprobs } = result
        await messageStore.addMessage({
          id,
          role: 'assistant',
          content,
          logprobs: logprobs,
        })
      }
    } else {
      // 非流式模式
      try {
        const messageId = uuidv4()
        const result = await chatNonStream({
          ...settings,
          messages: _messages,
        })
        
        if (result) {
          await messageStore.addMessage({
            id: messageId,
            role: 'assistant',
            content: result.content,
          })
        }
      } catch (error) {
        console.error('Non-stream chat error:', error)
        toast.error(t('error.chatFailed'))
      }
    }
  }

  /**
   * 处理消息提交的键盘事件
   * @param {React.KeyboardEvent} e - 键盘事件
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter 换行
        return
      }

      // 普通 Enter 发送消息
      e.preventDefault()
      if (!newMessage.content?.trim()) {
        toast.error(t('message.emptyContent'))
        return
      }

      handleRun()
    }
  }

  /**
   * 将聊天历史导出为 markdown 文件
   */
  const handleExport = () => {
    const markdown = messages
      .map((msg) => {
        const roleLabel = t(`message.${msg.role}`)
        return `## ${roleLabel}\n\n${msg.content}\n`
      })
      .join('\n')

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, `chat-${new Date().toISOString().slice(0, 10)}.md`)
  }

  // 配置 marked 渲染器的链接处理
  marked.use({
    renderer: {
      link(args_0: Tokens.Link) {
        return `<a href="${args_0.href}" target="_blank" rel="noopener noreferrer">${args_0.text}</a>`
      },
    },
  })

  /**
   * 更新新消息内容
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - 变更事件
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setNewMessage((prev) => ({
      ...prev,
      content: newValue,
    }))
  }

  /**
   * 重置设置为默认值
   */
  const handleResetSettings = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      ...DEFAULT_SETTINGS,
    }))
  }, [setSettings])

  /**
   * 切换底部面板展开状态
   */
  const handleToggleExpand = () => {
    setIsAnimating(true)
    if (isExpanded) {
      setBottomHeight(150)
    } else {
      setBottomHeight(window.innerHeight * 0.6)
    }
    setIsExpanded(!isExpanded)

    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const { upload, isUploading } = useFileUpload()

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      try {
        const uploaded = await upload(files)
        setNewMessage((prev) => ({
          ...prev,
          files: [...(prev.files || []), ...uploaded],
        }))
        toast.success(t('message.upload_success'))
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(
          error instanceof Error ? error.message : t('message.upload_error')
        )
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [upload, t]
  )

  const handleDeleteFile = useCallback((index: number) => {
    setNewMessage((prev) => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index),
    }))
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  return (
    <ClientOnly>
      <div className='h-full w-full overflow-hidden'>
        <SidebarProvider
          className='h-screen w-full'
          style={
            {
              '--sidebar-width': '20rem',
              '--sidebar-width-mobile': '20rem',
            } as React.CSSProperties
          }
        >
          <div className='sticky top-0 flex h-full w-full flex-col overflow-hidden'>
            <Header
              onExport={handleExport}
              onResetMessages={handleResetMessages}
            />

            <div className='flex-1 overflow-hidden'>
              <MessageList
                messages={messages}
                generatingMessage={generatingMessage}
                isRunning={isRunning}
                onDragEnd={handleDragEnd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <InputSection
              height={bottomHeight}
              isDragging={isDragging}
              isExpanded={isExpanded}
              isAnimating={isAnimating}
              newMessage={newMessage}
              isRunning={isRunning}
              isUploading={isUploading}
              uiMode={uiMode}
              isPreviewOpen={isPreviewOpen}
              onMouseDown={handleMouseDown}
              onMessageChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onRoleChange={(value) =>
                setNewMessage((prev) => ({
                  ...prev,
                  role: value as PlaygroundMessage['role'],
                }))
              }
              onToggleExpand={handleToggleExpand}
              onRun={handleRun}
              onStop={stop}
              onAddMessage={() => handleAddMessage(newMessage)}
              onFileUpload={handleFileUpload}
              onDeleteFile={handleDeleteFile}
              setIsPreviewOpen={setIsPreviewOpen}
            />
          </div>

          <SettingsSidebar
            settings={settings}
            uiMode={uiMode}
            models={models}
            onSettingsChange={setSettings}
            onUiModeChange={(value) => setUiMode(value ? 'expert' : 'beginner')}
            onResetSettings={handleResetSettings}
          />
        </SidebarProvider>
      </div>
    </ClientOnly>
  )
}

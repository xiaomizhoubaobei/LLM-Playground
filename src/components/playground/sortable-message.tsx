/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 可拖拽和编辑的消息组件，支持拖拽排序、编辑、复制和重新生成消息功能
 */

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { messageStore } from '@/db/message-store'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useMessages } from '@/hooks/use-messages'
import { PlaygroundMessage, uiModeAtom } from '@/stores/playground'
import { cn } from '@/utils/tailwindcss'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAtom } from 'jotai'
import {
  BarChart2,
  Check,
  Copy,
  Edit2,
  Eye,
  GripVertical,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDebounceCallback } from 'usehooks-ts'
import { FilePreview } from './file-preview'
import { MarkdownEditor } from './markdown-editor'
import { TokenProbabilities } from './token-probabilities'

/**
 * SortableMessage组件的属性接口
 * @interface SortableMessageProps
 * @property {PlaygroundMessage} message - 要显示和管理的消息
 * @property {boolean} [isRunning] - 消息是否正在生成/重新生成
 * @property {Function} handleEdit - 编辑消息的回调函数
 * @property {Function} handleDelete - 删除消息的回调函数
 * @property {Function} [handleRegenerate] - 可选的重新生成消息的回调函数
 */
interface SortableMessageProps {
  message: PlaygroundMessage
  isRunning?: boolean
  handleEdit: (id: string, message: PlaygroundMessage) => void
  handleDelete: (id: string) => void
  handleRegenerate?: (id: string) => void
}

/**
 * 消息生成期间显示的加载指示器组件
 * @component
 */
const LoadingIndicator = () => {
  const t = useTranslations('playground')
  return (
    <div className='flex items-center gap-2 rounded-md bg-gray-50 p-3 text-gray-500'>
      <Loader2 className='h-4 w-4 animate-spin' />
      <span className='text-sm font-medium'>{t('generating')}</span>
    </div>
  )
}

/**
 * 具有丰富交互功能的可拖拽和编辑的消息组件
 * 支持拖拽排序、内联编辑、复制到剪贴板和消息重新生成
 * 
 * @component
 * @param {SortableMessageProps} props - 组件属性
 * @returns {JSX.Element} 渲染的消息组件
 */
export const SortableMessage = memo(
  function SortableMessage({
    message,
    handleDelete,
    handleRegenerate,
    isRunning = false,
  }: SortableMessageProps) {
    const t = useTranslations('playground')
    
    // 配置拖拽排序行为
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: message.id,
        transition: {
          duration: 150,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
      })

    const style = {
      transform: CSS.Transform.toString({
        ...transform!,
        scaleX: 1,
        scaleY: 1,
      }),
      transition,
    }

    // UI交互状态
    const [isFocused, setIsFocused] = useState(false)
    const [isInCard, setIsInCard] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showProbabilities, setShowProbabilities] = useState(false)

    // 处理数组或字符串内容
    const content = Array.isArray(message.content)
      ? message.content.join('')
      : message.content

    // 复制到剪贴板功能
    const { isCopied, handleCopy } = useCopyToClipboard({
      text: content,
      copyMessage: t('copiedSuccess'),
    })

    /**
     * 消息编辑的防抖处理函数
     * 在300ms延迟后将更改保存到消息存储
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleMessageEdit = useCallback(
      useDebounceCallback(async (newContent: string) => {
        await messageStore.editMessage(message.id!, {
          ...message,
          content: newContent,
        })
      }, 300),
      [message]
    )

    const { handleEdit } = useMessages()

    const handleFileDelete = useCallback(
      async (index: number) => {
        try {
          await messageStore.editMessage(message.id!, {
            ...message,
            files: message.files?.filter((_, i) => i !== index),
          })
          handleEdit(message.id!, {
            ...message,
            files: message.files?.filter((_, i) => i !== index),
          })
        } catch (error) {
          console.error('Failed to delete file:', error)
        }
      },
      [message, handleEdit]
    )

    const [currentRole, setCurrentRole] = useState(message.role)

    useEffect(() => {
      setCurrentRole(message.role)
    }, [message.role])

    const handleRoleChange = useCallback(
      async (role: PlaygroundMessage['role']) => {
        setCurrentRole(role)
        await messageStore.editMessage(message.id!, {
          ...message,
          role,
        })
      },
      [message]
    )

    const [uiMode] = useAtom(uiModeAtom)

    const { upload, isUploading } = useFileUpload()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (!files.length) return

        try {
          const uploadedFiles = await upload(files)
          const newFiles = [...(message.files || []), ...uploadedFiles]
          
          handleEdit(message.id!, {
            ...message,
            files: newFiles,
          })
          toast.success(t('message.upload_success'))
        } catch (error) {
          console.error('Failed to upload files:', error)
          toast.error(t('message.upload_error'))
        } finally {
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }
      },
      [message, upload, handleEdit, t]
    )

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        onMouseEnter={() => setIsInCard(true)}
        onMouseLeave={() => setIsInCard(false)}
        className={cn(
          'mb-4 cursor-default rounded-lg bg-background p-4 shadow-sm ring-1 ring-gray-300',
          'hover:ring-primary/95',
          'focus-within:ring-primary',
          'focus-within:hover:ring-primary',
          isFocused && 'ring-primary hover:ring-primary'
        )}
      >
        <div className='flex items-center justify-between gap-2 text-sm text-gray-500'>
          <div>
            {uiMode === 'expert' ? (
              <Select
                value={currentRole}
                onValueChange={handleRoleChange}
                onOpenChange={(open) => {
                  if (!open) {
                    setIsFocused(false)
                  } else {
                    setIsFocused(true)
                  }
                }}
              >
                <SelectTrigger className='w-fit'>
                  <SelectValue
                    placeholder={t('message.selectRolePlaceholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='assistant'>
                    {t('message.assistant')}
                  </SelectItem>
                  <SelectItem value='system'>{t('message.system')}</SelectItem>
                  <SelectItem value='user'>{t('message.user')}</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span>{t(`message.${currentRole}`)}</span>
            )}
          </div>
          <div
            className={cn(
              'flex items-center gap-2 opacity-100 transition-opacity duration-150',
              !isInCard && 'opacity-0',
              isRunning && 'opacity-0'
            )}
          >
            {message.role === 'assistant' && handleRegenerate && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='size-6 p-1'
                      onClick={() => handleRegenerate(message.id)}
                    >
                      <RefreshCw className='size-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={4}
                    className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
                  >
                    <p>{t('regenerateFromHere')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className={cn(
                      'size-6 p-1',
                      uiMode !== 'expert' && 'hidden'
                    )}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <Eye className='size-4' />
                    ) : (
                      <Edit2 className='size-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={4}
                  className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
                >
                  <p>
                    {isEditing
                      ? t('message.viewTooltip')
                      : t('message.editTooltip')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='size-6 p-1'
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <Check className='size-4' />
                    ) : (
                      <Copy className='size-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={4}
                  className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
                >
                  <p>{t('message.copyTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className={cn('size-6 p-1')}
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={4}
                  className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
                >
                  <p>{t('message.deleteTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {message.role === 'assistant' && message.logprobs && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='size-6 p-1'
                      onClick={() => setShowProbabilities(!showProbabilities)}
                    >
                      <BarChart2 className={cn(
                        'size-4',
                        showProbabilities && 'text-primary'
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('message.showProbabilities')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    {...listeners}
                    variant='outline'
                    size='icon'
                    className={cn(
                      'size-6 p-1',
                      uiMode !== 'expert' && 'hidden'
                    )}
                  >
                    <GripVertical className='size-4 cursor-move' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={4}
                  className='max-w-xs select-text break-words rounded-md bg-gray-900 px-3 py-2 text-sm text-gray-50'
                >
                  <p>{t('message.dragTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className='mt-2 text-sm'>
          {isRunning && message.content.length === 0 ? (
            <LoadingIndicator />
          ) : (
            <div className='flex flex-col flex-1'>
              {showProbabilities && message.logprobs ? (
                <TokenProbabilities logprobs={message.logprobs} />
              ) : (
                <>
                  <MarkdownEditor
                    content={content}
                    isEditing={isEditing}
                    onChange={handleMessageEdit}
                  />
                  {message.role === 'user' && (
                    <div className='flex items-center gap-2'>
                      {message.files && (
                        <FilePreview
                          files={message.files}
                          canDelete={isEditing}
                          onDelete={handleFileDelete}
                          className="flex-1"
                        />
                      )}
                      {isEditing && (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*"
                          />
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="shrink-0"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isUploading}
                                >
                                  {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <ImagePlus className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t('message.upload_file')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.role === nextProps.message.role &&
      prevProps.message.files === nextProps.message.files &&
      prevProps.isRunning === nextProps.isRunning
    )
  }
)

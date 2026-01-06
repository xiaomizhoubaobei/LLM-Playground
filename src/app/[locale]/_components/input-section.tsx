/**
 * @fileoverview 输入区域组件，提供消息输入、角色选择和文件上传功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理用户消息输入界面，包括文本输入、文件上传和操作按钮
 */

'use client'

import { FilePreview } from '@/components/playground/file-preview'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { PlaygroundMessage } from '@/stores/playground'
import { cn } from '@/utils/tailwindcss'
import { ChevronDown, ChevronUp, Loader2, PlayCircle, Plus, Square, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

/**
 * 输入区域组件的属性接口
 * @interface InputSectionProps
 * @property {number} height - 区域高度
 * @property {boolean} isDragging - 是否正在拖拽调整大小
 * @property {boolean} isExpanded - 是否已展开
 * @property {boolean} isAnimating - 是否正在动画中
 * @property {PlaygroundMessage} newMessage - 当前新消息对象
 * @property {boolean} isRunning - 是否正在运行 AI 生成
 * @property {boolean} isUploading - 是否正在上传文件
 * @property {'expert'|'beginner'} uiMode - 用户界面模式
 * @property {boolean} isPreviewOpen - 文件预览是否打开
 * @property {Function} onMouseDown - 鼠标按下事件处理函数
 * @property {Function} onMessageChange - 消息变更处理函数
 * @property {Function} onKeyDown - 键盘按下事件处理函数
 * @property {Function} onRoleChange - 角色变更处理函数
 * @property {Function} onToggleExpand - 切换展开状态处理函数
 * @property {Function} onRun - 运行处理函数
 * @property {Function} onStop - 停止处理函数
 * @property {Function} onAddMessage - 添加消息处理函数
 * @property {Function} onFileUpload - 文件上传处理函数
 * @property {Function} onDeleteFile - 删除文件处理函数
 * @property {Function} setIsPreviewOpen - 设置预览打开状态处理函数
 */
interface InputSectionProps {
  height: number
  isDragging: boolean
  isExpanded: boolean
  isAnimating: boolean
  newMessage: PlaygroundMessage
  isRunning: boolean
  isUploading: boolean
  uiMode: 'expert' | 'beginner'
  isPreviewOpen: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onRoleChange: (value: string) => void
  onToggleExpand: () => void
  onRun: () => void
  onStop: () => void
  onAddMessage: () => void
  onFileUpload: (files: File[]) => void
  onDeleteFile: (index: number) => void
  setIsPreviewOpen: (value: boolean) => void
}

/**
 * 输入区域组件，提供消息输入、角色选择和文件上传功能
 * 
 * @function InputSection
 * @param {InputSectionProps} props - 组件属性
 * @returns {JSX.Element} 渲染的输入区域组件
 */
export function InputSection({
  height,
  isDragging,
  isExpanded,
  isAnimating,
  newMessage,
  isRunning,
  isUploading,
  uiMode,
  isPreviewOpen,
  onMouseDown,
  onMessageChange,
  onKeyDown,
  onRoleChange,
  onToggleExpand,
  onRun,
  onStop,
  onAddMessage,
  onFileUpload,
  onDeleteFile,
  setIsPreviewOpen,
}: InputSectionProps) {
  // 获取国际化翻译函数
  const t = useTranslations('playground')
  // 文件输入框的引用
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 触发文件上传对话框
   * @function triggerFileUpload
   */
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-1 border-t border-border/40 bg-gradient-to-b from-background via-background to-muted/20',
        isAnimating && 'transition-[height] duration-300 ease-in-out'
      )}
      style={{ height }}
    >
      <div
        className={cn(
          'h-0.5 w-full cursor-ns-resize transition-all duration-200 hover:bg-primary/30',
          isDragging && 'bg-primary/50'
        )}
        onMouseDown={onMouseDown}
      />
      <div className='flex flex-1 flex-col gap-2 p-3.5'>
        <div className='flex items-center justify-between gap-2'>
          {uiMode === 'expert' ? (
            <Select
              value={newMessage.role}
              onValueChange={onRoleChange}
            >
              <SelectTrigger className='w-fit h-7 px-2.5 text-xs font-medium bg-muted/40 hover:bg-muted/60 transition-colors rounded-md border-0'>
                <SelectValue placeholder={t('message.selectRolePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='system'>{t('message.system')}</SelectItem>
                <SelectItem value='user'>{t('message.user')}</SelectItem>
                <SelectItem value='assistant'>{t('message.assistant')}</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className='text-xs font-semibold text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md'>
              {t('message.user')}
            </span>
          )}
          <div className='flex items-center gap-1'>
            <TooltipButton
              variant='ghost'
              size='icon'
              className='h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200'
              onClick={onToggleExpand}
              tooltipContent={isExpanded ? t('message.collapse') : t('message.expand')}
            >
              {isExpanded ? (
                <ChevronDown className='h-3.5 w-3.5' />
              ) : (
                <ChevronUp className='h-3.5 w-3.5' />
              )}
            </TooltipButton>

            {newMessage.role === 'user' && (
              <Tooltip>
                <Popover open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <TooltipProvider delayDuration={0}>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant='ghost'
                          onClick={(e) => {
                            e.preventDefault()
                            if (!newMessage.files?.length) {
                              triggerFileUpload()
                            } else {
                              setIsPreviewOpen(true)
                            }
                          }}
                          disabled={isUploading}
                          className='relative h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200'
                          size='icon'
                        >
                          {isUploading ? (
                            <Loader2 className='size-3.5 animate-spin' />
                          ) : (
                            <>
                              <Upload className='size-3.5' />
                              {newMessage.files && newMessage.files.length > 0 && (
                                <span className='absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground shadow-sm'>
                                  {newMessage.files.length}
                                </span>
                              )}
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={4}
                      className='max-w-xs select-text break-words rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-gray-50 shadow-md'
                    >
                      <p>{t('message.upload_file')}</p>
                    </TooltipContent>
                  </TooltipProvider>
                  {newMessage.files && newMessage.files.length > 0 && (
                    <PopoverContent className='w-80 p-2.5 rounded-lg shadow-md border border-border/40' side='top' align='end'>
                      <div className='mb-2 flex items-center justify-between'>
                        <span className='text-xs font-semibold'>
                          {t('message.uploaded_files')}
                        </span>
                        <TooltipButton
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary'
                          onClick={() => {
                            setIsPreviewOpen(false)
                            triggerFileUpload()
                          }}
                          tooltipContent={t('message.upload_file')}
                        >
                          <Plus className='h-3.5 w-3.5' />
                        </TooltipButton>
                      </div>
                      <FilePreview
                        files={newMessage.files}
                        canDelete={true}
                        onDelete={onDeleteFile}
                      />
                    </PopoverContent>
                  )}
                </Popover>
              </Tooltip>
            )}
            <input
              ref={fileInputRef}
              type='file'
              multiple
              className='hidden'
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length) {
                  onFileUpload(files)
                }
                e.target.value = ''
              }}
              accept='image/*'
            />

            {uiMode === 'expert' && (
              <TooltipButton
                variant='ghost'
                disabled={!newMessage.content}
                onClick={onAddMessage}
                tooltipContent={t('message.addTooltip')}
                className='h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200'
              >
                <Plus className='h-3.5 w-3.5' />
                {t('message.add')}
              </TooltipButton>
            )}

            <TooltipButton
              className='h-8 px-3 rounded-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all duration-200'
              onClick={isRunning ? onStop : onRun}
              tooltipContent={
                isRunning
                  ? t('message.stopTooltip')
                  : uiMode === 'expert'
                  ? t('message.runTooltipExpert')
                  : t('message.runTooltipBeginner')
              }
            >
              {isRunning ? (
                <>
                  {t('message.stop')}
                  <Square className='ml-1.5 h-3.5 w-3.5' />
                </>
              ) : (
                <>
                  {t('message.run')}
                  <PlayCircle className='ml-1.5 h-3.5 w-3.5' />
                </>
              )}
            </TooltipButton>
          </div>
        </div>
        <Textarea
          className='flex-1 resize-none rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5 shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all duration-200 hover:border-border/60'
          placeholder={t('message.inputPlaceholder')}
          value={newMessage.content}
          onChange={onMessageChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  )
}

/**
 * @fileoverview 会话列表组件，显示和管理历史对话
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了会话列表组件，用于显示和管理历史对话。
 *
 *          主要功能包括：
 *          - 会话列表显示
 *          - 会话切换功能
 *          - 会话删除功能
 *          - 会话重命名功能
 *          - 会话创建功能
 *          - 时间格式化显示
 *
 *          导出组件：
 *          - ConversationList: 会话列表主组件
 *          - ConversationItem: 单个会话项组件
 *
 *          使用场景：
 *          - 历史对话管理
 *          - 会话快速切换
 *          - 对话历史浏览
 */

'use client'

import { Conversation } from '@/db'
import { conversationStore } from '@/db/conversation-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/tailwindcss'
import { MessageSquare, Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * 会话列表组件的属性接口
 */
interface ConversationListProps {
  currentConversationId: number | null
  onConversationSelect: (id: number) => void
  onNewConversation: () => Promise<void>
}

/**
 * 会话项组件
 */
interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onRename: (newTitle: string) => void
}

const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(conversation.title)

  const handleSaveRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim())
      setIsEditing(false)
    }
  }

  const handleCancelRename = () => {
    setEditTitle(conversation.title)
    setIsEditing(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-2 p-2.5 rounded-md transition-all duration-200 cursor-pointer',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted/50 text-foreground/70 hover:text-foreground'
      )}
      onClick={onSelect}
    >
      <MessageSquare className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename()
                if (e.key === 'Escape') handleCancelRename()
              }}
              className="h-7 text-xs px-2 py-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleSaveRename}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCancelRename}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0" onContextMenu={(e) => {
              e.preventDefault()
              setIsEditing(true)
            }}>
              <div className="text-xs font-medium truncate cursor-pointer hover:text-primary/80 transition-colors">{conversation.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {conversation.messageCount || 0} 条消息 · {formatDate(conversation.updatedAt)}
              </div>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 会话列表组件
 */
export function ConversationList({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
}: ConversationListProps) {
  const t = useTranslations('playground')
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const unsubscribe = conversationStore.subscribe((convs) => {
      setConversations(convs)
    })
    return unsubscribe
  }, [])

  const handleDeleteConversation = async (id: number) => {
    try {
      await conversationStore.deleteConversation(id)
      toast.success('会话已删除')
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast.error('删除会话失败')
    }
  }

  const handleRenameConversation = async (id: number, newTitle: string) => {
    try {
      await conversationStore.updateConversation(id, { title: newTitle })
      toast.success('会话已重命名')
    } catch (error) {
      console.error('Failed to rename conversation:', error)
      toast.error('重命名失败')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
        <span className="text-xs font-semibold text-foreground/80">历史对话</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200"
          onClick={onNewConversation}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">暂无历史对话</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === currentConversationId}
              onSelect={() => onConversationSelect(conversation.id!)}
              onDelete={() => handleDeleteConversation(conversation.id!)}
              onRename={(newTitle) => handleRenameConversation(conversation.id!, newTitle)}
            />
          ))
        )}
      </div>
    </div>
  )
}
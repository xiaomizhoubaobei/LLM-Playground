/**
 * @fileoverview 键盘快捷键帮助组件
 * @author 祁筱欣
 * @date 2026-02-04
 * @since 2025-12-24
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了键盘快捷键帮助对话框，展示应用程序中所有可用的快捷键组合，帮助用户提高操作效率。
 *          组件支持按类别分组显示快捷键，并提供快捷键提示徽章功能。
 *
 *          工作流程：
 *          1. 使用 Dialog 组件创建模态对话框
 *          2. 按类别（消息操作、对话管理、界面操作）组织快捷键
 *          3. 每个快捷键显示图标、描述和按键组合
 *          4. ShortcutBadge 组件用于在界面其他位置显示快捷键提示
 *
 *          快捷键分类：
 *          - 消息操作：发送、编辑消息
 *          - 对话管理：新建对话、切换列表、导出、清空
 *          - 界面操作：显示帮助、打开设置、关闭弹窗
 *
 *          依赖关系：
 *          - 依赖 @/components/ui/* 中的 UI 组件
 *          - 使用 lucide-react 图标库
 *          - 使用 @/utils/tailwindcss 工具函数
 */

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Keyboard,
  MessageSquare,
  Plus,
  Trash2,
  FileDown,
  Settings,
  Send,
  ArrowUp,
  ArrowDown,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/utils/tailwindcss'

/**
 * 键盘快捷键配置
 */
const SHORTCUTS = [
  {
    category: '消息操作',
    shortcuts: [
      {
        key: 'Ctrl + Enter',
        description: '发送消息',
        icon: <Send className='h-4 w-4' />,
      },
      {
        key: '↑',
        description: '编辑上一条消息',
        icon: <ArrowUp className='h-4 w-4' />,
      },
      {
        key: '↓',
        description: '编辑下一条消息',
        icon: <ArrowDown className='h-4 w-4' />,
      },
    ],
  },
  {
    category: '对话管理',
    shortcuts: [
      {
        key: 'Ctrl + N',
        description: '新建对话',
        icon: <Plus className='h-4 w-4' />,
      },
      {
        key: 'Ctrl + B',
        description: '切换会话列表',
        icon: <MessageSquare className='h-4 w-4' />,
      },
      {
        key: 'Ctrl + E',
        description: '导出对话',
        icon: <FileDown className='h-4 w-4' />,
      },
      {
        key: 'Ctrl + Delete',
        description: '清空消息',
        icon: <Trash2 className='h-4 w-4' />,
      },
    ],
  },
  {
    category: '界面操作',
    shortcuts: [
      {
        key: 'Ctrl + /',
        description: '显示快捷键帮助',
        icon: <HelpCircle className='h-4 w-4' />,
      },
      {
        key: 'Ctrl + ,',
        description: '打开设置',
        icon: <Settings className='h-4 w-4' />,
      },
      {
        key: 'Esc',
        description: '关闭弹窗',
        icon: <Keyboard className='h-4 w-4' />,
      },
    ],
  },
]

/**
 * 键盘快捷键帮助组件
 */
export function KeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Keyboard className='h-4 w-4' />
          <span className='sr-only'>键盘快捷键</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Keyboard className='h-5 w-5' />
            键盘快捷键
          </DialogTitle>
          <DialogDescription>
            使用以下快捷键可以提高工作效率
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {SHORTCUTS.map((group) => (
            <div key={group.category}>
              <h3 className='text-sm font-semibold text-foreground mb-3'>
                {group.category}
              </h3>
              <div className='space-y-2'>
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className='flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='text-muted-foreground'>
                        {shortcut.icon}
                      </div>
                      <span className='text-sm'>{shortcut.description}</span>
                    </div>
                    <kbd className='px-2.5 py-1 text-xs font-mono rounded-md bg-background border border-border/40 shadow-sm'>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='pt-4 border-t border-border/40'>
          <p className='text-xs text-muted-foreground text-center'>
            提示：在 Mac 上使用 Cmd 键代替 Ctrl 键
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 快捷键提示徽章组件
 */
interface ShortcutBadgeProps {
  keys: string[]
  className?: string
}

export function ShortcutBadge({ keys, className }: ShortcutBadgeProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className='text-muted-foreground text-xs'>+</span>}
          <kbd className='px-1.5 py-0.5 text-xs font-mono rounded bg-background border border-border/40 shadow-sm'>
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  )
}
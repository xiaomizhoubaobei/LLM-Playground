/**
 * @fileoverview 命令面板组件套件，提供命令面板、搜索输入框、命令分组等UI组件
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了命令面板组件套件，支持键盘导航和触摸滚动。
 *
 *          主要功能包括：
 *          - 命令面板基础容器
 *          - 搜索输入框功能
 *          - 命令分组和列表
 *          - 键盘快捷键支持
 *          - 触摸滚动优化
 *
 *          导出组件：
 *          - Command: 命令菜单根组件
 *          - CommandDialog: 命令对话框
 *          - CommandInput: 命令输入框
 *          - CommandList: 命令列表
 *          - CommandEmpty: 空状态组件
 *          - CommandGroup: 命令分组
 *          - CommandItem: 命令项
 *          - CommandSeparator: 分隔符
 *          - CommandShortcut: 快捷键
 *
 *          使用场景：
 *          - 命令面板（CMD+K）
 *          - 搜索功能
 *          - 快速操作菜单
 *          - 设置导航
 */

'use client'

import { type DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import * as React from 'react'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/utils/tailwindcss'

/**
 * 命令菜单根组件
 * 提供命令面板的基础容器和样式
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

/**
 * 命令对话框组件
 * 在弹窗中显示命令菜单，提供模态交互体验
 */
const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className='overflow-hidden p-0'>
        <Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 命令输入框组件
 * 提供搜索输入功能，带有搜索图标
 */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
    <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

/**
 * 命令列表组件
 * 显示命令选项列表，支持自定义滚动和触摸操作
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => {
  // 列表容器引用，用于触摸滚动控制
  const listRef = React.useRef<HTMLDivElement | null>(null)
  // 记录上一次触摸位置，用于计算滚动距离
  const lastY = React.useRef(0)

  return (
    <CommandPrimitive.List
      ref={(el) => {
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
        listRef.current = el
      }}
      className={cn(
        'overflow-y-auto overflow-x-hidden overscroll-contain',
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
      }}
      onWheel={(e) => {
        e.stopPropagation()
        const list = e.currentTarget
        if (list) {
          list.scrollTop += e.deltaY
        }
      }}
      onTouchStart={(e) => {
        lastY.current = e.touches[0].clientY
      }}
      onTouchMove={(e) => {
        e.stopPropagation()
        if (!listRef.current) return

        const touch = e.touches[0]
        const deltaY = lastY.current - touch.clientY

        listRef.current.scrollTop += deltaY * 0.5
        lastY.current = touch.clientY
      }}
      {...props}
    />
  )
})

CommandList.displayName = CommandPrimitive.List.displayName

/**
 * 命令空状态组件
 * 当没有匹配的命令时显示的提示内容
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className='py-6 text-center text-sm'
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

/**
 * 命令分组组件
 * 用于将相关命令组织在一起，带有分组标题
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

/**
 * 命令分隔符组件
 * 用于在命令组之间创建视觉分隔
 */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

/**
 * 命令项组件
 * 表示单个可选择的命令选项
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * 命令快捷键组件
 * 用于显示命令的键盘快捷键提示
 */
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
}


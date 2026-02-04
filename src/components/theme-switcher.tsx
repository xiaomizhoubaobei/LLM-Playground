/**
 * @fileoverview 主题切换组件
 * @author 祁筱欣
 * @date 2026-02-04
 * @since 2025-12-24
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了明暗主题切换功能，支持用户在浅色主题、深色主题和跟随系统主题之间切换。
 *          组件使用下拉菜单形式提供主题选项，并带有平滑的图标过渡动画。
 *
 *          工作流程：
 *          1. 使用 next-themes 的 useTheme hook 获取当前主题和设置方法
 *          2. 通过 mounted 状态避免服务端渲染时的主题不匹配问题
 *          3. 提供三个主题选项：浅色、深色、跟随系统
 *          4. 图标根据当前主题状态进行旋转和缩放过渡动画
 *
 *          依赖关系：
 *          - 依赖 next-themes 实现主题管理和持久化
 *          - 使用 lucide-react 图标库
 *          - 依赖 @/components/ui/* 中的 UI 组件
 */

'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

/**
 * 主题切换组件
 * 支持切换到浅色主题、深色主题或跟随系统主题
 */
export function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免服务端渲染时的主题不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='h-8 w-8'>
        <Sun className='h-4 w-4' />
        <span className='sr-only'>切换主题</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className='mr-2 h-4 w-4' />
          <span>浅色</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className='mr-2 h-4 w-4' />
          <span>深色</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Sun className='mr-2 h-4 w-4' />
          <span>跟随系统</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
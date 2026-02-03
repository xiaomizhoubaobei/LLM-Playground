/**
 * @fileoverview 通知组件，基于Sonner库提供的热力通知功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了通知组件，基于Sonner库提供的热力通知功能。
 *
 *          主要功能包括：
 *          - 主题感知
 *          - 自动消失
 *          - 动画效果
 *          - 自定义样式
 *
 *          导出组件：
 *          - Toaster: 烤面包机组件
 *
 *          使用场景：
 *          - 成功通知
 *          - 错误提示
 *          - 警告信息
 *          - 系统消息
 */

'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

/**
 * 烤面包机组件的属性类型，继承自Sonner组件属性
 */
type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * 烤面包机组件
 * 提供主题感知的通知功能，支持自定义样式和配置
 * 
 * @param {ToasterProps} props - 组件属性
 * @returns {JSX.Element} 渲染的通知组件
 */
const Toaster = ({ ...props }: ToasterProps) => {
  // 获取当前主题，默认为系统主题
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          // 通知消息样式
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          // 描述文本样式
          description: 'group-[.toast]:text-muted-foreground',
          // 操作按钮样式
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          // 取消按钮样式
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

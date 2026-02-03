/**
 * @fileoverview 设置触发按钮组件，用于切换设置侧边栏的显示状态
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了设置触发按钮组件，用于切换设置侧边栏的显示状态。
 *
 *          主要功能包括：
 *          - 切换设置侧边栏
 *          - 设置图标显示
 *          - 幽灵样式按钮
 *
 *          导出组件：
 *          - SettingTrigger: 设置触发按钮组件
 *
 *          使用场景：
 *          - 设置面板切换
 *          - 侧边栏控制
 *          - 配置管理入口
 *
 *          依赖关系：
 *          - @/components/ui/sidebar: 侧边栏组件
 *          - lucide-react: 图标库
 */

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { Settings } from 'lucide-react'
import { forwardRef } from 'react'

/**
 * 切换设置侧边栏的按钮组件
 * 使用设置图标和幽灵样式变体
 */
export const SettingTrigger = forwardRef<HTMLButtonElement>((props, ref) => {
  const { toggleSidebar } = useSidebar()
  
  return (
    <Button 
      ref={ref}
      variant='ghost' 
      size='icon' 
      onClick={toggleSidebar}
    >
      <Settings className='h-5 w-5' />
    </Button>
  )
})

SettingTrigger.displayName = 'SettingTrigger'
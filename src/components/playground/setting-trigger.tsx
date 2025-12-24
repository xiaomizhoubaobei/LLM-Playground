/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 设置触发按钮组件，用于切换设置侧边栏的显示状态
 */

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { Settings } from 'lucide-react'
import { forwardRef } from 'react'

/**
 * 切换设置侧边栏的按钮组件
 * 使用设置图标和幽灵样式变体
 * 
 * @component
 * @example
 * ```tsx
 * <SettingTrigger />
 * ```
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
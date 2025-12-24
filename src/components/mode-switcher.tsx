/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 动画模式切换器组件，支持在初学者和专家模式之间切换，具有平滑过渡、自定义图标和可配置动画效果
 */

'use client'

import { cn } from '@/utils/tailwindcss'
import { motion } from 'framer-motion'
import { Lightbulb, Zap } from 'lucide-react'
import * as React from 'react'

/**
 * ModeSwitcher组件的属性类型
 * 
 * @interface ModeSwitcherProps
 * @property {boolean} [value] - 当前模式状态（true为专家模式，false为初学者模式）
 * @property {(value: boolean) => void} [onChange] - 模式变更时的回调函数
 * @property {string} [className] - 额外的CSS类名
 * @property {boolean} [disabled] - 是否禁用切换器
 * @property {React.ReactNode} [beginnerIcon] - 初学者模式的自定义图标
 * @property {React.ReactNode} [expertIcon] - 专家模式的自定义图标
 * @property {string} [beginnerText] - 初学者模式的文本标签
 * @property {string} [expertText] - 专家模式的文本标签
 * @property {Object} [animationConfig] - 动画时间配置
 * @property {number} [animationConfig.switchDuration] - 切换动画持续时间
 * @property {number} [animationConfig.rotateDuration] - 图标旋转持续时间
 * @property {number} [animationConfig.colorDuration] - 颜色过渡持续时间
 * @property {Object} [animationConfig.spring] - 弹簧动画配置
 * @property {number} [animationConfig.spring.stiffness] - 弹簧刚度
 * @property {number} [animationConfig.spring.damping] - 弹簧阻尼
 */
type ModeSwitcherProps = {
  value?: boolean
  onChange?: (value: boolean) => void
  className?: string
  disabled?: boolean
  beginnerIcon?: React.ReactNode
  expertIcon?: React.ReactNode
  beginnerText?: string
  expertText?: string
  animationConfig?: {
    switchDuration?: number
    rotateDuration?: number
    colorDuration?: number
    spring?: {
      stiffness?: number
      damping?: number
    }
  }
}

/**
 * 动画切换组件，用于在初学者和专家模式之间切换
 * 具有平滑过渡、自定义图标和无障碍支持
 * */
export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  value,
  onChange,
  className,
  disabled = false,
  beginnerIcon,
  expertIcon,
  beginnerText = 'Beginner',
  expertText = 'Expert',
  animationConfig = {
    switchDuration: 0.3,
    rotateDuration: 0.5,
    colorDuration: 0.3,
    spring: {
      stiffness: 700,
      damping: 30,
    },
  },
}) => {
  // Reference to container for calculating translation distance
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [translateDistance, setTranslateDistance] = React.useState(0)

  const isExpertMode = value ?? false

  // Handle mode toggle with disabled state check
  const handleToggle = React.useCallback(() => {
    if (!disabled) {
      onChange?.(!isExpertMode)
    }
  }, [disabled, isExpertMode, onChange])

  // Calculate translation distance based on container width
  React.useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const thumbWidth = 32
      const padding = 4
      setTranslateDistance(containerWidth - thumbWidth - padding * 2)
    }
  }, [])

  // Dynamic colors based on mode
  const iconColor = isExpertMode ? 'rgb(67, 56, 202)' : 'rgb(161, 98, 7)'
  const backgroundColor = isExpertMode
    ? 'rgb(224, 231, 255)'
    : 'rgb(254, 243, 199)'

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative h-10 cursor-pointer rounded-full p-1',
        'ring-1 ring-inset ring-black/5 dark:ring-white/5',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={handleToggle}
      role='switch'
      aria-checked={isExpertMode}
      aria-readonly={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle()
        }
      }}
      animate={{
        backgroundColor: backgroundColor,
      }}
      transition={{ duration: animationConfig.colorDuration }}
    >
      {/* Mode labels */}
      <div className='flex h-full w-full items-center justify-between px-10'>
        <span
          className={cn(
            'select-none text-xs font-medium transition-all',
            isExpertMode
              ? 'text-indigo-900/75 opacity-0'
              : 'text-amber-800/75 opacity-100'
          )}
          style={{ transitionDuration: `${animationConfig.colorDuration}s` }}
        >
          {beginnerText}
        </span>
        <span
          className={cn(
            'select-none text-xs font-medium transition-all',
            isExpertMode
              ? 'text-indigo-900/75 opacity-100'
              : 'text-amber-800/75 opacity-0'
          )}
          style={{ transitionDuration: `${animationConfig.colorDuration}s` }}
        >
          {expertText}
        </span>
      </div>

      {/* Animated thumb with icon */}
      <motion.div
        className={cn(
          'absolute left-1 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full',
          'bg-white dark:bg-gray-800',
          'shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
          'ring-1 ring-black/5 dark:ring-white/5'
        )}
        animate={{
          x: isExpertMode ? translateDistance : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: animationConfig.spring?.stiffness,
          damping: animationConfig.spring?.damping,
        }}
      >
        <motion.div
          animate={{
            rotate: isExpertMode ? 360 : 0,
          }}
          transition={{ duration: animationConfig.rotateDuration }}
        >
          {isExpertMode
            ? expertIcon || (
                <Zap className='h-5 w-5' style={{ color: iconColor }} />
              )
            : beginnerIcon || (
                <Lightbulb className='h-5 w-5' style={{ color: iconColor }} />
              )}
        </motion.div>
      </motion.div>

      {/* Screen reader text */}
      <div className='sr-only'>{isExpertMode ? expertText : beginnerText}</div>
    </motion.div>
  )
}

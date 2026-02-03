/**
 * @fileoverview 徽章组件，用于显示状态指示器、标签或计数信息
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了徽章组件，用于显示小型状态指示器、标签或计数信息。
 *
 *          主要功能包括：
 *          - 提供状态指示（成功、警告、错误等）
 *          - 分类标签显示
 *          - 计数显示
 *          - 支持多种样式变体
 *
 *          导出组件：
 *          - Badge: 徽章组件
 *          - badgeVariants: 徽章变体配置
 *
 *          样式变体：
 *          - default: 默认样式
 *          - secondary: 次要样式
 *          - destructive: 危险样式
 *          - outline: 描边样式
 *
 *          使用场景：
 *          - 显示状态标签
 *          - 分类标记
 *          - 计数徽章
 *          - 特征标签
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tailwindcss"

/**
 * 徽章组件的变体配置
 * 定义不同样式变体的CSS类名和默认值
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * 徽章组件的属性接口
 * 继承HTML div属性和变体属性
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * 徽章组件
 * 用于显示小型状态指示器、标签或计数信息
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

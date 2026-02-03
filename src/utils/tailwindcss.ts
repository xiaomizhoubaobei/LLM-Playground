/**
 * @fileoverview TailwindCSS 工具函数，用于类名管理和优化
 * 结合 clsx 和 tailwind-merge 库实现高效的 CSS 类名处理
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了 TailwindCSS 类名处理工具函数，用于高效地合并、去重和条件应用 CSS 类名。
 *          主要功能包括：
 *          - 类名合并和去重，避免重复类名
 *          - 处理条件类名和动态类名
 *          - 与 clsx 和 tailwind-merge 库集成
 *
 *          使用场景：
 *          - React 组件中的类名管理
 *          - 动态样式应用
 *          - 组件库开发中的类名处理
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并和优化 Tailwind CSS 类名的工具函数
 * 使用 clsx 处理条件类名，使用 tailwind-merge 进行类名去重和优化
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

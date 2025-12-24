/**
 * @fileoverview TailwindCSS 工具函数，用于类名管理和优化
 * 结合 clsx 和 tailwind-merge 库实现高效的 CSS 类名处理
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供类名合并、去重和条件应用功能，优化 TailwindCSS 类名处理
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并和优化 Tailwind CSS 类名的工具函数
 * 使用 clsx 处理条件类名，使用 tailwind-merge 进行类名去重和优化
 * 
 * @function cn
 * @param {...ClassValue[]} inputs - 类名字符串、条件对象或数组
 * @returns {string} 合并并优化后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

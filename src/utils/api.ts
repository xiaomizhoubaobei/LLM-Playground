/**
 * @fileoverview API 工具函数，用于处理URL格式化和标准化
 * 确保应用程序中URL格式的一致性
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供URL标准化功能，移除末尾斜杠以统一格式
 */

/**
 * 通过移除末尾斜杠来标准化URL
 * 确保应用程序中URL格式的一致性
 * 
 * @function normalizeUrl
 * @param {string} url - 要标准化的URL
 * @returns {string} 移除末尾斜杠后的标准化URL
 */
export const normalizeUrl = (url: string) => {
  return url.replace(/\/+$/, '')
} 
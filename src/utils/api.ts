/**
 * @fileoverview API 工具函数，用于处理URL格式化和标准化
 * 确保应用程序中URL格式的一致性
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了 URL 标准化工具函数，用于确保应用程序中 URL 格式的一致性。
 *          主要功能包括：
 *          - 移除 URL 末尾的斜杠，统一 URL 格式
 *          - 处理多个连续斜杠的情况
 *
 *          使用场景：
 *          - 在发送 API 请求前标准化基础 URL
 *          - 确保路由和链接生成的一致性
 *          - 避免因末尾斜杠差异导致的请求错误
 */

/**
 * 通过移除末尾斜杠来标准化URL
 * 确保应用程序中URL格式的一致性
 *
 * @function normalizeUrl
 * @param url - 要标准化的URL
 */
export const normalizeUrl = (url: string): string => {
  return url.replace(/\/+$/, '')
} 
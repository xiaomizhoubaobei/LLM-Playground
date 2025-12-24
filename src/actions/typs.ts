/**
 * @fileoverview API 交互的通用响应类型定义
 * 为应用程序中的 API 响应提供标准化结构
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 定义应用程序中所有 API 响应的通用类型结构
 */

/**
 * API 响应的通用包装器类型
 * 为应用程序中的所有 API 响应提供一致的结构
 * 
 * @template T 响应中包含的数据类型
 * @interface GResponse
 * @property {number} code - HTTP 状态码或自定义响应码
 * @property {T} data - 泛型 T 的响应载荷
 * @property {string} message - 人类可读的响应消息
 */
export type GResponse<T> = {
  code: number
  data: T
  message: string
}

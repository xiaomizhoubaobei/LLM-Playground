/**
 * @fileoverview API 交互的通用响应类型定义
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块定义了应用程序中所有 API 响应的通用类型结构。
 *          为前端和后端之间的数据交互提供了一致的响应格式。
 *
 *          主要功能包括：
 *          - 统一的 API 响应格式
 *          - 泛型类型支持任意响应数据类型
 *          - 类型安全的响应结构
 *
 *          导出类型：
 *          - GResponse<T>: API 响应的通用包装器类型
 *
 *          类型结构（GResponse<T>）：
 *          - code: HTTP 状态码或自定义响应码
 *          - data: 泛型 T 的响应载荷
 *          - message: 人类可读的响应消息
 *
 *          使用场景：
 *          - 所有 API 路由的响应格式化
 *          - 前后端数据交互的统一接口
 *          - 错误信息的标准化返回
 *
 *          优势：
 *          - 简化错误处理
 *          - 提升代码可维护性
 *          - 确保 TypeScript 类型安全
 */

/**
 * API 响应的通用包装器类型
 * 为应用程序中的所有 API 响应提供一致的结构
 */
export type GResponse<T> = {
  code: number
  data: T
  message: string
}

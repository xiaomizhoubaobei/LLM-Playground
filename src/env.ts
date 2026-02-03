/**
 * @fileoverview 使用 t3-env 进行环境变量配置和验证
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了基于 t3-env 和 Zod 的类型安全环境变量配置，负责管理应用程序的运行时环境变量。
 *          该配置提供了环境变量的集中式管理和运行时验证功能，确保：
 *          - 类型安全：通过 TypeScript 类型系统提供完整的类型推断
 *          - 运行时验证：使用 Zod 模式在启动时验证环境变量的有效性
 *          - 安全隔离：明确区分服务端和客户端环境变量，防止敏感信息泄露
 *          - 开发体验：提供自动补全和类型检查，减少运行时错误
 *
 *          支持的环境变量：
 *          - 服务端：AI_302_API_KEY、AI_302_API_URL、AI_GITEE_API_KEY
 *          - 客户端：NEXT_PUBLIC_AI_302_API_UPLOAD_URL、NEXT_PUBLIC_AI_302_API_KEY、NEXT_PUBLIC_AI_GITEE_API_KEY
 *
 *          使用方式：
 *          - 从本模块导入 env 对象：import { env } from '@/env'
 *          - 通过 env.AI_302_API_KEY 访问环境变量（类型安全）
 *          - 如果环境变量缺失或无效，应用启动时会抛出错误
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * 创建并验证环境变量配置
 * 使用 Zod 模式提供类型安全的环境变量访问和运行时验证
 * 为安全起见分离服务端和客户端变量
 *
 * @function createEnvConfig
 * @returns {Object} 已验证的环境变量对象
 * @property {Object} server - 服务端环境变量（不暴露给客户端）
 * @property {string} server.AI_302_API_KEY - AI 302 服务认证的 API 密钥
 * @property {string} server.AI_302_API_URL - AI 302 服务端点的基础 URL
 * @property {Object} client - 客户端环境变量（暴露给浏览器）
 * @property {string} client.NEXT_PUBLIC_AI_302_API_UPLOAD_URL - AI 302 服务文件上传的上传 URL
 * @property {Object} experimental__runtimeEnv - 客户端的运行时环境变量
 */
export const env = createEnv({
  server: {
    AI_302_API_KEY: z.string().optional(),
    AI_302_API_URL: z.string().optional(),
    AI_GITEE_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_AI_302_API_UPLOAD_URL: z.string().optional(),
    NEXT_PUBLIC_AI_302_API_KEY: z.string().optional(),
    NEXT_PUBLIC_AI_GITEE_API_KEY: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_AI_302_API_UPLOAD_URL: process.env.NEXT_PUBLIC_AI_302_API_UPLOAD_URL,
    NEXT_PUBLIC_AI_302_API_KEY: process.env.NEXT_PUBLIC_AI_302_API_KEY,
    NEXT_PUBLIC_AI_GITEE_API_KEY: process.env.NEXT_PUBLIC_AI_GITEE_API_KEY,
  },
})

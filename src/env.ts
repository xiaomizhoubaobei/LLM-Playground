/**
 * @fileoverview 使用 t3-env 进行环境变量配置和验证
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark AI 302 服务集成的类型安全环境变量配置
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
  },
  client: {
    NEXT_PUBLIC_AI_302_API_UPLOAD_URL: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_AI_302_API_UPLOAD_URL: process.env.NEXT_PUBLIC_AI_302_API_UPLOAD_URL,
  },
})

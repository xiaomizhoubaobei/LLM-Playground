/**
 * @fileoverview 从 API 获取可用 AI 模型的服务器操作
 * 提供检索和验证模型信息的功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理 AI 模型信息的获取和管理
 */

'use server'

import { env } from "@/env"
import { normalizeUrl } from "@/utils/api"
import ky from "ky"
import { GResponse } from "./typs"
import { logger } from '@/utils/logger'

/**
 * 表示单个 AI 模型信息的结构
 * @interface ModelInfo
 * @property {string} id - 模型的唯一标识符
 * @property {string} object - 模型的类型/类别
 */
export type ModelInfo = {
  id: string
  object: string
}

/**
 * 包含模型信息的 API 响应类型定义
 * 将 ModelInfo 数组包装在通用响应结构中
 * @type {GResponse<ModelInfo[]>}
 */
export type GetModelResponse = GResponse<ModelInfo[]>

/**
 * 获取可用 AI 模型列表的服务器操作
 * 向 AI API 端点发出经过身份验证的请求以检索模型信息
 * 
 * @async
 * @function getModels
 * @returns {Promise<ModelInfo[]>} 可用模型信息的数组
 * @throws {Error} 如果 API 请求失败或返回无效数据
 */
export const getModels = async () => {
  logger.info('Fetching available models', { module: 'Models' })
  const baseUrl = normalizeUrl(env.AI_302_API_URL)
  
  try {
    const model = await ky
      .get(`${baseUrl}/v1/models?llm=1`, {
        headers: {
          Authorization: `Bearer ${env.AI_302_API_KEY}`,
        },
      })
      .json<GetModelResponse>()

    logger.info('Successfully fetched models', { 
      context: { modelCount: model.data.length },
      module: 'Models'
    })
    return model.data
  } catch (error) {
    logger.error('Failed to fetch models', error as Error, { module: 'Models' })
    throw error
  }
}
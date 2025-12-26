/**
 * @fileoverview 获取可用 AI 模型的服务器操作
 * 提供检索和验证模型信息的功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @modified 2025-12-26
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理 AI 模型信息的获取和管理
 */

'use server'

import { logger } from '@/utils/logger'
import { OPENAI_MODELS } from '@/constants/models'

/**
 * 表示单个 AI 模型信息的结构
 * @interface ModelInfo
 * @property {string} id - 模型的唯一标识符
 * @property {string} object - 模型的类型/类别
 * @property {string} provider - 模型供应商
 */
export type ModelInfo = {
  id: string
  object: string
  provider: string
}

/**
 * 获取可用 AI 模型列表的服务器操作
 * 根据服务提供商和模型提供商返回对应的模型列表
 * 
 * @async
 * @function getModels
 * @param {string} [provider] - 服务提供商，默认为 '302AI'
 * @param {string} [modelProvider] - 模型提供商，默认为 'OpenAI'
 * @returns {Promise<ModelInfo[]>} 可用模型信息的数组
 */
export const getModels = async (provider: string = '302AI', modelProvider: string = 'OpenAI') => {
  logger.info('Fetching available models', { context: { provider, modelProvider }, module: 'Models' })
  
  try {
    let models: ModelInfo[] = []

    // 根据服务提供商和模型提供商返回对应的模型列表
    if (provider === '302AI') {
      if (modelProvider === 'OpenAI') {
        // OpenAI 模型列表
        models = OPENAI_MODELS.map((modelId) => ({
          id: modelId,
          object: 'model',
          provider: '302AI',
        }))
      } else {
        // 其他模型提供商，后续扩展
        logger.warn('Model provider not implemented yet', { context: { modelProvider }, module: 'Models' })
        return []
      }
    } else {
      // 其他服务提供商，后续扩展
      logger.warn('Service provider not implemented yet', { context: { provider }, module: 'Models' })
      return []
    }

    logger.info('Successfully fetched models', { 
      context: { provider, modelProvider, modelCount: models.length },
      module: 'Models'
    })
    return models
  } catch (error) {
    logger.error('Failed to fetch models', error as Error, { context: { provider, modelProvider }, module: 'Models' })
    throw error
  }
}
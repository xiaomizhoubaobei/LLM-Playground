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
 * 获取指定 Service Provider 的所有模型列表
 * 通过调用 Service Provider 的 API 获取完整的模型列表
 * 
 * @async
 * @function fetchAllModels
 * @param {string} provider - 服务提供商，默认为 '302AI'
 * @param {string} apiKey - API 密钥
 * @returns {Promise<ModelInfo[]>} 所有模型信息的数组
 */
export const fetchAllModels = async (provider: string = '302AI', apiKey: string = '') => {
  logger.info('Fetching all models from service provider', { context: { provider }, module: 'Models' })

  try {
    let models: ModelInfo[] = []

    if (provider === '302AI') {
      // 从 302AI API 获取模型列表
      const apiUrl = 'https://api.302.ai/v1/models'
      const effectiveApiKey = apiKey || process.env.AI_302_API_KEY || ''

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${effectiveApiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`)
      }

      const data = await response.json()

      if (data && data.data && Array.isArray(data.data)) {
        // 确保返回纯对象，避免 null prototype 或其他不可序列化的属性
        models = data.data.map((model: any) => ({
          id: String(model.id),
          object: String(model.object || 'model'),
          provider: String(provider),
        }))
      }
    } else {
      logger.warn('Service provider not implemented yet', { context: { provider }, module: 'Models' })
      return []
    }

    logger.info('Successfully fetched all models', {
      context: { provider, modelCount: models.length },
      module: 'Models'
    })
    return models
  } catch (error) {
    logger.error('Failed to fetch all models', error as Error, { context: { provider }, module: 'Models' })
    // 如果 API 调用失败，返回本地定义的模型列表作为后备
    if (provider === '302AI') {
      logger.info('Using fallback local models', { context: { provider }, module: 'Models' })
      // 确保返回纯对象
      return OPENAI_MODELS.map((modelId) => ({
        id: String(modelId),
        object: 'model',
        provider: '302AI',
      }))
    }
    return []
  }
}

/**
 * 从模型列表中提取所有唯一的 Model Providers
 * 基于模型 ID 的前缀或命名约定来确定 Provider
 * 
 * @async
 * @function extractModelProviders
 * @param {ModelInfo[]} models - 模型列表
 * @returns {Promise<string[]>} Model Provider 列表
 */
export const extractModelProviders = async (models: ModelInfo[]) => {
  const providers = new Set<string>()

  for (const model of models) {
    // 基于模型 ID 的前缀来确定 Provider
    // 例如: gpt-4o, o1, claude-3, gemini-pro 等
    if (model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')) {
      providers.add('OpenAI')
    } else if (model.id.startsWith('claude')) {
      providers.add('Anthropic')
    } else if (model.id.startsWith('gemini')) {
      providers.add('Google')
    } else {
      // 默认归为 OpenAI
      providers.add('OpenAI')
    }
  }

  return Array.from(providers)
}

/**
 * 获取可用 AI 模型列表的服务器操作
 * 根据服务提供商和模型提供商返回对应的模型列表
 * 
 * @async
 * @function getModels
 * @param {string} [provider] - 服务提供商，默认为 '302AI'
 * @param {string} [modelProvider] - 模型提供商，默认为 'OpenAI'
 * @param {ModelInfo[]} [allModels] - 所有模型的列表（可选）
 * @returns {Promise<ModelInfo[]>} 可用模型信息的数组
 */
export const getModels = async (
  provider: string = '302AI',
  modelProvider: string = 'OpenAI',
  allModels?: ModelInfo[]
) => {
  logger.info('Fetching available models', { context: { provider, modelProvider }, module: 'Models' })

  try {
    let models: ModelInfo[] = []

    // 如果提供了所有模型列表，则进行过滤
    if (allModels && allModels.length > 0) {
      models = filterModelsByProvider(allModels, modelProvider)
    } else {
      // 否则根据服务提供商和模型提供商返回对应的模型列表
      if (provider === '302AI') {
        if (modelProvider === 'OpenAI') {
          // OpenAI 模型列表
          models = OPENAI_MODELS.map((modelId) => ({
            id: String(modelId),
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

/**
 * 根据模型提供商过滤模型列表
 * 
 * @function filterModelsByProvider
 * @param {ModelInfo[]} models - 所有模型列表
 * @param {string} modelProvider - 模型提供商
 * @returns {ModelInfo[]} 过滤后的模型列表
 */
function filterModelsByProvider(models: ModelInfo[], modelProvider: string): ModelInfo[] {
  return models.filter((model) => {
    if (modelProvider === 'OpenAI') {
      return model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')
    } else if (modelProvider === 'Anthropic') {
      return model.id.startsWith('claude')
    } else if (modelProvider === 'Google') {
      return model.id.startsWith('gemini')
    }
    // 默认返回 OpenAI 模型
    return model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')
  })
}
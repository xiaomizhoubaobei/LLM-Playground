/**
 * @fileoverview 获取可用 AI 模型的服务器操作
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供获取和管理 AI 模型信息的服务器端操作。
 *          支持从多个服务提供商（如 302AI、魔力方舟）获取模型列表，
 *          并能根据模型提供商（如 OpenAI、Anthropic、Google）进行过滤。
 *
 *          主要功能包括：
 *          - 从指定服务提供商获取完整模型列表
 *          - 从模型列表中提取唯一的模型提供商
 *          - 根据服务提供商和模型提供商过滤模型列表
 *          - 模型 ID 前缀自动识别（gpt、claude、gemini 等）
 *          - 统一的错误处理和日志记录
 *
 *          导出类型：
 *          - ModelInfo: 单个 AI 模型信息结构
 *
 *          导出函数：
 *          - fetchAllModels: 获取指定服务提供商的所有模型列表
 *          - extractModelProviders: 从模型列表中提取唯一的模型提供商
 *          - getModels: 根据服务提供商和模型提供商获取过滤后的模型列表
 *
 *          请求参数（fetchAllModels）：
 *          - provider: 服务提供商（默认 '302AI'）
 *          - apiKey: API 密钥（可选，使用环境变量作为默认值）
 *
 *          请求参数（getModels）：
 *          - provider: 服务提供商（默认 '302AI'）
 *          - modelProvider: 模型提供商（默认 'OpenAI'）
 *          - allModels: 所有模型的列表（可选）
 *
 *          响应格式：
 *          - 成功：ModelInfo[] 模型信息数组
 *          - 失败：空数组或抛出错误
 *
 *          依赖关系：
 *          - @/utils/logger: 日志记录工具
 *
 *          注意：魔力方舟 API 默认只获取 text2text 类型的模型
 */

'use server'

import { logger } from '@/utils/logger'

/**
 * 表示单个 AI 模型信息的结构
 */
export type ModelInfo = {
  id: string
  object: string
  provider: string
  modelProvider?: string
}

/**
 * 获取指定 Service Provider 的所有模型列表
 * 通过调用 Service Provider 的 API 获取完整的模型列表
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
          modelProvider: model.owned_by ? String(model.owned_by) : undefined,
        }))
      }
    } else if (provider === '魔力方舟') {
      // 从魔力方舟 API 获取模型列表，默认只获取 text2text 类型
      const apiUrl = 'https://ai.gitee.com/v1/models?type=text2text'
      const effectiveApiKey = apiKey || process.env.AI_GITEE_API_KEY || ''

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
        // 魔力方舟的模型使用 owned_by 字段作为 model provider
        // 确保返回纯对象，避免 null prototype 或其他不可序列化的属性
        models = data.data.map((model: any) => ({
          id: String(model.id),
          object: String(model.object || 'model'),
          provider: String(provider), // Service Provider
          modelProvider: String(model.owned_by || 'Unknown'), // Model Provider
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
    // 如果 API 调用失败，返回空数组
    return []
  }
}

/**
 * 从模型列表中提取所有唯一的 Model Providers
 * 基于模型 ID 的前缀或命名约定来确定 Provider
 */
export const extractModelProviders = async (models: ModelInfo[]) => {
  const providers = new Set<string>()

  for (const model of models) {
    // 优先使用 modelProvider 字段
    if (model.modelProvider) {
      providers.add(model.modelProvider)
    } else if (model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')) {
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
      // 没有提供模型列表，返回空数组
      logger.warn('No models provided', { context: { provider, modelProvider }, module: 'Models' })
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

/**
 * 根据模型提供商过滤模型列表
 */
function filterModelsByProvider(models: ModelInfo[], modelProvider: string): ModelInfo[] {
  return models.filter((model) => {
    // 优先使用 modelProvider 字段进行过滤
    if (model.modelProvider) {
      return model.modelProvider === modelProvider
    } else if (modelProvider === 'OpenAI') {
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
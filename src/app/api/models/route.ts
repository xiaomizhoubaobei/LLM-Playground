/**
 * @fileoverview 模型列表 API 路由处理
 * 提供获取模型列表的 API 端点
 * @author 祁筱欣
 * @date 2025-12-30
 * @license AGPL-3.0 license
 * @remark 处理模型列表的获取请求
 */

import { fetchAllModels } from '@/actions/models'
import { logger } from '@/utils/logger'

/**
 * 根据模型提供商过滤模型列表
 *
 * @function filterModelsByProvider
 * @param {Array} models - 所有模型列表
 * @param {string} modelProvider - 模型提供商
 * @returns {Array} 过滤后的模型列表
 */
function filterModelsByProvider(models: any[], modelProvider: string) {
  return models.filter((model) => {
    if (modelProvider === 'OpenAI') {
      return model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')
    } else if (modelProvider === 'Anthropic') {
      return model.id.startsWith('claude')
    } else if (modelProvider === 'Google') {
      return model.id.startsWith('gemini')
    }
    return true
  })
}

/**
 * 处理模型列表 API 的 POST 请求
 * 根据请求中的 action 参数执行不同的操作
 *
 * @function POST
 * @async
 * @param {Request} req - HTTP 请求对象
 * @returns {Promise<Response>} 响应对象
 */
export async function POST(req: Request) {
  try {
    const { provider, apiKey, action, modelProvider } = await req.json()

    logger.info('Models API request received', {
      context: { provider, action, modelProvider },
      module: 'ModelsAPI'
    })

    if (action === 'fetchAll') {
      // 获取所有模型列表
      logger.debug('Fetching all models', { context: { provider }, module: 'ModelsAPI' })
      const models = await fetchAllModels(provider, apiKey)
      
      logger.info('All models fetched successfully', {
        context: { provider, modelCount: models.length },
        module: 'ModelsAPI'
      })
      
      // 确保返回纯对象，移除任何可能的 null prototype 或其他不可序列化的属性
      const serializedModels = models.map((model) => ({
        id: String(model.id),
        object: String(model.object || 'model'),
        provider: String(model.provider),
      }))
      return Response.json({ models: serializedModels })
    } else if (action === 'getFiltered' && modelProvider) {
      // 获取所有模型列表并过滤
      logger.debug('Fetching filtered models', {
        context: { provider, modelProvider },
        module: 'ModelsAPI'
      })
      
      const allModels = await fetchAllModels(provider, apiKey)
      const filteredModels = filterModelsByProvider(allModels, modelProvider)
      
      logger.info('Filtered models fetched successfully', {
        context: { provider, modelProvider, modelCount: filteredModels.length },
        module: 'ModelsAPI'
      })
      
      const serializedModels = filteredModels.map((model) => ({
        id: String(model.id),
        object: String(model.object || 'model'),
        provider: String(model.provider),
      }))
      return Response.json({ models: serializedModels })
    } else {
      logger.warn('Invalid action in models API', {
        context: { action, modelProvider },
        module: 'ModelsAPI'
      })
      return Response.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    logger.error('Models API error:', error as Error, { module: 'ModelsAPI' })
    return Response.json(
      { error: '获取模型列表失败，请稍后重试' },
      { status: 500 }
    )
  }
}
/**
 * @fileoverview 模型列表 API 路由处理
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了模型列表 API 路由处理，用于获取和过滤 AI 模型列表。
 *          主要功能包括：
 *          - 获取所有可用模型列表（fetchAll）
 *          - 根据模型提供商过滤模型列表（getFiltered）
 *          - 支持多种模型提供商（OpenAI、Anthropic、Google 等）
 *          - 根据模型 ID 前缀自动识别模型提供商
 *          - 统一的错误处理和日志记录
 *
 *          API 端点：POST /api/models
 *
 *          请求参数：
 *          - provider: API 提供商
 *          - apiKey: API 密钥
 *          - action: 操作类型（fetchAll 或 getFiltered）
 *          - modelProvider: 模型提供商（OpenAI、Anthropic、Google 等，仅 getFiltered 需要）
 *
 *          响应格式：
 *          - 成功：{ models: [{ id, object, provider, modelProvider }] }
 *          - 失败：{ error: "错误信息" }
 *
 *          依赖关系：
 *          - @/actions/models: fetchAllModels 函数用于获取模型列表
 *          - @/utils/logger: 日志记录工具
 */

import { fetchAllModels } from '@/actions/models'
import { logger } from '@/utils/logger'

/**
 * 根据模型提供商过滤模型列表
 *
 * @function filterModelsByProvider
 * @param models - 所有模型列表
 * @param modelProvider - 模型提供商
 * @returns 过滤后的模型列表
 */
function filterModelsByProvider(models: any[], modelProvider: string) {
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
    return true
  })
}

/**
 * 处理模型列表 API 的 POST 请求
 * 根据请求中的 action 参数执行不同的操作
 *
 * @function POST
 * @async
 * @param req - HTTP 请求对象
 * @returns 响应对象
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
        modelProvider: model.modelProvider ? String(model.modelProvider) : undefined,
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
        modelProvider: model.modelProvider ? String(model.modelProvider) : undefined,
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
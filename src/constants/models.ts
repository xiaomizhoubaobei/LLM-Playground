/**
 * @fileoverview 模型提供商和模型列表常量定义
 * @author zpl
 * @date 2025-12-26
 * @license AGPL-3.0 license
 */

/**
 * OpenAI 模型列表
 */
export const OPENAI_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-0125-preview',
  'gpt-4-0613',
  'gpt-4-1106-preview',
  'gpt-4-32k',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-instruct',
  'gpt-4-gizmo-*',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4-plus',
  'gpt-4o-2024-08-06',
  'chatgpt-4o-latest',
  'gpt-4o-2024-05-13',
  'gpt-4-turbo-2024-04-09',
  'gpt-4o-2024-11-20',
  'gpt-4o-plus',
  'o1-plus',
  'o1',
  'o1-2024-12-17',
  'o3-mini',
  'o3-mini-2025-01-31',
  'gpt-4.1',
  'gpt-4.1-2025-04-14',
  'gpt-4.1-mini',
  'gpt-4.1-mini-2025-04-14',
  'gpt-4.1-nano',
  'gpt-4.1-nano-2025-04-14',
  'o3',
  'o4-mini',
  'o4-mini-2025-04-16',
  'o3-2025-04-16',
  'gpt-4o-search-preview',
  'gpt-4o-mini-search-preview',
  'o3-pro',
  'o3-pro-2025-06-10',
  'gpt-4-sonnet-20250514-cursor',
  'gpt-4-opus-4-20250514-cursor',
  'gpt-4-opus-20250514-cursor',
  'o3-deep-research',
  'o3-deep-research-2025-06-26',
  'o4-mini-deep-research',
  'o4-mini-deep-research-2025-06-26',
  'gpt-oss-120b',
  'gpt-oss-20b',
  'gpt-5',
  'gpt-5-2025-08-07',
  'gpt-5-mini',
  'gpt-5-mini-2025-08-07',
  'gpt-5-nano',
  'gpt-5-nano-2025-08-07',
  'gpt-5-chat-latest',
  'gpt-5-thinking',
  'gpt-5-codex-low',
  'gpt-5-codex-medium',
  'gpt-5-codex-high',
  'gpt-5-codex',
  'sora-2',
  'gpt-5-pro',
  'gpt-5-pro-2025-10-06',
  'gpt-5.1-plus',
  'gpt-5.1-thinking-plus',
  'gpt-5.1',
  'gpt-5.1-2025-11-13',
  'gpt-5.1-codex',
  'gpt-5.1-chat-latest',
  'gpt-5.1-codex-mini',
  'gpt-5.2',
  'gpt-5.2-2025-12-11',
  'gpt-5.2-chat-latest',
  'gpt-5.2-pro',
]

/**
 * 模型提供商列表
 */
export const MODEL_PROVIDERS = ['OpenAI'] as const

export type ModelProvider = (typeof MODEL_PROVIDERS)[number]
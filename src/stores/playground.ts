/**
 * @fileoverview 使用 Jotai atoms 管理的 Playground 状态
 * 管理聊天设置、消息和UI偏好，支持持久化存储
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块使用 Jotai atoms 管理 Playground 应用的状态，提供持久化存储和响应式状态管理。
 *          主要功能包括：
 *          - 聊天设置管理（API 密钥、模型选择、温度、最大 Token 等）
 *          - 消息列表和对话历史管理
 *          - UI 偏好设置（主题、侧边栏、Markdown 预览等）
 *          - 令牌概率显示设置
 *
 *          使用场景：
 *          - Playground 应用的全局状态管理
 *          - 用户设置的持久化存储
 *          - 组件间状态共享和同步
 */

import { atomWithStorage } from 'jotai/utils';

/**
 * LogProbs 类型定义
 * 本地定义替代 @ai-sdk/provider 中的 LanguageModelV1LogProbs
 */
export type LogProbs = Array<{
  token: string
  logprob: number
  topLogprobs: Array<{
    token: string
    logprob: number
  }>
}>

/**
 * 管理 Playground 设置的持久化存储 Atom
 * 使用 localStorage 在会话间保持设置
 */
export const playgroundSettiongsAtom = atomWithStorage('playground-settings', {
  model: 'gpt-4o',
  provider: '302AI',
  modelProvider: 'OpenAI',
  streamMode: true,
  temperature: 0.7,
  topP: 0.7,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
  apiKey: '',
  maxTokens: 8192,
})

/**
 * Playground 中聊天消息的类型定义
 * 表示用户输入和AI响应
 */
export type PlaygroundMessage = {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: number
  conversationId?: number
  files?: {
    url: string
    type: 'image' | 'file'
    name: string
    size: number
  }[]
  logprobs?: LogProbs
}

/**
 * UI 模式设置的类型定义
 * 控制界面的复杂程度
 */
export type UiMode = 'beginner' | 'expert'

/**
 * 管理 UI 模式偏好的持久化存储 Atom
 * 新用户默认为 'beginner' 模式
 */
export const uiModeAtom = atomWithStorage<UiMode>('ui-mode', 'beginner')

/**
 * 发送前验证消息内容
 * 确保消息不为空或仅包含空白字符
 */
export const validateMessage = (content: string) => {
  if (!content.trim()) return false
  return true
}

/**
 * 从 localStorage 同步获取 Playground 设置
 * 用于不适合异步 atom 访问的场景
 */
export const getSettingsSync = () => {
  return JSON.parse(localStorage.getItem('playground-settings') || '{}')
}
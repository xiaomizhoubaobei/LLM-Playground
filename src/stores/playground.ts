/**
 * @fileoverview 使用 Jotai atoms 管理的 Playground 状态
 * 管理聊天设置、消息和UI偏好，支持持久化存储
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供完整的状态管理系统，包括设置、消息、UI模式和验证功能
 */

import { LanguageModelV1LogProbs } from '@ai-sdk/provider';
import { atomWithStorage } from 'jotai/utils';

/**
 * 管理 Playground 设置的持久化存储 Atom
 * 使用 localStorage 在会话间保持设置
 * 
 * @constant playgroundSettiongsAtom
 * @type {Atom<PlaygroundSettings>}
 * @property {string} model - 选中的AI模型标识符
 * @property {number} temperature - 模型温度设置 (0-1)
 * @property {number} topP - Top-p 采样参数 (0-1)
 * @property {number} frequencyPenalty - 频繁令牌使用的惩罚 (0-2)
 * @property {number} presencePenalty - 令牌存在的惩罚 (0-2)
 * @property {string} apiKey - 模型访问的API密钥
 * @property {number} maxTokens - 模型的最大令牌数
 */
export const playgroundSettiongsAtom = atomWithStorage('playground-settings', {
  model: 'gpt-4o',
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
 * 
 * @interface PlaygroundMessage
 * @property {string} id - 唯一消息标识符
 * @property {'system' | 'user' | 'assistant'} role - 消息发送者角色
 * @property {string} content - 消息内容
 * @property {number} [timestamp] - 可选的消息时间戳
 * @property {Object[]} [files] - 可选的文件或图片
 * @property {string} files[].url - 文件或图片URL
 * @property {'image' | 'file'} files[].type - 文件或图片类型
 * @property {string} files[].name - 文件或图片名称
 * @property {number} files[].size - 文件或图片大小
 * @property {LanguageModelV1LogProbs} [logprobs] - 可选的logprobs
 */
export type PlaygroundMessage = {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: number
  files?: {
    url: string
    type: 'image' | 'file'
    name: string
    size: number
  }[]
  logprobs?: LanguageModelV1LogProbs
}

/**
 * UI 模式设置的类型定义
 * 控制界面的复杂程度
 * 
 * @typedef UiMode
 * @type {'beginner' | 'expert'}
 */
export type UiMode = 'beginner' | 'expert'

/**
 * 管理 UI 模式偏好的持久化存储 Atom
 * 新用户默认为 'beginner' 模式
 * 
 * @constant uiModeAtom
 * @type {import('jotai').Atom<UiMode>}
 */
export const uiModeAtom = atomWithStorage<UiMode>('ui-mode', 'beginner')

/**
 * 发送前验证消息内容
 * 确保消息不为空或仅包含空白字符
 * 
 * @function validateMessage
 * @param {string} content - 要验证的消息内容
 * @returns {boolean} 如果消息有效返回 true，否则返回 false
 */
export const validateMessage = (content: string) => {
  if (!content.trim()) return false
  return true
}

/**
 * 从 localStorage 同步获取 Playground 设置
 * 用于不适合异步 atom 访问的场景
 * 
 * @function getSettingsSync
 * @returns {PlaygroundSettings} 当前的 Playground 设置
 */
export const getSettingsSync = () => {
  return JSON.parse(localStorage.getItem('playground-settings') || '{}')
}
/**
 * @fileoverview 使用 Dexie.js 进行 IndexedDB 数据库配置和初始化
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 数据库配置和初始化，使用 Dexie.js 提供 IndexedDB 功能
 */

import { PlaygroundMessage } from '@/stores/playground'
import Dexie, { Table } from 'dexie'

/**
 * 会话接口定义
 * @interface Conversation
 */
export interface Conversation {
  id?: number
  title: string
  createdAt: number
  updatedAt: number
  messageCount: number
}

/**
 * PlaygroundDB 类扩展 Dexie 以提供 IndexedDB 功能
 * 管理游乐场功能的消息存储和会话管理
 *
 * @class
 * @extends {Dexie}
 * @property {Table<Conversation>} conversations - 用于存储对话会话的表
 * @property {Table<PlaygroundMessage>} messages - 用于存储游乐场消息的表
 * @description 使用 Dexie.js 封装的 IndexedDB 数据库类，提供消息存储和会话管理功能
 */
export class PlaygroundDB extends Dexie {
  conversations!: Table<Conversation>
  messages!: Table<PlaygroundMessage>

  /**
   * 初始化 PlaygroundDB 数据库
   * 创建版本为3的数据库架构
   *
   * @constructor
   * @description 设置数据库，包含两个表：
   *   - conversations：存储对话会话信息
   *   - messages：存储消息内容
   * @remark 使用版本3确保数据库架构支持会话管理功能
   */
  constructor() {
    super('PlaygroundDB')

    this.version(3).stores({
      conversations: '++id, createdAt, updatedAt',
      messages: '++id, conversationId, role, timestamp'
    })
  }
}

/**
 * PlaygroundDB 的单例实例
 * 对所有数据库操作使用此实例
 *
 * @constant
 * @type {PlaygroundDB}
 * @description 导出数据库单例实例，确保整个应用程序使用同一个数据库连接
 */
export const db = new PlaygroundDB()
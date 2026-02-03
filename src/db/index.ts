/**
 * @fileoverview 使用 Dexie.js 进行 IndexedDB 数据库配置和初始化
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了基于 Dexie.js 的 IndexedDB 数据库配置和初始化功能。
 *          主要功能包括：
 *          - 定义数据库架构和表结构
 *          - 创建 conversations 和 messages 两个表
 *          - 支持会话管理和消息存储
 *          - 提供类型安全的数据库操作接口
 *          - 实现数据库版本管理（当前版本3）
 *
 *          使用场景：
 *          - 持久化存储聊天对话会话
 *          - 存储和管理聊天消息
 *          - 支持离线数据访问
 *          - 在浏览器中保存用户对话历史
 *
 *          数据库架构：
 *          - conversations 表：存储对话会话信息
 *            * id: 自增主键
 *            * createdAt: 创建时间索引
 *            * updatedAt: 更新时间索引
 *          - messages 表：存储消息内容
 *            * id: 自增主键
 *            * conversationId: 会话ID索引
 *            * role: 消息角色索引
 *            * timestamp: 时间戳索引
 *
 *          依赖关系：
 *          - 依赖 @/stores/playground 获取 PlaygroundMessage 类型
 *          - 使用 Dexie.js 作为 IndexedDB 封装库
 */

import { PlaygroundMessage } from '@/stores/playground'
import Dexie, { Table } from 'dexie'

/**
 * 会话接口定义
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
 */
export class PlaygroundDB extends Dexie {
  conversations!: Table<Conversation>
  messages!: Table<PlaygroundMessage>

  /**
   * 初始化 PlaygroundDB 数据库
   * 创建版本为3的数据库架构
   */
    constructor() {    super('PlaygroundDB')

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
 */
export const db = new PlaygroundDB()
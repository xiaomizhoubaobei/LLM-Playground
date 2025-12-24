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
 * PlaygroundDB 类扩展 Dexie 以提供 IndexedDB 功能
 * 管理游乐场功能的消息存储
 * 
 * @class
 * @extends {Dexie}
 * @property {Table<PlaygroundMessage>} messages - 用于存储游乐场消息的表
 * @description 使用 Dexie.js 封装的 IndexedDB 数据库类，提供消息存储和管理功能
 */
export class PlaygroundDB extends Dexie {
  messages!: Table<PlaygroundMessage>

  /**
   * 初始化 PlaygroundDB 数据库
   * 创建版本为2的数据库架构
   * 
   * @constructor
   * @description 设置数据库，包含一个 'messages' 表，该表包含：
   *   - id（自增主键）
   *   - role（已建立索引）
   *   - timestamp（已建立索引）
   * @remark 使用版本2确保数据库架构的最新性
   */
  constructor() {
    super('PlaygroundDB')
    
    this.version(2).stores({
      messages: '++id, role, timestamp'
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
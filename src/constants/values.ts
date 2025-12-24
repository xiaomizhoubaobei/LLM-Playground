/**
 * @fileoverview 应用程序中使用的全局常量和配置值
 * 提供整个应用程序的常量定义和配置管理
 * @author zpl
 * @created 2024-11-20
 * @modified 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 定义国际化配置、默认值和其他全局常量
 */

/**
 * 全局应用程序常量
 * @constant
 * @type {Object}
 * @since 2024-11-20
 * @modified 2025-12-24
 */
export const GLOBAL = {
  /**
   * 国际化（i18n）配置设置
   * @property {Object} LOCALE - 本地化相关常量
   * @property {string} LOCALE.KEY - 用于存储语言偏好的键名
   * @property {string[]} LOCALE.SUPPORTED - 支持的语言代码列表：
   *   - 'zh': 中文
   *   - 'en': 英文
   *   - 'ja': 日文
   * @property {string} LOCALE.DEFAULT - 默认语言代码（英文）
   * @since 2024-11-20
   */
  LOCALE: {
    KEY: 'lang',
    SUPPORTED: ['zh', 'en', 'ja'],
    DEFAULT: 'en',
  },
}

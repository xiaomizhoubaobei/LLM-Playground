/**
 * @fileoverview 应用程序中使用的全局常量和配置值
 * 提供整个应用程序的常量定义和配置管理
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了应用程序的全局常量和配置值定义。
 *          主要功能包括：
 *          - 定义国际化（i18n）语言配置
 *          - 管理支持的语言列表
 *          - 设置默认语言和语言偏好存储键
 *          - 提供全局可访问的常量对象
 *
 *          使用场景：
 *          - 在路由配置中使用语言配置
 *          - 在组件中访问支持的语言列表
 *          - 在设置页面管理语言偏好
 *          - 在任何需要国际化配置的地方引用
 *
 *          配置说明：
 *          - 支持的语言：中文（zh）、英文（en）、日文（ja）
 *          - 默认语言：英文（en）
 *          - 语言偏好存储键：'lang'
 *
 *          依赖关系：
 *          - 被 @/i18n/routing 用于路由配置
 *          - 被应用程序其他模块引用
 */

/**
 * 全局应用程序常量
 * @constant
 */
export const GLOBAL = {
  /**
   * 国际化（i18n）配置设置
   */
  LOCALE: {
    KEY: 'lang',
    SUPPORTED: ['zh', 'en', 'ja'],
    DEFAULT: 'en',
  },
}

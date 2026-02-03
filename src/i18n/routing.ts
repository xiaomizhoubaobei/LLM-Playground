/**
 * @fileoverview 国际化路由配置和导航工具
 * 提供多语言路由支持和本地化导航功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了国际化路由配置和导航工具，用于处理应用程序的多语言路由需求。
 *          主要功能包括：
 *          - 定义支持的语言列表和默认语言
 *          - 创建国际化感知的导航组件和工具函数
 *          - 提供路由重定向和路径名获取功能
 *
 *          使用场景：
 *          - 在 Next.js 应用中实现多语言支持
 *          - 处理语言切换和路由导航
 *          - 确保所有链接和重定向都包含正确的语言前缀
 *
 *          工作流程：
 *          1. 使用 defineRouting 创建基础路由配置
 *          2. 使用 createNavigation 生成导航工具
 *          3. 导出 Link、redirect、useRouter 等工具供应用使用
 *
 *          依赖关系：
 *          - 依赖 @/constants/values 获取全局语言配置
 *          - 被 ./i18n/request.ts 的代理中间件使用
 */

import { GLOBAL } from '@/constants/values'
import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

/**
 * 定义国际化的基础路由配置
 * 使用全局常量指定支持的语言和默认语言
 * 
 * @constant routing
 */
export const routing = defineRouting({
  locales: GLOBAL.LOCALE.SUPPORTED,
  defaultLocale: GLOBAL.LOCALE.DEFAULT,
})

/**
 * 导出配置了国际化支持的导航工具
 * 包括 Link、redirect、usePathname、useRouter 和 getPathname
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

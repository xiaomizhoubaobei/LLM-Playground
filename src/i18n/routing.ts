/**
 * @fileoverview 国际化路由配置和导航工具
 * 提供多语言路由支持和本地化导航功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 定义支持的语言、默认语言，并提供国际化导航组件和工具函数
 */

import { GLOBAL } from '@/constants/values'
import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

/**
 * 定义国际化的基础路由配置
 * 使用全局常量指定支持的语言和默认语言
 * 
 * @constant routing
 * @type {Object}
 * @property {string[]} locales - 支持的语言代码数组
 * @property {string} defaultLocale - 应用程序的默认语言代码
 */
export const routing = defineRouting({
  locales: GLOBAL.LOCALE.SUPPORTED,
  defaultLocale: GLOBAL.LOCALE.DEFAULT,
})

/**
 * 导出配置了国际化支持的导航工具
 * 
 * @exports {Object} Navigation utilities
 * @property {Component} Link - 国际化链接组件
 * @property {Function} redirect - 处理国际化感知的重定向函数
 * @property {Function} usePathname - 获取当前路径名的Hook
 * @property {Function} useRouter - 国际化感知的路由Hook
 * @property {Function} getPathname - 生成本地化路径名的函数
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

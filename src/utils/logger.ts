/**
 * @fileoverview 统一日志系统，支持客户端和服务端日志记录
 * 提供彩色输出、日志级别和上下文信息功能
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 实现单例模式的日志记录器，支持多种日志级别和运行环境
 */

import chalk from 'chalk'

/**
 * 日志级别枚举，按严重程度升序排列
 * 
 * @enum {string}
 * @property {string} DEBUG - 调试信息
 * @property {string} INFO - 一般信息
 * @property {string} WARN - 警告信息
 * @property {string} ERROR - 错误信息
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * 使用 chalk 为不同日志级别配置颜色
 * 
 * @const LogColors
 * @type {Object.<LogLevel, Function>}
 */
const LogColors = {
  [LogLevel.DEBUG]: chalk.blue,
  [LogLevel.INFO]: chalk.green,
  [LogLevel.WARN]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
}

/**
 * 日志操作配置选项接口
 * 
 * @interface LogOptions
 * @property {LogLevel} [level] - 日志严重级别
 * @property {string} [module] - 生成日志的模块/组件名称
 * @property {Record<string, unknown>} [context] - 额外的上下文数据
 * @property {boolean} [isServer] - 是否来自服务端日志
 */
export interface LogOptions {
  level?: LogLevel
  module?: string
  context?: Record<string, unknown>
  isServer?: boolean
}

/**
 * 默认日志配置
 * 
 * @const defaultOptions
 * @type {LogOptions}
 */
const defaultOptions: LogOptions = {
  level: LogLevel.INFO,
  module: 'APP',
  isServer: typeof window === 'undefined',
}

/**
 * 实现单例模式的日志记录器类
 * 提供统一日志功能，支持不同严重级别
 * 
 * @class Logger
 */
class Logger {
  private static instance: Logger
  private isDevelopment: boolean

  /**
   * 私有构造函数，强制执行单例模式
   * 确定运行环境
   */
  private constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production'
  }

  /**
   * 获取日志记录器的单例实例
   * 
   * @static
   * @returns {Logger} 日志记录器的单例实例
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  /**
   * 格式化日志消息，添加时间戳、运行环境和上下文
   * 
   * @private
   * @param {string} message - 主要日志消息
   * @param {LogOptions} options - 日志配置选项
   * @returns {string} 格式化后的日志消息
   */
  private formatMessage(message: string, options: LogOptions): string {
    const timestamp = new Date().toISOString()
    const moduleInfo = options.module ? `[${options.module}]` : ''
    const runtimeEnv = options.isServer ? '[Server]' : '[Client]'
    const contextInfo = options.context ? `\nContext: ${JSON.stringify(options.context, null, 2)}` : ''
    
    return `${timestamp} ${runtimeEnv} ${moduleInfo} ${message}${contextInfo}`
  }

  /**
   * 核心日志函数，处理消息格式化和输出
   * 仅在开发环境或生产环境明确启用时记录日志
   * 
   * @private
   * @param {string} message - 要记录的消息
   * @param {LogOptions} options - 日志配置选项
   */
  private log(message: string, options: LogOptions = defaultOptions): void {
    const mergedOptions = { ...defaultOptions, ...options }
    const formattedMessage = this.formatMessage(message, mergedOptions)
    const colorize = LogColors[mergedOptions.level!]

    // 仅在开发环境或明确启用生产环境日志时记录
    if (!this.isDevelopment && !process.env.ENABLE_PRODUCTION_LOGGING) {
      return
    }

    switch (mergedOptions.level) {
      case LogLevel.DEBUG:
        console.debug(colorize(formattedMessage))
        break
      case LogLevel.INFO:
        console.info(colorize(formattedMessage))
        break
      case LogLevel.WARN:
        console.warn(colorize(formattedMessage))
        break
      case LogLevel.ERROR:
        console.error(colorize(formattedMessage))
        break
    }
  }

  /**
   * 记录调试信息
   * 
   * @param {string} message - 调试消息
   * @param {Omit<LogOptions, 'level'>} [options] - 排除level的日志选项
   */
  public debug(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: LogLevel.DEBUG })
  }

  /**
   * 记录一般信息
   * 
   * @param {string} message - 信息消息
   * @param {Omit<LogOptions, 'level'>} [options] - 排除level的日志选项
   */
  public info(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: LogLevel.INFO })
  }

  /**
   * 记录警告信息
   * 
   * @param {string} message - 警告消息
   * @param {Omit<LogOptions, 'level'>} [options] - 排除level的日志选项
   */
  public warn(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: LogLevel.WARN })
  }

  /**
   * 记录错误信息，包含可选的错误对象详情
   * 
   * @param {string} message - 错误消息
   * @param {Error} [error] - 要包含在上下文中的错误对象
   * @param {Omit<LogOptions, 'level'>} [options] - 排除level的日志选项
   */
  public error(message: string, error?: Error, options?: Omit<LogOptions, 'level'>): void {
    const errorContext = error ? {
      context: {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      },
    } : {}
    
    this.log(message, { ...options, ...errorContext, level: LogLevel.ERROR })
  }
}

/**
 * Logger 类的单例实例
 * 在整个应用程序中使用此实例进行所有日志操作
 * 
 * @const logger
 * @type {Logger}
 */
export const logger = Logger.getInstance()

/**
 * @fileoverview 统一日志系统，支持客户端和服务端日志记录
 * 提供彩色输出、日志级别和上下文信息功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了统一的日志记录系统，支持客户端和服务端日志记录，采用单例模式实现。
 *          主要功能包括：
 *          - 多级日志（DEBUG、INFO、WARN、ERROR）
 *          - 彩色控制台输出（使用 chalk 库）
 *          - 支持模块标识和上下文信息
 *          - 运行环境检测（客户端/服务端）
 *
 *          使用场景：
 *          - 应用程序调试和错误追踪
 *          - 性能监控和日志分析
 *          - 开发环境调试信息输出
 */

import chalk from 'chalk'

/**
 * 日志级别枚举，按严重程度升序排列
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * 使用 chalk 为不同日志级别配置颜色
 */
const LogColors = {
  [LogLevel.DEBUG]: chalk.blue,
  [LogLevel.INFO]: chalk.green,
  [LogLevel.WARN]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
}

/**
 * 日志操作配置选项接口
 */
export interface LogOptions {
  level?: LogLevel
  module?: string
  context?: Record<string, unknown>
  isServer?: boolean
}

/**
 * 默认日志配置
 */
const defaultOptions: LogOptions = {
  level: LogLevel.INFO,
  module: 'APP',
  isServer: typeof window === 'undefined',
}

/**
 * 实现单例模式的日志记录器类
 * 提供统一日志功能，支持不同严重级别
 */
class Logger {
  private static instance: Logger

  /**
   * 私有构造函数，强制执行单例模式
   */
  private constructor() {
  }

  /**
   * 获取日志记录器的单例实例
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  /**
   * 格式化日志消息，添加时间戳、运行环境和上下文
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
   */
  private log(message: string, options: LogOptions = defaultOptions): void {
    const mergedOptions = { ...defaultOptions, ...options }
    const formattedMessage = this.formatMessage(message, mergedOptions)
    const colorize = LogColors[mergedOptions.level!]

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
   */
  public debug(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: LogLevel.DEBUG })
  }

  /**
   * 记录一般信息
   */
  public info(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: LogLevel.INFO })
  }

  /**
   * 记录警告信息
   */
  public warn(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: LogLevel.WARN })
  }

  /**
   * 记录错误信息，包含可选的错误对象详情
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
 */
export const logger = Logger.getInstance()

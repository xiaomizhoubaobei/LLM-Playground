/**
 * @fileoverview PGlite数据库提供者组件，为应用程序提供客户端PostgreSQL数据库功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了 PGlite 数据库提供者组件，为应用程序提供客户端 PostgreSQL 数据库功能。
 *
 *          主要功能包括：
 *          - 客户端 PostgreSQL 数据库
 *          - 实时数据同步（live queries）
 *          - 消息表结构管理
 *          - React Context 集成
 *
 *          导出组件：
 *          - PGliteProvider: PGlite 数据库提供者组件
 *
 *          数据库配置：
 *          - 数据库名称：playground
 *          - 消息表字段：id, role, content, annotations
 *
 *          使用场景：
 *          - 客户端数据存储
 *          - 离线数据管理
 *          - 本地缓存
 *          - 实时数据同步
 */

"use client"

import { useEffect } from "react"
import { PGliteProvider as PGliteProviderBase } from "@electric-sql/pglite-react"

/**
 * PGlite数据库提供者组件
 * 为应用程序包装并提供PGlite数据库上下文
 */
export function PGliteProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('PGliteProvider')
  }, [])
  return <PGliteProviderBase>{children}</PGliteProviderBase>
}
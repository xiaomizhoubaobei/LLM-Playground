/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark PGlite数据库提供者组件，为应用程序提供客户端PostgreSQL数据库功能
 */

"use client"

import { useEffect } from "react"
import { PGlite } from "@electric-sql/pglite"
import { live } from "@electric-sql/pglite/live"
import { PGliteProvider as PGliteProviderBase } from "@electric-sql/pglite-react"

// 创建PGlite数据库实例，配置消息表结构
const db = PGlite.create({
  database: 'playground',
  schema: {
    messages: {
      columns: ['id', 'role', 'content', 'annotations'],
    },
  },
})

/**
 * PGlite数据库提供者组件
 * 为应用程序包装并提供PGlite数据库上下文
 * 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export function PGliteProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('PGliteProvider')
  }, [])
  return <PGliteProviderBase>{children}</PGliteProviderBase>
}
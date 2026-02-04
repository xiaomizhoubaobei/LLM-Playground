/**
 * @fileoverview 仅在客户端渲染的 React 组件包装器
 * @author 祁筱欣
 * @date 2026-02-04
 * @since 2025-12-24
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块实现了一个客户端专用的 React 组件包装器，通过仅在客户端挂载后渲染内容来防止水合不匹配问题。
 *          该组件适用于依赖浏览器 API 或需要防止服务端渲染（SSR）与客户端渲染不一致的场景。
 *
 *          工作流程：
 *          1. 组件初始渲染时 hasMounted 状态为 false，返回 null 阻止渲染
 *          2. useEffect 在客户端挂载后执行，将 hasMounted 设置为 true
 *          3. hasMounted 为 true 时，渲染子元素到 div 容器中
 *
 *          使用场景：
 *          - 依赖 window、document 等浏览器 API 的组件
 *          - 需要访问 localStorage 的组件
 *          - 动态导入的第三方库组件
 */

import React from 'react'

/**
 * ClientOnly组件的Props类型
 * 扩展标准HTML div属性以支持子元素
 */
type ClientOnlyProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>

/**
 * 仅在客户端渲染子元素的包装组件
 * 适用于依赖浏览器API或需要防止水合不匹配的组件
 *
 * @component
 * @param props - 组件属性
 *
 * @example
 * ```tsx
 * // 包装依赖浏览器的组件
 * <ClientOnly>
 *   <BrowserOnlyComponent />
 * </ClientOnly>
 * 
 * // 带有额外div属性
 * <ClientOnly className="mt-4 p-2">
 *   <BrowserOnlyContent />
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children, ...delegated }: ClientOnlyProps) {
  // 跟踪组件挂载状态
  const [hasMounted, setHasMounted] = React.useState(false)

  // 在初始渲染后设置挂载状态
  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  // 在客户端挂载前阻止渲染
  if (!hasMounted) {
    return null
  }

  return <div {...delegated}>{children}</div>
}

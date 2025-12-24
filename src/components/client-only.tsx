/**
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 仅在客户端渲染的React组件包装器，通过仅在客户端挂载后渲染内容来防止水合不匹配
 */

import React from 'react'

/**
 * ClientOnly组件的Props类型
 * 扩展标准HTML div属性以支持子元素
 * 
 * @typedef {React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>} ClientOnlyProps
 */
type ClientOnlyProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>

/**
 * 仅在客户端渲染子元素的包装组件
 * 适用于依赖浏览器API或需要防止水合不匹配的组件
 * 
 * @component
 * @param {ClientOnlyProps} props - 组件属性
 * @param {React.ReactNode} props.children - 要渲染的子元素
 * @param {React.HTMLAttributes<HTMLDivElement>} props.delegated - 额外的HTML div属性
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

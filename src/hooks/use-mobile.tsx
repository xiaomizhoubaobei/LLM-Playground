/**
 * @fileoverview React Hook，用于检测移动端视口和响应式设计
 * 提供实时检测移动设备视口的功能，支持响应式布局
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 基于CSS媒体查询和窗口大小事件实现移动端检测，防止水合不匹配
 */

import * as React from "react"

/**
 * 定义移动端和桌面端视图边界的断点宽度（像素）
 * 视口宽度低于此值被视为移动端
 * 
 * @constant MOBILE_BREAKPOINT
 * @type {number}
 */
const MOBILE_BREAKPOINT = 768

/**
 * 检测当前视口是否为移动端大小的 React Hook
 * 使用CSS媒体查询和窗口大小事件进行实时检测
 * 
 * @function useIsMobile
 * @returns {boolean} 如果视口宽度小于 MOBILE_BREAKPOINT 则返回 true
 */
export function useIsMobile() {
  // 初始化状态为 undefined，防止水合不匹配
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 为移动端断点创建媒体查询列表
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // 视口变化时更新状态
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // 添加事件监听器并设置初始值
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // 组件卸载时清理事件监听器
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // 将 undefined 转换为 false，确保返回一致的布尔值
  return !!isMobile
}

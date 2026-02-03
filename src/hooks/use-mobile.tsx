/**
 * @fileoverview React Hook，用于检测移动端视口和响应式设计
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了检测移动端视口的 React Hook，用于响应式设计和移动端适配。
 *
 *          主要功能包括：
 *          - 基于 CSS 媒体查询的移动端检测
 *          - 实时响应窗口大小变化
 *          - 防止水合不匹配问题
 *          - 支持响应式布局切换
 *
 *          导出函数：
 *          - useIsMobile: 检测当前视口是否为移动端
 *
 *          配置参数：
 *          - MOBILE_BREAKPOINT: 移动端断点宽度（默认 768px）
 *
 *          返回值：
 *          - boolean: 视口宽度小于断点时返回 true
 *
 *          使用场景：
 *          - 响应式布局切换
 *          - 移动端适配优化
 *          - 条件渲染移动端/桌面端组件
 *
 *          注意事项：
 *          - 初始化状态为 undefined，防止服务端渲染与客户端不一致
 *          - 使用 matchMedia API 进行高效的媒体查询监听
 *          - 组件卸载时自动清理事件监听器
 */

import * as React from "react"

/**
 * 定义移动端和桌面端视图边界的断点宽度（像素）
 * 视口宽度低于此值被视为移动端
 */
const MOBILE_BREAKPOINT = 768

/**
 * 检测当前视口是否为移动端大小的 React Hook
 * 使用CSS媒体查询和窗口大小事件进行实时检测
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

/**
 * @fileoverview 布局配置文件，统一管理应用程序的布局参数
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了应用程序的布局配置常量，用于统一管理 UI 组件的尺寸和样式参数。
 *          主要功能包括：
 *          - 侧边栏配置（宽度、最小/最大宽度、过渡动画）
 *          - 输入区域配置（最小/最大高度、默认高度）
 *          - 消息列表配置（最小/最大高度）
 *          - 头部导航栏配置（高度、按钮尺寸、内边距）
 *          - 响应式断点配置（移动端、平板、桌面等）
 *          - 动画配置（快速、标准、慢速动画时长及弹簧参数）
 *          - 间距配置（从极小到超大的间距层级）
 *          - 圆角配置（从小到完全圆角）
 *
 *          使用场景：
 *          - 在组件中使用统一的布局尺寸
 *          - 实现响应式设计时使用断点配置
 *          - 应用动画效果时使用动画配置
 *          - 保持设计系统的一致性
 *          - 在 Tailwind CSS 中使用这些配置值
 *
 *          配置说明：
 *          - 所有配置使用 as const 确保类型安全
 *          - 尺寸使用 rem 单位以支持响应式缩放
 *          - 动画时长以毫秒为单位
 *          - 响应式断点基于常用设备尺寸
 *
 *          依赖关系：
 *          - 被应用程序 UI 组件引用
 *          - 用于保持设计系统一致性
 */

/**
 * 侧边栏配置
 */
export const SIDEBAR_CONFIG = {
  /**
   * 侧边栏宽度
   */
  width: '20rem',
  /**
   * 移动端侧边栏宽度
   */
  widthMobile: '18rem',
  /**
   * 侧边栏最小宽度
   */
  minWidth: '16rem',
  /**
   * 侧边栏最大宽度
   */
  maxWidth: '24rem',
  /**
   * 侧边栏过渡动画时长（毫秒）
   */
  transitionDuration: 300,
} as const

/**
 * 输入区域配置
 */
export const INPUT_CONFIG = {
  /**
   * 输入区域最小高度（像素）
   */
  minHeight: 100,
  /**
   * 输入区域最大高度（视口高度的百分比）
   */
  maxHeightPercent: 75,
  /**
   * 输入区域默认高度（像素）
   */
  defaultHeight: 150,
} as const

/**
 * 消息列表配置
 */
export const MESSAGE_LIST_CONFIG = {
  /**
   * 消息列表最小高度（像素）
   */
  minHeight: 200,
  /**
   * 消息列表最大高度（视口高度的百分比）
   */
  maxHeightPercent: 100,
} as const

/**
 * 头部导航栏配置
 */
export const HEADER_CONFIG = {
  /**
   * 头部高度
   */
  height: '3.5rem',
  /**
   * 头部按钮尺寸
   */
  buttonSize: '2rem',
  /**
   * 头部内边距
   */
  padding: '1.25rem',
} as const

/**
 * 响应式断点配置
 */
export const BREAKPOINTS = {
  /**
   * 移动端断点
   */
  mobile: '480px',
  /**
   * 平板端断点
   */
  tablet: '768px',
  /**
   * 小屏幕桌面端断点
   */
  desktop: '1024px',
  /**
   * 大屏幕桌面端断点
   */
  largeDesktop: '1280px',
  /**
   * 超大屏幕断点
   */
  extraLarge: '1536px',
} as const

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  /**
   * 快速动画时长（毫秒）
   */
  fast: 150,
  /**
   * 标准动画时长（毫秒）
   */
  normal: 200,
  /**
   * 慢速动画时长（毫秒）
   */
  slow: 300,
  /**
   * 弹簧动画配置
   */
  spring: {
    /**
     * 弹簧刚度
     */
    stiffness: 700,
    /**
     * 弹簧阻尼
     */
    damping: 30,
  },
} as const

/**
 * 间距配置
 */
export const SPACING_CONFIG = {
  /**
   * 极小间距
   */
  xs: '0.25rem',
  /**
   * 小间距
   */
  sm: '0.5rem',
  /**
   * 标准间距
   */
  md: '1rem',
  /**
   * 中等间距
   */
  lg: '1.5rem',
  /**
   * 大间距
   */
  xl: '2rem',
  /**
   * 超大间距
   */
  '2xl': '3rem',
} as const

/**
 * 圆角配置
 */
export const RADIUS_CONFIG = {
  /**
   * 小圆角
   */
  sm: '0.375rem',
  /**
   * 标准圆角
   */
  md: '0.5rem',
  /**
   * 中等圆角
   */
  lg: '0.75rem',
  /**
   * 大圆角
   */
  xl: '1rem',
  /**
   * 超大圆角
   */
  '2xl': '1.5rem',
  /**
   * 完全圆角
   */
  full: '9999px',
} as const
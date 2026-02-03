/**
 * @fileoverview 令牌概率显示组件，展示语言模型输出的令牌概率分布和备选令牌
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了令牌概率显示组件，展示语言模型输出的令牌概率分布和备选令牌。
 *
 *          主要功能包括：
 *          - 令牌概率显示
 *          - 备选令牌列表
 *          - 概率条形图
 *          - 颜色编码显示
 *          - 弹出框详情查看
 *
 *          导出组件：
 *          - TokenProbabilities: 令牌概率主组件
 *          - TokenPopover: 令牌弹出框组件
 *
 *          使用场景：
 *          - 模型输出分析
 *          - 令牌概率可视化
 *          - 模型调试和优化
 *
 *          依赖关系：
 *          - @/components/ui/popover: 弹出框组件
 *          - next-intl: 国际化支持
 */

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslations } from 'next-intl'
import { memo } from 'react'

// 软背景颜色数组
const TOKEN_COLORS = [
  'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/30',
  'bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-900/30',
  'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/30',
  'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/30',
  'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/30',
  'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/30',
  'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/30',
  'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-900/30',
]

/**
 * 顶级概率令牌接口
 */
interface TopLogprob {
  token: string
  logprob: number
}

/**
 * 令牌概率接口
 */
interface TokenLogprob {
  token: string
  logprob: number
  topLogprobs: TopLogprob[]
}

/**
 * 令牌概率组件属性接口
 */
interface TokenProbabilitiesProps {
  logprobs: TokenLogprob[]
}

/**
 * 令牌弹出框组件属性接口
 */
interface TokenPopoverProps extends TokenLogprob {
  /** 颜色索引 */
  colorIndex: number
}

/**
 * 令牌弹出框组件
 * 显示令牌的详细概率信息和备选令牌
 */
const TokenPopover = memo(function TokenPopover({
  token,
  logprob,
  topLogprobs,
  colorIndex,
}: TokenPopoverProps) {
  // 获取国际化翻译函数
  const t = useTranslations('playground')
  // 根据索引获取对应的颜色类
  const colorClass = TOKEN_COLORS[colorIndex % TOKEN_COLORS.length]
  // 计算概率百分比
  const probability = Math.exp(logprob) * 100
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* 可点击的令牌显示 */}
        <span className={`cursor-pointer rounded px-1 py-0.5 font-mono transition-colors ${colorClass}`}>
          {token}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="start" sideOffset={8}>
        <div className="space-y-3">
          {/* 当前令牌 */}
          <div>
            <div className="mb-1.5 text-sm font-medium text-foreground/80">
              {t('message.currentToken')}
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5">
              <span className="font-mono">{token}</span>
              <div className="flex items-center gap-1.5">
                {/* 概率条形图 */}
                <div className="h-2 rounded bg-primary" style={{ width: `${Math.min(probability, 100)}px` }} />
                <span className="text-sm text-muted-foreground">
                  {probability.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* 备选令牌 */}
          {topLogprobs.length > 1 && (
            <div>
              <div className="mb-1.5 text-sm font-medium text-foreground/80">
                {t('message.alternativeTokens')}
              </div>
              <div className="space-y-1">
                {topLogprobs
                  .filter((top) => top.token !== token)
                  .map((top, index) => {
                    const altProbability = Math.exp(top.logprob) * 100
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-muted/50"
                      >
                        <span className="font-mono">{top.token}</span>
                        <div className="flex items-center gap-1.5">
                          {/* 备选令牌概率条形图 */}
                          <div 
                            className="h-2 rounded bg-primary/40" 
                            style={{ width: `${Math.min(altProbability, 100)}px` }} 
                          />
                          <span className="text-sm text-muted-foreground">
                            {altProbability.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
})

/**
 * 令牌概率组件
 * 渲染令牌列表，每个令牌可点击查看详细概率信息
 */
export const TokenProbabilities = memo(function TokenProbabilities({
  logprobs,
}: TokenProbabilitiesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {logprobs.map((item, index) => (
        <TokenPopover 
          key={index}
          token={item.token}
          logprob={item.logprob}
          topLogprobs={item.topLogprobs}
          colorIndex={index}
        />
      ))}
    </div>
  )
}) 
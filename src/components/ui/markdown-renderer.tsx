/**
 * @fileoverview 高级Markdown渲染器组件，支持数学方程、Mermaid图表、代码高亮
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了高级Markdown渲染器组件，支持多种格式和功能。
 *
 *          主要功能包括：
 *          - GitHub风格Markdown渲染
 *          - 数学方程渲染（KaTeX）
 *          - Mermaid图表渲染
 *          - 代码语法高亮（Shiki）
 *          - 复制按钮功能
 *          - 语法高亮支持
 *
 *          导出组件：
 *          - MarkdownRenderer: 主Markdown渲染器
 *          - default: 默认导出
 *
 *          支持功能：
 *          - 行内和块级数学公式
 *          - 流程图、序列图、状态图等
 *          - 多语言代码高亮
 *          - 复制代码和公式
 *          - 自定义样式
 *
 *          使用场景：
 *          - 聊天消息渲染
 *          - 文档展示
 *          - 代码展示
 *          - 数学公式渲染
 */

'use client'
import 'katex/dist/katex.min.css'
import mermaid from 'mermaid'
import React, { Suspense, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { visit } from 'unist-util-visit'

import { CopyButton } from '@/components/ui/copy-button'
import { cn } from '@/utils/tailwindcss'
import { useTranslations } from 'next-intl'

import type { Components } from 'react-markdown'

/**
 * KaTeX数学渲染配置选项
 * @const
 */
const katexOptions = {
  strict: false,
  trust: true,
  throwOnError: false,
  macros: {
    '\\f': 'f(#1)',
    '\\RR': '\\mathbb{R}',
    '\\NN': '\\mathbb{N}',
    '\\ZZ': '\\mathbb{Z}',
    '\\CC': '\\mathbb{C}',
    '\\QQ': '\\mathbb{Q}',
  },
  fleqn: false,
  leqno: false,
  output: 'html',
  displayMode: true,
  errorColor: '#cc0000',
  minRuleThickness: 0.05,
  maxSize: Infinity,
  maxExpand: 1000,
  globalGroup: true,
  allowedEnvironments: [
    'matrix',
    'pmatrix',
    'bmatrix',
    'Bmatrix',
    'vmatrix',
    'Vmatrix',
    'equation',
    'equation*',
    'align',
    'align*',
    'gather',
    'gather*',
    'cases',
  ],
}

/**
 * MarkdownRenderer组件的属性接口
 * @interface MarkdownRendererProps
 * @property {string} children - 要渲染的Markdown内容
 */
interface MarkdownRendererProps {
  children: string
}

/**
 * 数学方程式包装器组件
 * 为数学内容提供错误边界和样式
 * @component
 */
const MathWrapper = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('playground')
  const ref = React.useRef<HTMLSpanElement>(null)
  const [latex, setLatex] = useState('')
  const [isDisplay, setIsDisplay] = useState(false)

  useEffect(() => {
    if (ref.current) {
      const annotation = ref.current.querySelector('.katex-mathml annotation')
      if (annotation) {
        setLatex(annotation.textContent || '')
      }
      // Check if it's a display equation
      setIsDisplay(!!ref.current.closest('.katex-display'))
    }
  }, [])

  return (
    <span
      ref={ref}
      className={cn(
        'group/math relative',
        isDisplay ? 'block' : 'inline-block'
      )}
    >
      {children}
      {latex && (
        <span
          className={cn(
            'invisible absolute flex space-x-1 rounded-lg bg-background/50 opacity-0 transition-all duration-200 group-hover/math:visible group-hover/math:opacity-100',
            isDisplay ? 'right-0 top-0' : '-top-6 left-1/2 -translate-x-1/2'
          )}
        >
          <CopyButton content={latex} copyMessage={t('copiedSuccess')} />
        </span>
      )}
    </span>
  )
}

/**
 * Mermaid图表包装器组件
 * 处理图表渲染和错误状态
 * @component
 */
const MermaidWrapper = ({ children }: { children: string }) => {
  const elementRef = React.useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const t = useTranslations('playground')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      renderDiagram()
    }, 300)

    async function renderDiagram() {
      if (!children.trim()) return

      try {
        const isValid = await mermaid.parse(children)
        if (!isValid) return

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
        })

        const { svg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          children
        )
        setSvg(svg)
        setError('')
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
        setSvg('')
      }
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [children])

  if (!svg && !error) {
    return (
      <div ref={elementRef} className='text-muted-foreground'>
        {t('generatingDiagram')}
      </div>
    )
  }

  if (error) {
    const isIncomplete =
      error.includes('Syntax error') || error.includes('Invalid')
    return (
      <div ref={elementRef} className='text-muted-foreground'>
        {isIncomplete ? t('waitingForDiagram') : t('diagramSyntaxError')}
      </div>
    )
  }

  return (
    <div className='group/mermaid relative my-4'>
      <div
        ref={elementRef}
        className='flex justify-center overflow-x-auto'
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className='invisible absolute right-2 top-2 flex space-x-1 rounded-lg bg-background/50 p-1 opacity-0 transition-all duration-200 group-hover/mermaid:visible group-hover/mermaid:opacity-100'>
        <CopyButton content={children} copyMessage={t('copiedSuccess')} />
      </div>
    </div>
  )
}

/**
 * 用于语法高亮的自定义remark插件
 * 处理代码块并添加语言信息
 */
function remarkHighlight() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      const matches = Array.from(
        node.value.matchAll(/==(.*?)==/g)
      ) as Array<RegExpMatchArray>
      if (!matches.length) return

      const children = []
      let lastIndex = 0

      matches.forEach((match: RegExpMatchArray) => {
        const beforeText = node.value.slice(lastIndex, match.index)
        if (beforeText) {
          children.push({ type: 'text', value: beforeText })
        }

        children.push({
          type: 'highlight',
          data: { hName: 'mark' },
          children: [{ type: 'text', value: match[1] }],
        })

        lastIndex = (match.index ?? 0) + match[0].length
      })

      const afterText = node.value.slice(lastIndex)
      if (afterText) {
        children.push({ type: 'text', value: afterText })
      }

      parent.children.splice(index, 1, ...children)
    })
  }
}

/**
 * 主Markdown渲染器组件
 * 配置和组合各种Markdown插件和渲染器
 * @component
 * @param {MarkdownRendererProps} props - 组件属性
 */
export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const components: Components = {
    ...COMPONENTS,
    span: ({
      className,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      node,
      ...props
    }) => {
      // Only handle katex class, whether it's a block or inline
      if (className === 'katex') {
        return (
          <MathWrapper>
            <span className={className} {...props} />
          </MathWrapper>
        )
      }

      return <span className={className} {...props} />
    },
  }

  return (
    <div className='space-y-3'>
      <Markdown
        remarkPlugins={[
          remarkGfm,
          remarkHighlight,
          [remarkMath, { singleDollar: true, doubleBackslash: true }],
        ]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              ...katexOptions,
              output: 'htmlAndMathml',
              trust: true,
              strict: false,
              throwOnError: false,
            },
          ],
        ]}
        components={components}
      >
        {children}
      </Markdown>
    </div>
  )
}

/**
 * Props interface for syntax-highlighted pre elements
 * @interface HighlightedPre
 */
interface HighlightedPre extends React.HTMLAttributes<HTMLPreElement> {
  children: string
  language: string
}

/**
 * 语法高亮代码块的记忆化组件
 * 使用基于web worker的高亮以提高性能
 * @component
 */
const HighlightedPre = React.memo(
  ({ children, language, ...props }: HighlightedPre) => {
    const [tokens, setTokens] = useState<any[]>([])

    useEffect(() => {
      async function highlightCode() {
        const { codeToTokens, bundledLanguages } = await import('shiki')

        if (!(language in bundledLanguages)) {
          return
        }

        const result = await codeToTokens(children, {
          lang: language as keyof typeof bundledLanguages,
          defaultColor: false,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        })

        setTokens(result.tokens)
      }

      highlightCode()
    }, [children, language])

    if (!tokens.length) {
      return <pre {...props}>{children}</pre>
    }

    return (
      <pre {...props}>
        <code>
          {tokens.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              <span>
                {line.map((token: any, tokenIndex: number) => {
                  const style =
                    typeof token.htmlStyle === 'string'
                      ? undefined
                      : token.htmlStyle

                  return (
                    <span
                      key={tokenIndex}
                      className='bg-shiki-light-bg text-shiki-light dark:bg-shiki-dark-bg dark:text-shiki-dark'
                      style={style}
                    >
                      {token.content}
                    </span>
                  )
                })}
              </span>
              {lineIndex !== tokens.length - 1 && '\n'}
            </React.Fragment>
          ))}
        </code>
      </pre>
    )
  }
)
HighlightedPre.displayName = 'HighlightedCode'

/**
 * Props interface for code block components
 * @interface CodeBlockProps
 */
interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode
  className?: string
  language: string
}

/**
 * 带复制功能的代码块组件
 * @component
 */
const CodeBlock = ({
  children,
  className,
  language,
  ...restProps
}: CodeBlockProps) => {
  const t = useTranslations('playground')
  const code =
    typeof children === 'string'
      ? children
      : childrenTakeAllStringContents(children)

  if (language === 'mermaid') {
    return <MermaidWrapper>{code}</MermaidWrapper>
  }

  const preClass = cn(
    'overflow-x-scroll rounded-md border bg-background/50 p-4 font-mono text-sm [scrollbar-width:none]',
    className
  )

  return (
    <div className='group/code relative mb-4'>
      <Suspense
        fallback={
          <pre className={preClass} {...restProps}>
            {children}
          </pre>
        }
      >
        <HighlightedPre language={language} className={preClass}>
          {code}
        </HighlightedPre>
      </Suspense>

      <div className='invisible absolute right-2 top-2 flex space-x-1 rounded-lg p-1 opacity-0 transition-all duration-200 group-hover/code:visible group-hover/code:opacity-100'>
        <CopyButton content={code} copyMessage={t('copiedSuccess')} />
      </div>
    </div>
  )
}

/**
 * 从子元素中提取所有字符串内容的工具函数
 * @param {any} element - 要处理的React元素
 * @returns {string} 连接的字符串内容
 */
function childrenTakeAllStringContents(element: any): string {
  if (typeof element === 'string') {
    return element
  }

  if (element?.props?.children) {
    const children = element.props.children

    if (Array.isArray(children)) {
      return children
        .map((child) => childrenTakeAllStringContents(child))
        .join('')
    } else {
      return childrenTakeAllStringContents(children)
    }
  }

  return ''
}

/**
 * Markdown渲染的自定义组件
 * 提供具有适当可访问性的样式化HTML元素
 * @const
 */
const COMPONENTS = {
  h1: withClass('h1', 'text-2xl font-semibold'),
  h2: withClass('h2', 'font-semibold text-xl'),
  h3: withClass('h3', 'font-semibold text-lg'),
  h4: withClass('h4', 'font-semibold text-base'),
  h5: withClass('h5', 'font-medium'),
  strong: withClass('strong', 'font-semibold'),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className='text-primary underline underline-offset-2'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    />
  ),
  blockquote: withClass('blockquote', 'border-l-2 border-primary pl-4'),
  code: ({ children, className, ...rest }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <CodeBlock className={className} language={match[1]} {...rest}>
        {children}
      </CodeBlock>
    ) : (
      <code
        className={cn(
          'font-mono [:not(pre)>&]:rounded-md [:not(pre)>&]:bg-background/50 [:not(pre)>&]:px-1 [:not(pre)>&]:py-0.5'
        )}
        {...rest}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }: any) => children,
  ol: withClass('ol', 'list-decimal space-y-2 pl-6'),
  ul: withClass('ul', 'list-disc space-y-2 pl-6'),
  li: withClass('li', 'my-1.5'),
  table: withClass(
    'table',
    'w-full border-collapse overflow-y-auto rounded-md border border-foreground/20'
  ),
  th: withClass(
    'th',
    'border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right'
  ),
  td: withClass(
    'td',
    'border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right'
  ),
  tr: withClass('tr', 'm-0 border-t p-0 even:bg-muted'),
  p: withClass(
    'p',
    'whitespace-pre-wrap [&_.katex]:leading-tight [&_.katex-display]:leading-tight [&_.katex]:subpixel-antialiased [&_.katex-display]:subpixel-antialiased'
  ),
  hr: withClass('hr', 'border-foreground/20'),
  mark: withClass('mark', 'bg-yellow-200 dark:bg-yellow-800 rounded px-1'),
}

/**
 * 为元素添加className的高阶组件
 * @param {keyof JSX.IntrinsicElements} Tag - HTML元素标签
 * @param {string} classes - 要应用的CSS类
 */
function withClass(Tag: keyof JSX.IntrinsicElements, classes: string) {
  const Component = ({ ...props }: any) => (
    <Tag className={classes} {...props} />
  )
  Component.displayName = Tag
  return Component
}

export default MarkdownRenderer

/**
 * @fileoverview 设置侧边栏组件，提供 AI 模型配置和应用程序设置
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 处理应用程序的设置界面，包括模型选择、参数调整和语言切换
 */

'use client'

import { ModeSwitcher } from '@/components/mode-switcher'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { TooltipHelpIcon } from '@/components/ui/tooltip-help-icon'
import { cn } from '@/utils/tailwindcss'
import { Check, RotateCcw } from 'lucide-react'
import { marked } from 'marked'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { GLOBAL } from '@/constants/values'
import { startTransition } from 'react'
import { useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'

/**
 * 设置侧边栏组件的属性接口
 * @interface SettingsSidebarProps
 * @property {Object} settings - 当前设置对象
 * @property {string} [settings.model] - AI 模型标识符
 * @property {string} [settings.provider] - 服务提供商
 * @property {string} [settings.modelProvider] - 模型提供商
 * @property {boolean} [settings.streamMode] - 是否使用流式响应
 * @property {number} settings.temperature - 温度参数
 * @property {number} settings.topP - Top P 参数
 * @property {number} settings.frequencyPenalty - 频率惩罚参数
 * @property {number} settings.presencePenalty - 存在惩罚参数
 * @property {number} settings.maxTokens - 最大令牌数
 * @property {string} settings.apiKey - API 密钥
 * @property {'expert'|'beginner'} uiMode - 用户界面模式
 * @property {Array<{id: string, provider: string}>} models - 可用模型列表
 * @property {Function} onSettingsChange - 设置变更回调函数
 * @property {Function} onUiModeChange - UI 模式变更回调函数
 * @property {Function} onResetSettings - 重置设置回调函数
 */
interface SettingsSidebarProps {
  settings: {
    model?: string
    provider?: string
    modelProvider?: string
    streamMode?: boolean
    temperature: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    maxTokens: number
    apiKey: string
  }
  uiMode: 'expert' | 'beginner'
  models: Array<{ id: string; provider: string }>
  onSettingsChange: (settings: any) => void
  onUiModeChange: (value: boolean) => void
  onResetSettings: () => void
}

/**
 * 设置侧边栏组件，提供 AI 模型配置和应用程序设置界面
 * 
 * @function SettingsSidebar
 * @param {SettingsSidebarProps} props - 组件属性
 * @returns {JSX.Element} 渲染的设置侧边栏组件
 */
export function SettingsSidebar({
  settings,
  uiMode,
  models,
  onSettingsChange,
  onUiModeChange,
  onResetSettings,
}: SettingsSidebarProps) {
  // 获取国际化翻译函数
  const t = useTranslations('playground')
  // API 密钥描述的本地状态
  const [apiKeyDesc, setApiKeyDesc] = useState('')
  // 路由器实例，用于页面导航
  const router = useRouter()
  // 当前路由参数
  const params = useParams()
  // 当前路径名
  const pathname = '/'
  // 从 API 获取的所有模型列表
  const [allModels, setAllModels] = useState<Array<{ id: string; provider: string }>>([])
  // 可用的 Model Providers 列表
  const [modelProviders, setModelProviders] = useState<string[]>(['OpenAI'])
  // 是否正在加载模型列表
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  // 当 Service Provider 改变时，获取所有模型列表
  useEffect(() => {
    const fetchModels = async () => {
      if (settings.provider) {
        setIsLoadingModels(true)
        try {
          const response = await fetch('/api/models', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: settings.provider,
              apiKey: settings.apiKey,
              action: 'fetchAll',
            }),
          })

          if (response.ok) {
            const data = await response.json()
            // 确保数据是纯对象数组
            const models = (data.models || []).map((model: any) => ({
              id: String(model.id),
              provider: String(model.provider),
            }))
            setAllModels(models)

            // 提取 Model Providers
            const providers = extractProvidersFromModels(models)
            setModelProviders(providers)

            // 如果当前选择的 Model Provider 不在列表中，重置为第一个
            if (settings.modelProvider && !providers.includes(settings.modelProvider)) {
              onSettingsChange({
                ...settings,
                modelProvider: providers[0],
                model: undefined,
              })
            }
          }
        } catch (error) {
          console.error('Failed to fetch models:', error)
          setAllModels([])
          setModelProviders([])
        } finally {
          setIsLoadingModels(false)
        }
      }
    }

    fetchModels()
  }, [settings.provider, settings.apiKey])

  // 从模型列表中提取 Model Providers
  const extractProvidersFromModels = (models: Array<{ id: string; provider: string }>) => {
    const providers = new Set<string>()
    for (const model of models) {
      if (model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')) {
        providers.add('OpenAI')
      } else if (model.id.startsWith('claude')) {
        providers.add('Anthropic')
      } else if (model.id.startsWith('gemini')) {
        providers.add('Google')
      } else {
        providers.add('OpenAI')
      }
    }
    return Array.from(providers)
  }

  // 过滤选中的 Model Provider 的模型
  const filteredModels = allModels.filter((model) => {
    if (!settings.modelProvider) return true
    if (settings.modelProvider === 'OpenAI') {
      return model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('o3') || model.id.startsWith('o4')
    } else if (settings.modelProvider === 'Anthropic') {
      return model.id.startsWith('claude')
    } else if (settings.modelProvider === 'Google') {
      return model.id.startsWith('gemini')
    }
    return true
  })

  // 处理 API 密钥描述的 markdown 渲染
  useEffect(() => {
    const result = marked(t('settings.apiKeyDesc'))
    if (result instanceof Promise) {
      result.then(setApiKeyDesc)
    } else {
      setApiKeyDesc(result)
    }
  }, [t])

  return (
    <Sidebar side='right'>
      <SidebarHeader className='px-4 py-3 border-b border-border/40 bg-gradient-to-b from-background to-muted/20'>
        <div className='mb-1 flex items-center justify-between'>
          <h2 className='text-base font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            {t('settings.title')}
          </h2>
          <TooltipButton
            variant='ghost'
            size='icon'
            onClick={onResetSettings}
            className='h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200'
            tooltipContent={t('settings.resetSettingsDesc')}
          >
            <RotateCcw className='h-3.5 w-3.5' />
          </TooltipButton>
        </div>
      </SidebarHeader>
      <SidebarContent className='px-4 py-3'>
        <SidebarGroup>
          <SidebarGroupLabel className='px-0 mb-3 text-xs font-semibold text-foreground/80'>
            {t('settings.basicConfig')}
          </SidebarGroupLabel>
          <SidebarGroupContent className='space-y-4'>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center gap-1 mb-1.5'>
                  <Label className='text-xs font-medium text-foreground'>
                    Service Provider
                  </Label>
                  <TooltipHelpIcon content='选择服务提供商' />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      className='w-full justify-between border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors rounded-md h-9 text-xs'
                    >
                      {settings.provider || '302AI'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0 rounded-md shadow-md border border-border/40' side='bottom' align='start'>
                    <Command className='w-full'>
                      <div
                        className='max-h-[300px] touch-pan-y overflow-hidden'
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <CommandList className='max-h-[300px] overflow-y-auto'>
                          <CommandGroup>
                            <CommandItem
                              value='302AI'
                              onSelect={() => {
                                onSettingsChange({
                                  ...settings,
                                  provider: '302AI',
                                  modelProvider: undefined,
                                  model: undefined
                                })
                              }}
                              className='px-2.5 py-1.5 rounded-md hover:bg-muted/50 text-xs'
                            >
                              <Check
                                className={cn(
                                  'mr-1.5 h-3.5 w-3.5',
                                  settings.provider === '302AI'
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              302AI
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <div className='flex items-center gap-1 mb-1.5'>
                  <Label className='text-xs font-medium text-foreground'>
                    Model Provider
                  </Label>
                  <TooltipHelpIcon content='选择模型提供商以过滤可用模型' />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      disabled={!settings.provider || isLoadingModels}
                      className='w-full justify-between border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors rounded-md h-9 text-xs'
                    >
                      {isLoadingModels ? '加载中...' : (settings.modelProvider || '请先选择 Service Provider')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0 rounded-md shadow-md border border-border/40' side='bottom' align='start'>
                    <Command className='w-full'>
                      <div
                        className='max-h-[300px] touch-pan-y overflow-hidden'
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <CommandList className='max-h-[300px] overflow-y-auto'>
                          <CommandGroup>
                            {modelProviders.length > 0 ? (
                              modelProviders.map((provider) => (
                                <CommandItem
                                  key={provider}
                                  value={provider}
                                  onSelect={() => {
                                    onSettingsChange({
                                      ...settings,
                                      modelProvider: provider,
                                      model: undefined
                                    })
                                  }}
                                  className='px-2.5 py-1.5 rounded-md hover:bg-muted/50 text-xs'
                                >
                                  <Check
                                    className={cn(
                                      'mr-1.5 h-3.5 w-3.5',
                                      settings.modelProvider === provider
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {provider}
                                </CommandItem>
                              ))
                            ) : (
                              <div className='py-6 text-center text-xs text-muted-foreground'>
                                {isLoadingModels ? '加载中...' : '请先选择 Service Provider'}
                              </div>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <div className='flex items-center gap-1 mb-1.5'>
                  <Label className='text-xs font-medium text-foreground'>
                    {t('settings.model')}
                  </Label>
                  <TooltipHelpIcon content={t('settings.modelDesc')} />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      disabled={!settings.modelProvider || isLoadingModels}
                      className='w-full justify-between border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors rounded-md h-9 text-xs'
                    >
                      {isLoadingModels ? '加载中...' : (settings.model || (settings.modelProvider ? t('settings.selectModelPlaceholder') : '请先选择 Model Provider'))}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0 rounded-md shadow-md border border-border/40' side='bottom' align='start'>
                    <Command className='w-full'>
                      <CommandInput
                        placeholder={t('settings.searchModelPlaceholder')}
                        className='px-2.5 py-1.5 text-xs'
                      />
                      <div
                        className='max-h-[300px] touch-pan-y overflow-hidden'
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <CommandList className='max-h-[calc(300px-40px)] overflow-y-auto'>
                          <CommandEmpty className='px-2.5 py-1.5 text-xs'>
                            {t('settings.noModelFound')}
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredModels.length > 0 ? (
                              filteredModels.map((model) => (
                                <CommandItem
                                  key={model.id}
                                  value={model.id}
                                  onSelect={() => {
                                    onSettingsChange({ ...settings, model: model.id })
                                  }}
                                  className='px-2.5 py-1.5 rounded-md hover:bg-muted/50 text-xs'
                                >
                                  <Check
                                    className={cn(
                                      'mr-1.5 h-3.5 w-3.5',
                                      settings.model === model.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {model.id}
                                </CommandItem>
                              ))
                            ) : (
                              <div className='py-6 text-center text-xs text-muted-foreground'>
                                {isLoadingModels ? '加载中...' : (settings.modelProvider ? t('settings.noModelFound') : '请先选择 Model Provider')}
                              </div>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <div className='flex items-center gap-1'>
                    <Label className='text-xs font-medium text-foreground'>
                      Stream Mode
                    </Label>
                    <TooltipHelpIcon content='启用流式响应以实时显示生成内容' />
                  </div>
                  <Switch
                    checked={settings.streamMode ?? true}
                    onCheckedChange={(checked) =>
                      onSettingsChange({ ...settings, streamMode: checked })
                    }
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <div className='flex items-center gap-1'>
                    <Label className='text-xs font-medium text-foreground'>
                      {t('settings.temperature')}
                    </Label>
                    <TooltipHelpIcon content={t('settings.temperatureDesc')} />
                  </div>
                  <span className='text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md'>
                    {settings.temperature}
                  </span>
                </div>
                <Slider
                  className='mt-1.5'
                  value={[settings.temperature]}
                  max={1}
                  min={0}
                  step={0.1}
                  onValueChange={(value) =>
                    onSettingsChange({ ...settings, temperature: value[0] })
                  }
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <div className='flex items-center gap-1'>
                    <Label className='text-xs font-medium text-foreground'>Top P</Label>
                    <TooltipHelpIcon content={t('settings.topPDesc')} />
                  </div>
                  <span className='text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md'>
                    {settings.topP}
                  </span>
                </div>
                <Slider
                  className='mt-1.5'
                  value={[settings.topP]}
                  max={1}
                  min={0}
                  step={0.1}
                  onValueChange={(value) =>
                    onSettingsChange({ ...settings, topP: value[0] })
                  }
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <div className='flex items-center gap-1'>
                    <Label className='text-xs font-medium text-foreground'>
                      {t('settings.frequencyPenalty')}
                    </Label>
                    <TooltipHelpIcon content={t('settings.frequencyPenaltyDesc')} />
                  </div>
                  <span className='text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md'>
                    {settings.frequencyPenalty}
                  </span>
                </div>
                <Slider
                  className='mt-1.5'
                  value={[settings.frequencyPenalty]}
                  max={2}
                  min={-2}
                  step={0.1}
                  onValueChange={(value) =>
                    onSettingsChange({
                      ...settings,
                      frequencyPenalty: value[0],
                    })
                  }
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <div className='flex items-center gap-1'>
                    <Label className='text-xs font-medium text-foreground'>
                      {t('settings.presencePenalty')}
                    </Label>
                    <TooltipHelpIcon content={t('settings.presencePenaltyDesc')} />
                  </div>
                  <span className='text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md'>
                    {settings.presencePenalty}
                  </span>
                </div>
                <Slider
                  className='mt-1.5'
                  value={[settings.presencePenalty]}
                  max={2}
                  min={-2}
                  step={0.1}
                  onValueChange={(value) =>
                    onSettingsChange({
                      ...settings,
                      presencePenalty: value[0],
                    })
                  }
                />
              </div>

              <div>
                <div className='flex items-center gap-1 mb-1.5'>
                  <Label className='text-xs font-medium text-foreground'>
                    {t('settings.maxTokens')}
                  </Label>
                  <TooltipHelpIcon content={t('settings.maxTokensDesc')} />
                </div>
                <div className='flex items-center justify-between'>
                  <Input
                    type='number'
                    min={1}
                    value={settings.maxTokens}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        maxTokens: Number(e.target.value),
                      })
                    }
                    placeholder={t('settings.maxTokensPlaceholder')}
                    className='border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors rounded-md h-9 text-xs'
                  />
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className='px-0 mb-3 text-xs font-semibold text-foreground/80'>
            <div className='flex items-center gap-1'>
              {t('settings.apiKey')}
              <TooltipHelpIcon
                content={
                  <div
                    className='prose prose-sm prose-invert max-w-none'
                    dangerouslySetInnerHTML={{ __html: apiKeyDesc }}
                  />
                }
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Input
              placeholder={t('settings.apiKeyPlaceholder')}
              type='password'
              value={settings.apiKey}
              onChange={(e) =>
                onSettingsChange({ ...settings, apiKey: e.target.value })
              }
              className='border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors rounded-md h-9 text-xs'
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className='px-0 mb-3 text-xs font-semibold text-foreground/80'>
            <div className='flex items-center gap-1'>
              {t('settings.mode')}
              {uiMode === 'expert' && (
                <TooltipHelpIcon
                  content={t('settings.expertModeDeviceNote')}
                  className='h-3.5 w-3.5 text-amber-500'
                />
              )}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ModeSwitcher
              className='w-full'
              value={uiMode === 'expert'}
              onChange={onUiModeChange}
              beginnerText={t('settings.beginnerMode')}
              expertText={t('settings.expertMode')}
            />
            <p className='mt-1.5 text-xs text-muted-foreground'>
              {uiMode === 'expert'
                ? t('settings.expertModeDesc')
                : t('settings.beginnerModeDesc')}
            </p>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className='px-0 mb-3 text-xs font-semibold text-foreground/80'>
            <div className='flex items-center gap-1'>
              {t('settings.language')}
              <TooltipHelpIcon content={t('settings.languageTooltip')} />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Select
              value={params.locale as string}
              onValueChange={(nextLocale) => {
                startTransition(() => {
                  router.replace(
                    // @ts-expect-error -- TypeScript 会验证只有已知的 `params`
                    // 与给定的 `pathname` 结合使用。由于两者始终
                    // 匹配当前路由，我们可以跳过运行时检查。
                    { pathname, params },
                    { locale: nextLocale }
                  )
                })
              }}
            >
              <SelectTrigger className='w-full border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors rounded-md h-9 text-xs'>
                <SelectValue placeholder={t('settings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {GLOBAL.LOCALE.SUPPORTED.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    {t(`settings.languages.${locale}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

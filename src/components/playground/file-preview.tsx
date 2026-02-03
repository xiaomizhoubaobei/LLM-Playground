/**
 * @fileoverview 文件预览组件，支持图片和文件的预览、删除和灯箱查看功能
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 *
 * @remark 本模块提供了文件预览组件，支持图片和文件的预览、删除和灯箱查看功能。
 *
 *          主要功能包括：
 *          - 图片预览和灯箱查看
 *          - 文件预览和工具提示
 *          - 文件删除功能
 *          - 图片缩略图显示
 *          - 文件大小显示
 *          - 文件名显示
 *
 *          导出组件：
 *          - FilePreview: 文件预览组件
 *
 *          使用场景：
 *          - 聊天消息中的文件附件
 *          - 图片灯箱查看
 *          - 文件管理
 *          - 多文件上传预览
 *
 *          依赖关系：
 *          - yet-another-react-lightbox: 图片灯箱组件
 *          - lucide-react: 图标库
 *          - next/image: Next.js 图片组件
 */

import { cn } from '@/utils/tailwindcss'
import { FileIcon, X, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

/**
 * 文件预览组件的属性接口
 */
interface FilePreviewProps {
  files: {
    url: string
    type: 'image' | 'file'
    name: string
    size: number
  }[]
  canDelete?: boolean
  onDelete?: (index: number) => void
  className?: string
}

/**
 * 文件预览组件
 * 支持图片和文件的预览，包括缩略图显示、删除功能和图片灯箱查看
 */
export function FilePreview({ files, canDelete, onDelete, className }: FilePreviewProps) {
  // 当前选中的图片URL，用于灯箱显示
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // 如果没有文件，不渲染组件
  if (!files?.length) return null

  // 过滤出图片文件并转换为灯箱所需的格式
  const images = files
    .filter(f => f.type === 'image')
    .map(f => ({ src: f.url }))

  // 获取图片在灯箱中的索引
  const getImageIndex = (url: string) => images.findIndex(img => img.src === url)

  return (
    <>
      {/* 文件预览容器 */}
      <div className={cn('flex flex-wrap gap-2 mt-2', className)}>
        {files.map((file, index) => (
          <div key={file.url} className="relative group">
            {file.type === 'image' ? (
              /* 图片预览项 */
              <div 
                className="relative w-20 h-20 rounded-md overflow-hidden border border-border transition-all duration-200 hover:shadow-md cursor-pointer"
                onClick={() => setSelectedImage(file.url)}
              >
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-contain p-0.5"
                  sizes="80px"
                />
                {/* 悬停时显示放大镜图标 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-foreground/0 group-hover:text-foreground/70" />
                </div>
              </div>
            ) : (
              /* 文件预览项 */
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border bg-muted/30 flex flex-col items-center justify-center p-2 transition-all duration-200 hover:shadow-md">
                      <FileIcon className="w-6 h-6 mb-1 text-muted-foreground" />
                      <div className="text-center">
                        <div className="text-xs font-medium truncate max-w-[70px]">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{file.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {/* 删除按钮 */}
            {canDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 bg-red-500/90 hover:bg-red-500 p-0"
                onClick={() => onDelete?.(index)}
              >
                <X className="w-2.5 h-2.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* 图片灯箱组件 */}
      <Lightbox
        open={selectedImage !== null}
        close={() => setSelectedImage(null)}
        index={selectedImage ? getImageIndex(selectedImage) : 0}
        slides={images}
        plugins={[Zoom]}
        animation={{ fade: 300 }}
        carousel={{ finite: images.length <= 1 }}
        render={{
          buttonPrev: images.length <= 1 ? () => null : undefined,
          buttonNext: images.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  )
}

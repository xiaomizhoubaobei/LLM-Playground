/**
 * @fileoverview React Hook，用于处理文件上传功能
 * 支持图片和文件上传，包含压缩、错误处理和状态管理
 * @author 祁筱欣
 * @date 2026-02-03
 * @since 2026-02-03
 * @contact qixiaoxin@stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 本模块提供了文件上传功能的 Hook，用于处理文件上传操作和状态管理。
 *          主要功能包括：
 *          - 支持多文件并行上传
 *          - 图片自动压缩功能
 *          - 完整的上传状态管理（进行中/完成/错误）
 *          - 错误处理和错误信息展示
 *          - 支持 playground 前缀的文件路径
 *
 *          使用场景：
 *          - 上传聊天中的图片文件
 *          - 上传文档资料
 *          - 批量上传多个文件
 *          - 任何需要将文件上传到服务器的场景
 *
 *          工作流程：
 *          1. 调用 upload 函数传入文件数组
 *          2. 使用 Promise.all 并行处理多个文件
 *          3. 为每个文件构建 FormData，包含文件和配置参数
 *          4. 调用 AI 302 API 上传文件
 *          5. 图片文件会自动触发压缩（need_compress=true）
 *          6. 返回包含 URL、类型、名称和大小的文件信息数组
 *          7. 出错时捕获异常并设置错误状态
 *
 *          依赖关系：
 *          - 依赖 @/env 获取上传 API URL 配置
 *          - 使用 ky 库进行 HTTP 请求
 */

import { env } from '@/env'
import ky from 'ky'
import { useState } from 'react'

/**
 * 上传文件接口定义
 */
export interface UploadedFile {
  url: string
  type: 'image' | 'file'
  name: string
  size: number
}

/**
 * 上传响应接口定义
 */
interface UploadResponse {
  code: number
  msg: string
  data: {
    url: string
  }
}

/**
 * 文件上传 React Hook
 * 提供文件上传功能，包含状态管理和错误处理
 * 
 * @function useFileUpload
 */
export function useFileUpload() {
  // 上传状态和错误状态
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 上传文件到服务器
   *
   * @async
   */
    const upload = async (files: File[]): Promise<UploadedFile[]> => {    setIsUploading(true)
    setError(null)

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          // 构建表单数据
          const formData = new FormData()
          formData.append('file', file)
          formData.append('prefix', 'playground')
          formData.append(
            'need_compress',
            file.type.startsWith('image/') ? 'true' : 'false'
          )

          // 发送上传请求
          const uploadUrl = env.NEXT_PUBLIC_AI_302_API_UPLOAD_URL
          if (!uploadUrl) {
            throw new Error('Upload URL is not configured')
          }
          const response = await ky
            .post(uploadUrl, {
              body: formData,
            })
            .json<UploadResponse>()

          // 检查响应状态
          if (response.code !== 0) {
            throw new Error(response.msg)
          }

          // 返回上传后的文件信息
          return {
            url: response.data.url,
            type: file.type.startsWith('image/') ? 'image' : 'file',
            name: file.name,
            size: file.size,
          } as UploadedFile
        })
      )

      return uploadedFiles
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return {
    upload,
    isUploading,
    error,
  }
}

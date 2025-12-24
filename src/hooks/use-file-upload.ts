/**
 * @fileoverview React Hook，用于处理文件上传功能
 * 支持图片和文件上传，包含压缩、错误处理和状态管理
 * @author 祁筱欣
 * @date 2025-12-24
 * @since 2025-12-24
 * @contact qixiaoxin @stu.sqxy.edu.cn
 * @license AGPL-3.0 license
 * @remark 提供完整的文件上传功能，支持多文件上传、图片压缩和错误处理
 */

import { env } from '@/env'
import ky from 'ky'
import { useState } from 'react'

/**
 * 上传文件接口定义
 * 
 * @interface UploadedFile
 * @property {string} url - 文件访问URL
 * @property {'image' | 'file'} type - 文件类型
 * @property {string} name - 文件名
 * @property {number} size - 文件大小
 */
export interface UploadedFile {
  url: string
  type: 'image' | 'file'
  name: string
  size: number
}

/**
 * 上传响应接口定义
 * 
 * @interface UploadResponse
 * @property {number} code - 响应状态码
 * @property {string} msg - 响应消息
 * @property {Object} data - 响应数据
 * @property {string} data.url - 上传文件的URL
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
 * @returns {Object} 文件上传接口
 * @property {Function} upload - 上传文件函数
 * @property {boolean} isUploading - 上传状态
 * @property {string | null} error - 错误信息
 */
export function useFileUpload() {
  // 上传状态和错误状态
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 上传文件到服务器
   * 
   * @param {File[]} files - 要上传的文件数组
   * @returns {Promise<UploadedFile[]>} 上传完成后的文件信息数组
   */
  const upload = async (files: File[]): Promise<UploadedFile[]> => {
    setIsUploading(true)
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
          const response = await ky
            .post(env.NEXT_PUBLIC_AI_302_API_UPLOAD_URL, {
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

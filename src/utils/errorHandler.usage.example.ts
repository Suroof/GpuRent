/**
 * ErrorHandler 使用示例
 * 修复了原有的 Composition API 使用问题
 */

import { ErrorHandler, useErrorHandler, withErrorHandling, ErrorLevel } from './errorHandler'

// 1. 在 Vue 组件中使用
export function exampleInVueComponent() {
  // 在 Vue 组件的 setup 函数中使用
  const { handleError } = useErrorHandler()

  // 处理错误
  handleError(new Error('测试错误'), ErrorLevel.ERROR, true)
}

// 2. 在非 Vue 组件中使用（如 API 调用、工具函数等）
export function exampleInUtilFunction() {
  const errorHandler = ErrorHandler.getInstance()

  try {
    // 一些可能出错的操作
    throw new Error('API 调用失败')
  } catch (error) {
    // 处理错误，会自动初始化 UI 组件
    errorHandler.handleError(error, ErrorLevel.ERROR, true)
  }
}

// 3. 使用 withErrorHandling 包装异步函数
export const apiCall = withErrorHandling(
  async (id: string) => {
    const response = await fetch(`/api/data/${id}`)
    if (!response.ok) {
      throw new Error('网络请求失败')
    }
    return response.json()
  },
  {
    level: ErrorLevel.ERROR,
    showToUser: true,
    loadingState: true // 自动管理加载状态
  }
)

// 4. 在 main.ts 中设置全局错误处理
export function setupGlobalErrorHandling(app: any) {
  const { setupErrorHandler } = require('./errorHandler')
  setupErrorHandler(app)
}

import { useMessage, useDialog, useLoadingBar } from 'naive-ui'
import { useGlobalStore } from '@/stores/global'

/**
 * 错误类型定义
 */
export interface AppError {
  code?: string | number
  message: string
  details?: any
  timestamp?: number
  stack?: string
}

/**
 * 错误级别
 */
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * 全局错误处理器
 */
export class ErrorHandler {
  private static instance: ErrorHandler
  private message: any
  private dialog: any
  private loadingBar: any
  private globalStore: any

  constructor() {
    // 延迟初始化，避免在类实例化时调用 Composition API
    this.message = null
    this.dialog = null
    this.loadingBar = null
    this.globalStore = null
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * 初始化 UI 组件（在 Vue 组件中调用）
   */
  initializeUI() {
    if (!this.message) {
      try {
        this.message = useMessage()
        this.dialog = useDialog()
        this.loadingBar = useLoadingBar()
        this.globalStore = useGlobalStore()
      } catch (error) {
        console.warn('[ErrorHandler] 无法初始化 UI 组件，可能不在 Vue 组件上下文中')
      }
    }
  }

  /**
   * 处理错误
   */
  handleError(error: any, level: ErrorLevel = ErrorLevel.ERROR, showToUser: boolean = true): void {
    // 初始化 UI 组件（如果还未初始化）
    this.initializeUI()

    const appError = this.normalizeError(error)

    // 记录错误日志
    this.logError(appError, level)

    // 关闭全局加载状态
    if (this.globalStore) {
      this.globalStore.setLoading(false)
    }
    if (this.loadingBar) {
      this.loadingBar.error()
    }

    // 显示错误给用户
    if (showToUser) {
      this.showErrorToUser(appError, level)
    }

    // 上报错误（生产环境）
    if (process.env.NODE_ENV === 'production') {
      this.reportError(appError, level)
    }
  }

  /**
   * 统一错误格式
   */
  private normalizeError(error: any): AppError {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      }
    }

    if (typeof error === 'string') {
      return {
        message: error,
        timestamp: Date.now()
      }
    }

    if (error && typeof error === 'object') {
      return {
        code: error.code || error.status,
        message: error.message || error.msg || '未知错误',
        details: error.data || error.response?.data,
        timestamp: Date.now()
      }
    }

    return {
      message: '未知错误',
      timestamp: Date.now()
    }
  }

  /**
   * 记录错误日志
   */
  private logError(error: AppError, level: ErrorLevel): void {
    const logMethod =
      level === ErrorLevel.ERROR || level === ErrorLevel.CRITICAL ? console.error : console.warn

    logMethod('[Error Handler]', {
      level,
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(error.timestamp || Date.now()).toISOString()
    })
  }

  /**
   * 向用户显示错误
   */
  private showErrorToUser(error: AppError, level: ErrorLevel): void {
    const message = this.getUserFriendlyMessage(error)

    // 如果 UI 组件未初始化，使用 console 输出
    if (!this.message || !this.dialog) {
      console.warn('[ErrorHandler] UI 组件未初始化，使用 console 输出:', message)
      return
    }

    switch (level) {
      case ErrorLevel.INFO:
        this.message.info(message)
        break
      case ErrorLevel.WARNING:
        this.message.warning(message)
        break
      case ErrorLevel.ERROR:
        this.message.error(message)
        break
      case ErrorLevel.CRITICAL:
        this.dialog.error({
          title: '严重错误',
          content: message,
          positiveText: '确定',
          onPositiveClick: () => {
            // 可以考虑重新加载页面或重定向
          }
        })
        break
    }
  }

  /**
   * 获取用户友好的错误信息
   */
  private getUserFriendlyMessage(error: AppError): string {
    // 常见错误代码映射
    const errorCodeMap: Record<string | number, string> = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '权限不足',
      404: '资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '请求超时',
      NETWORK_ERROR: '网络连接错误',
      TIMEOUT: '请求超时',
      PARSE_ERROR: '数据解析错误'
    }

    if (error.code && errorCodeMap[error.code]) {
      return errorCodeMap[error.code]
    }

    // 对一些常见错误信息进行友好化处理
    const message = error.message.toLowerCase()
    if (message.includes('network') || message.includes('fetch')) {
      return '网络连接失败，请检查网络设置'
    }
    if (message.includes('timeout')) {
      return '请求超时，请稍后重试'
    }
    if (message.includes('parse') || message.includes('json')) {
      return '数据格式错误'
    }

    return error.message || '操作失败，请稍后重试'
  }

  /**
   * 上报错误到监控平台
   */
  private reportError(error: AppError, level: ErrorLevel): void {
    // 这里可以集成如 Sentry、LogRocket 等错误监控平台
    // 示例：
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { level })
    // }

    console.log('[Error Reported]', { error, level })
  }
}

/**
 * 创建异步操作的错误处理包装器
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    level?: ErrorLevel
    showToUser?: boolean
    loadingState?: boolean
    customErrorHandler?: (error: any) => void
  } = {}
): T {
  const {
    level = ErrorLevel.ERROR,
    showToUser = true,
    loadingState = false,
    customErrorHandler
  } = options

  return (async (...args: Parameters<T>) => {
    const errorHandler = ErrorHandler.getInstance()
    let globalStore: any = null

    // 尝试获取 globalStore，如果失败则跳过
    try {
      globalStore = useGlobalStore()
    } catch (error) {
      console.warn('[withErrorHandling] 无法获取 globalStore')
    }

    try {
      if (loadingState && globalStore) {
        globalStore.setLoading(true)
      }

      const result = await fn(...args)

      if (loadingState && globalStore) {
        globalStore.setLoading(false)
      }

      return result
    } catch (error) {
      if (customErrorHandler) {
        customErrorHandler(error)
      } else {
        errorHandler.handleError(error, level, showToUser)
      }

      if (loadingState && globalStore) {
        globalStore.setLoading(false)
      }

      throw error
    }
  }) as T
}

/**
 * 全局错误处理 Hook
 */
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance()

  // 在 Vue 组件中初始化 UI 组件
  errorHandler.initializeUI()

  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    withErrorHandling
  }
}

/**
 * Vue 错误处理插件
 */
export function setupErrorHandler(app: any) {
  const errorHandler = ErrorHandler.getInstance()

  // 处理 Vue 错误
  app.config.errorHandler = (error: any, instance: any, info: string) => {
    errorHandler.handleError(
      {
        message: error.message,
        stack: error.stack,
        details: { componentInfo: info, instance }
      },
      ErrorLevel.ERROR
    )
  }

  // 处理未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handleError(event.reason, ErrorLevel.ERROR)
    event.preventDefault()
  })

  // 处理全局错误
  window.addEventListener('error', (event) => {
    errorHandler.handleError(
      {
        message: event.message,
        stack: event.error?.stack,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      },
      ErrorLevel.ERROR
    )
  })
}

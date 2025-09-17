import { ref, computed, type Ref } from 'vue'
import { useErrorHandler } from '@/utils/errorHandler'

export interface AsyncDataOptions<T> {
  // 默认值
  defaultValue?: T
  // 立即执行
  immediate?: boolean
  // 重置数据到默认值
  resetToDefault?: boolean
  // 错误处理选项
  errorOptions?: {
    showToUser?: boolean
    level?: 'info' | 'warning' | 'error' | 'critical'
  }
  // 转换数据
  transform?: (data: any) => T
  // 缓存时间（毫秒）
  cacheTime?: number
}

export interface AsyncDataState<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  execute: (...args: any[]) => Promise<T>
  refresh: () => Promise<T>
  reset: () => void
  retry: () => Promise<T>
}

/**
 * 异步数据加载 Hook
 * 提供统一的加载状态管理、错误处理和数据缓存
 */
export function useAsyncData<T = any>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: AsyncDataOptions<T> = {}
): AsyncDataState<T> {
  const {
    defaultValue = null,
    immediate = false,
    resetToDefault = false,
    errorOptions = {},
    transform,
    cacheTime = 0
  } = options

  const { handleError } = useErrorHandler()

  // 状态管理
  const data = ref<T | null>(defaultValue) as Ref<T | null>
  const loading = ref(false)
  const error = ref<any>(null)

  // 缓存相关
  const lastArgs = ref<any[]>([])
  const lastFetchTime = ref(0)
  const cacheData = ref<T | null>(null)

  // 是否有缓存且未过期
  const hasValidCache = computed(() => {
    if (!cacheTime || !cacheData.value) return false
    return Date.now() - lastFetchTime.value < cacheTime
  })

  // 执行异步函数
  const execute = async (...args: any[]): Promise<T> => {
    // 检查缓存
    if (hasValidCache.value && JSON.stringify(args) === JSON.stringify(lastArgs.value)) {
      data.value = cacheData.value
      return cacheData.value!
    }

    try {
      loading.value = true
      error.value = null

      if (resetToDefault) {
        data.value = defaultValue
      }

      const result = await asyncFn(...args)
      const transformedData = transform ? transform(result) : result

      data.value = transformedData

      // 更新缓存
      if (cacheTime > 0) {
        cacheData.value = transformedData
        lastFetchTime.value = Date.now()
        lastArgs.value = args
      }

      return transformedData
    } catch (err) {
      error.value = err

      // 错误处理
      if (errorOptions.showToUser !== false) {
        handleError(err, errorOptions.level || 'error')
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  // 刷新数据（忽略缓存）
  const refresh = async (): Promise<T> => {
    // 清除缓存
    cacheData.value = null
    lastFetchTime.value = 0

    return execute(...lastArgs.value)
  }

  // 重试（使用上次的参数）
  const retry = async (): Promise<T> => {
    return execute(...lastArgs.value)
  }

  // 重置状态
  const reset = () => {
    data.value = defaultValue
    loading.value = false
    error.value = null
    cacheData.value = null
    lastFetchTime.value = 0
    lastArgs.value = []
  }

  // 立即执行
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset,
    retry
  }
}

/**
 * 分页数据加载 Hook
 */
export interface PaginationOptions {
  page?: number
  pageSize?: number
  total?: number
}

export interface PaginatedAsyncDataState<T> extends AsyncDataState<T[]> {
  pagination: Ref<PaginationOptions>
  loadMore: () => Promise<T[]>
  loadPage: (page: number) => Promise<T[]>
  hasMore: Ref<boolean>
}

export function usePaginatedAsyncData<T = any>(
  asyncFn: (options: PaginationOptions) => Promise<{ list: T[]; total: number }>,
  initialPagination: PaginationOptions = {}
): PaginatedAsyncDataState<T> {
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    ...initialPagination
  })

  const allData = ref<T[]>([]) as Ref<T[]>

  const baseAsyncData = useAsyncData(
    async () => {
      const result = await asyncFn(pagination.value)
      pagination.value.total = result.total

      if (pagination.value.page === 1) {
        allData.value = result.list
      } else {
        allData.value.push(...result.list)
      }

      return allData.value
    },
    {
      defaultValue: [],
      immediate: true
    }
  )

  const hasMore = computed(() => {
    const currentTotal = allData.value.length
    return currentTotal < pagination.value.total
  })

  // 加载更多
  const loadMore = async (): Promise<T[]> => {
    if (!hasMore.value) return allData.value

    pagination.value.page += 1
    return baseAsyncData.execute()
  }

  // 加载指定页
  const loadPage = async (page: number): Promise<T[]> => {
    pagination.value.page = page
    allData.value = [] // 重置数据
    return baseAsyncData.execute()
  }

  return {
    ...baseAsyncData,
    data: allData,
    pagination,
    loadMore,
    loadPage,
    hasMore
  }
}

/**
 * 表单提交 Hook
 */
export interface FormSubmitOptions<T> {
  onSuccess?: (result: T) => void
  onError?: (error: any) => void
  successMessage?: string
  resetForm?: boolean
}

export function useFormSubmit<T = any>(
  submitFn: (...args: any[]) => Promise<T>,
  options: FormSubmitOptions<T> = {}
) {
  const { handleError } = useErrorHandler()
  const { onSuccess, onError, successMessage, resetForm } = options

  const loading = ref(false)
  const error = ref<any>(null)

  const submit = async (...args: any[]): Promise<T | undefined> => {
    try {
      loading.value = true
      error.value = null

      const result = await submitFn(...args)

      if (successMessage) {
        // 这里可以显示成功消息
        console.log(successMessage)
      }

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      error.value = err

      if (onError) {
        onError(err)
      } else {
        handleError(err, 'error')
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    submit
  }
}

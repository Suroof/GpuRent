import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { useMessage } from 'naive-ui'

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 统一处理响应数据
    if (data.code === 200) {
      return data
    } else {
      // 业务错误处理
      const message = useMessage()
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error) => {
    const message = useMessage()

    if (error.response) {
      // 服务器返回的错误状态码
      const { status, data } = error.response

      switch (status) {
        case 400:
          message.error(data.message || '请求参数错误')
          break
        case 401:
          message.error('未授权，请重新登录')
          // 清除token并跳转到登录页
          localStorage.removeItem('access_token')
          window.location.href = '/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(data.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      // 网络错误
      message.error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      message.error(error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

// 通用请求方法封装
export class HttpClient {
  static get<T = any>(url: string, params?: any): Promise<T> {
    return http.get(url, { params })
  }

  static post<T = any>(url: string, data?: any): Promise<T> {
    return http.post(url, data)
  }

  static put<T = any>(url: string, data?: any): Promise<T> {
    return http.put(url, data)
  }

  static delete<T = any>(url: string): Promise<T> {
    return http.delete(url)
  }

  static patch<T = any>(url: string, data?: any): Promise<T> {
    return http.patch(url, data)
  }
}

export default http

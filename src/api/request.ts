import type { ApiResponse } from '@/types/api'

/**
 * 请求配置选项
 */
interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  showLoading?: boolean
  loadingText?: string
}

/**
 * 请求拦截器 - 添加 token
 */
function requestInterceptor(config: RequestConfig): RequestConfig {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
}

/**
 * 响应拦截器 - 统一错误处理
 */
async function responseInterceptor(response: any): Promise<any> {
  const { statusCode, data } = response
  if (statusCode === 200) {
    const res = data as ApiResponse
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      uni.showToast({
        title: res.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(new Error(res.message))
    }
  } else if (statusCode === 401) {
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    })
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.reLaunch({ url: '/pages/login/login' })
    return Promise.reject(new Error('未授权'))
  } else {
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    })
    return Promise.reject(new Error('网络错误'))
  }
}

/**
 * 统一请求方法
 */
export function request<T = any>(config: RequestConfig): Promise<T> {
  // 请求拦截
  const finalConfig = requestInterceptor(config)
  
  // 显示 loading
  if (finalConfig.showLoading !== false) {
    uni.showLoading({
      title: finalConfig.loadingText || '加载中...'
    })
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      url:  `https://api.1love.com.cn/api/v1${finalConfig.url}`,
      method: finalConfig.method || 'GET',
      data: finalConfig.data,
      header: finalConfig.header,
      success: (res) => {
        responseInterceptor(res)
          .then(resolve)
          .catch(reject)
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        if (finalConfig.showLoading !== false) {
          uni.hideLoading()
        }
      }
    })
  })
}

export default request

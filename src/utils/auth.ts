/**
 * 登录授权工具
 */
import { useUserStore } from '@/store/modules/user'

/**
 * 微信登录
 */
export async function wxLogin(): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async (loginRes) => {
        if (loginRes.code) {
          try {
            const userStore = useUserStore()
            await userStore.login(loginRes.code)
            resolve()
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error('登录失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 检查登录态
 */
export function checkLogin(): boolean {
  const token = uni.getStorageSync('token')
  // 开发环境下打印 token 信息,方便调试
  // #ifdef H5 || MP-WEIXIN
  console.log('[checkLogin] Token 值:', token, '类型:', typeof token)
  // #endif
  // 确保 token 存在且不为空字符串或无效值
  return !!token && token !== '' && token !== 'null' && token !== 'undefined'
}

/**
 * 跳转登录页(携带回退路径)
 */
export function navigateToLogin(): void {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const redirectUrl = `/${currentPage.route}`
  
  uni.navigateTo({
    url: `/pages/login/login?redirect=${encodeURIComponent(redirectUrl)}`
  })
}

/**
 * 需要登录时的拦截器
 */
export function requireLogin(): boolean {
  if (!checkLogin()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          navigateToLogin()
        }
      }
    })
    return false
  }
  return true
}

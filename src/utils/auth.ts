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
 * 检查登录态(同步版本 - 仅检查本地存储)
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
 * 检查登录态(异步版本 - 验证 token 有效性)
 * @returns Promise<boolean> true 表示 token 有效,false 表示无效
 */
export async function checkLoginAsync(): Promise<boolean> {
  // 首先检查本地 token 是否存在
  if (!checkLogin()) {
    return false
  }
  
  try {
    // 尝试获取用户信息来验证 token 是否有效
    const userStore = useUserStore()
    await userStore.syncUserInfo()
    return true
  } catch (error) {
    // 如果获取用户信息失败,说明 token 无效或已过期
    console.log('[checkLoginAsync] Token 验证失败:', error)
    
    // 清除无效的 token 和用户信息
    const userStore = useUserStore()
    userStore.logout()
    
    return false
  }
}

/**
 * 跳转登录页(携带回退路径)
 */
export function navigateToLogin(): void {
  // 检查是否携带回退路径

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const redirectUrl = `/${currentPage.route}`
  console.log(redirectUrl,'redirectUrl')
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

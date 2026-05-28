import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'
import { login, getUserInfo } from '@/api/user'

interface UserState {
  userInfo: UserInfo | null
  token: string | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    token: uni.getStorageSync('token') || null,
    isLoggedIn: !!uni.getStorageSync('token')
  }),

  getters: {
    // 获取用户昵称
    nickname: (state) => state.userInfo?.nickname || '未登录',
    // 获取用户头像
    avatar: (state) => state.userInfo?.avatar || ''
  },

  actions: {
    // 登录
    async login(code: string) {
      try {
        const res = await login(code)
        this.token = res.token
        this.isLoggedIn = true
        
        // 持久化 token
        uni.setStorageSync('token', res.token)
        
        // 获取最新的用户信息
        await this.syncUserInfo()
        
        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },

    // 同步用户信息
    async syncUserInfo() {
      try {
        const userInfo = await getUserInfo()
        this.userInfo = userInfo
        uni.setStorageSync('userInfo', userInfo)
      } catch (error) {
        console.error('同步用户信息失败:', error)
        throw error
      }
    },

    // 更新用户信息
    updateUserInfo(userInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...userInfo }
        uni.setStorageSync('userInfo', this.userInfo)
      }
    },

    // 登出
    logout() {
      this.userInfo = null
      this.token = null
      this.isLoggedIn = false
      
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  }
})
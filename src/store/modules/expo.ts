import { defineStore } from 'pinia'
import type { WeddingExpo, UserExpoStatus } from '@/types/expo'
import { getExpoDetail, registerExpo, getExpoQrcode } from '@/api/expo'

interface ExpoState {
  currentExpo: WeddingExpo | null
  userStatus: UserExpoStatus | null
}

export const useExpoStore = defineStore('expo', {
  state: (): ExpoState => ({
    currentExpo: null,
    userStatus: null
  }),

  actions: {
    // 获取婚博会详情
    async fetchExpoDetail(id: number) {
      try {
        const expo = await getExpoDetail(id)
        this.currentExpo = expo
        return expo
      } catch (error) {
        console.error('获取婚博会详情失败:', error)
        throw error
      }
    },

    // 报名婚博会
    async registerExpo(id: number) {
      try {
        await registerExpo(id)
        uni.showToast({
          title: '报名成功',
          icon: 'success'
        })
        // 刷新详情
        await this.fetchExpoDetail(id)
      } catch (error) {
        console.error('报名失败:', error)
        throw error
      }
    },

    // 获取用户状态
    async fetchUserStatus(expoId: number) {
      try {
        const status = await getExpoQrcode(expoId)
        this.userStatus = status
        return status
      } catch (error) {
        console.error('获取用户状态失败:', error)
        throw error
      }
    },

    // 清空当前婚博会
    clearCurrentExpo() {
      this.currentExpo = null
      this.userStatus = null
    }
  }
})

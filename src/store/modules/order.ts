import { defineStore } from 'pinia'
import type { ButlerOrder } from '@/types/butler'
import { getButlerOrders, confirmComplete } from '@/api/butler'

interface OrderState {
  butlerOrders: ButlerOrder[]
  currentOrder: ButlerOrder | null
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    butlerOrders: [],
    currentOrder: null
  }),

  getters: {
    // 待支付订单
    pendingOrders: (state) => 
      state.butlerOrders.filter(o => o.orderStatus === '待支付'),
    // 已完成订单
    completedOrders: (state) => 
      state.butlerOrders.filter(o => o.orderStatus === '已完成')
  },

  actions: {
    // 获取订单列表
    async fetchOrders(status?: string) {
      try {
        const orders = await getButlerOrders(status)
        this.butlerOrders = orders
        return orders
      } catch (error) {
        console.error('获取订单列表失败:', error)
        throw error
      }
    },

    // 确认服务完成
    async confirmComplete(orderId: number) {
      try {
        await confirmComplete(orderId)
        uni.showToast({
          title: '确认完成',
          icon: 'success'
        })
        // 刷新订单列表
        await this.fetchOrders()
      } catch (error) {
        console.error('确认完成失败:', error)
        throw error
      }
    },

    // 设置当前订单
    setCurrentOrder(order: ButlerOrder | null) {
      this.currentOrder = order
    }
  }
})

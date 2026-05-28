import { defineStore } from 'pinia'
import type { UserCoupon } from '@/types/coupon'
import { getMyCoupons, receiveCoupon } from '@/api/coupon'

interface CouponState {
  myCoupons: UserCoupon[]
  selectedCoupon: UserCoupon | null
}

export const useCouponStore = defineStore('coupon', {
  state: (): CouponState => ({
    myCoupons: [],
    selectedCoupon: null
  }),

  getters: {
    // 未使用的优惠券
    unusedCoupons: (state) => 
      state.myCoupons.filter(c => c.status === '未使用'),
    // 已使用的优惠券
    usedCoupons: (state) => 
      state.myCoupons.filter(c => c.status === '已使用'),
    // 已过期的优惠券
    expiredCoupons: (state) => 
      state.myCoupons.filter(c => c.status === '已过期')
  },

  actions: {
    // 获取我的优惠券
    async fetchCoupons(status?: string) {
      try {
        const coupons = await getMyCoupons(status)
        this.myCoupons = coupons
        return coupons
      } catch (error) {
        console.error('获取优惠券失败:', error)
        throw error
      }
    },

    // 领取优惠券
    async receiveCoupon(id: number) {
      try {
        await receiveCoupon(id)
        // 重新获取列表
        await this.fetchCoupons()
        uni.showToast({
          title: '领取成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('领取优惠券失败:', error)
        throw error
      }
    },

    // 选择优惠券
    selectCoupon(coupon: UserCoupon | null) {
      this.selectedCoupon = coupon
    }
  }
})

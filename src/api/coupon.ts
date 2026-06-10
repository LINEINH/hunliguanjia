import { request } from './request'
import type { CouponTemplate, UserCoupon } from '@/types/coupon'

/**
 * 获取可领取优惠券列表
 */
export function getCouponList() {
  return request<CouponTemplate[]>({
    url: '/api/coupon/list',
    method: 'GET'
  })
}

/**
 * 领取优惠券
 */
export function receiveCoupon(id: number) {
  return request({
    url: `/api/coupon/${id}/receive`,
    method: 'POST'
  })
}

/**
 * 获取我的优惠券
 */
export function getMyCoupons(status?: string) {
  return request<UserCoupon[]>({
    url: '/wechat/coupons/my',
    method: 'GET',
    data: { status }
  })
}

/**
 * 获取优惠券详情
 */
export function getCouponDetail(id: number) {
  return request<UserCoupon>({
    url: `/api/coupon/${id}`,
    method: 'GET'
  })
}

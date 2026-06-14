import { request } from './request'
import type { WeddingExpo, UserExpoStatus } from '@/types/expo'

/**
 * 获取婚博会列表 /api/v1/wechat/expo/home
 */
export function getExpoList() {
  return request<any>({
    url: '/wechat/expo/home',
    method: 'GET'
  })
}


/**
 * 获取婚博会banner /api/v1/wechat/banners/expo
 */
export function getExpoBanner() {
  return request<any>({
    url: '/wechat/banners/expo',
    method: 'GET'
  })
}
/**
 * 获取婚博会详情
 */
export function getExpoDetail(id: number) {
  return request<any>({
    url: `/wechat/expo/activities/${id}`,
    method: 'GET'
  })
}

/**
 * 报名婚博会
 */
export function registerExpo(activity_id: string,user_name: string, user_phone: string) {
  return request({
    url: `/wechat/expo/register`,
    method: 'POST',
    data: {
      activity_id,
      user_name,
      user_phone
    }
  })
}

/**
 * 获取个人入场码
 */
export function getExpoQrcode(expoId: number) {
  return request<UserExpoStatus>({
    url: `/api/expo/${expoId}/qrcode`,
    method: 'GET'
  })
}

/**
 * 现场签到(员工端)
 */
export function checkinExpo(expoId: number, code: string) {
  return request({
    url: `/api/expo/${expoId}/checkin`,
    method: 'POST',
    data: { code }
  })
}


/**
 * 获取伴手礼列表 /api/v1/wechat/expo/gifts?activity_id=2
 */
export function getGift(id: number) {
  return request<any>({
    url: `/wechat/expo/gifts?activity_id=${id}`,
    method: 'GET'
  })
}

// 领取伴手礼 /api/v1/wechat/expo/gifts/{gift_id}/claim
export function checkinClaim(gift_id: number) {
  return request({
    url: `/wechat/expo/gifts/${gift_id}/claim`,
    method: 'POST'
  })
}

// 签到 
export function checkin(u: string,a: string) {
  return request({
    url: `/wechat/expo/staff-checkin-qr`,
    method: 'POST',
    data: {
      u,
      a
    }
  })
}
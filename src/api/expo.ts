import { request } from './request'
import type { WeddingExpo, UserExpoStatus } from '@/types/expo'

/**
 * 获取婚博会列表
 */
export function getExpoList() {
  return request<any>({
    url: '/wechat/expo/activities',
    method: 'GET'
  })
}

/**
 * 获取婚博会详情
 */
export function getExpoDetail(id: number) {
  return request<WeddingExpo>({
    url: `/api/expo/${id}`,
    method: 'GET'
  })
}

/**
 * 报名婚博会
 */
export function registerExpo(id: number) {
  return request({
    url: `/api/expo/${id}/register`,
    method: 'POST'
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

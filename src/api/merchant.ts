import { request } from './request'
import type { Merchant } from '@/types/merchant'
import type { PaginatedResponse, PaginationParams } from '@/types/api'

/**
 * 获取商家列表
 */
export function getMerchantList(params: PaginationParams & { category?: string; city?: string }) {
  return request<PaginatedResponse<Merchant>>({
    url: '/api/merchant/list',
    method: 'GET',
    data: params
  })
}

/**
 * 获取商家详情
 */
export function getMerchantDetail(id: number) {
  return request<Merchant>({
    url: `/api/merchant/${id}`,
    method: 'GET'
  })
}

/**
 * 获取商家案例
 */
export function getMerchantCases(id: number) {
  return request<any[]>({
    url: `/api/merchant/${id}/cases`,
    method: 'GET'
  })
}

/**
 * 记录电话拨出
 */
export function callMerchant(id: number) {
  return request({
    url: `/api/merchant/${id}/call`,
    method: 'POST'
  })
}

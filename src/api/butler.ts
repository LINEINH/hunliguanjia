import { request } from './request'
import type { WeddingButler, ButlerOrder } from '@/types/butler'

/**
 * 获取管家列表
 */
export function getButlerList() {
  return request<WeddingButler[]>({
    url: '/api/butler/list',
    method: 'GET'
  })
}

/**
 * 获取管家详情
 */
export function getButlerDetail(id: number) {
  return request<WeddingButler>({
    url: `/api/butler/${id}`,
    method: 'GET'
  })
}

/**
 * 创建管家订单
 */
export function createButlerOrder(id: number) {
  return request<ButlerOrder>({
    url: `/api/butler/${id}/order`,
    method: 'POST'
  })
}

/**
 * 获取我的管家订单
 */
export function getButlerOrders(status?: string) {
  return request<ButlerOrder[]>({
    url: '/api/butler/orders',
    method: 'GET',
    data: { status }
  })
}

/**
 * 用户确认服务完成
 */
export function confirmComplete(orderId: number) {
  return request({
    url: `/api/butler/order/${orderId}/complete`,
    method: 'POST'
  })
}

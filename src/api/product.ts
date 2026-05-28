import { request } from './request'
import type { ServiceProduct, ProductCategory } from '@/types/product'
import type { PaginatedResponse, PaginationParams } from '@/types/api'



// 获取筛选条件
export function getHotelFilter() {
  return request<any>({
    url: '/wechat/merchants/filters',
    method: 'GET'
  })
}


// 获取酒店
export function merchants(page: number, per_page:number,) {
  return request<any>({
    url: '/wechat/merchants',
    method: 'GET'
  })
}
/**
/**
 * 获取产品列表
 */
export function getProductList(category: ProductCategory, params: PaginationParams & { keyword?: string; priceOrder?: 'asc' | 'desc' }) {
  return request<PaginatedResponse<ServiceProduct>>({
    url: `/api/product/${category}/list`,
    method: 'GET',
    data: params
  })
}

/**
 * 获取产品详情
 */
export function getProductDetail(id: number) {
  return request<ServiceProduct>({
    url: `/api/product/${id}`,
    method: 'GET'
  })
}

/**
 * 收藏产品
 */
export function favoriteProduct(id: number) {
  return request({
    url: `/api/product/${id}/favorite`,
    method: 'POST'
  })
}

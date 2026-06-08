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


// 按服务类别筛选商家列表
export function merchants(page: number, per_page: number, params?: any) {
  // 构建基础查询参数
  const queryParams: any = {
    page,
    per_page
  };
  
  // 添加筛选参数，避免覆盖page和per_page
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams[key] = params[key];
      }
    });
  }

  // 将查询参数拼接到URL中
  const queryString = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
    
  return request<any>({
    url: `/wechat/merchants${queryString ? '?' + queryString : ''}`,
    method: 'GET'
  })
}



// 获取产品 /api/v1/wechat/products?keyword=&category_id=&merchant_id=&min_price=&max_price=&per_page=
export function getProducts(page: number, per_page: number, params?: any) {
  // 构建基础查询参数
  const queryParams: any = {
    page,
    per_page
  };
  
  // 添加筛选参数，避免覆盖page和per_page
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams[key] = params[key];
      }
    });
  }

  // 将查询参数拼接到URL中
  const queryString = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
    
  return request<any>({
    url: `/wechat/products${queryString ? '?' + queryString : ''}`,
    method: 'GET'
  })
}

// 获取banner
export function getBanners(type:number) {
  return request<any>({
    url: `/wechat/banners/category/${type}`,
    method: 'GET'
  })
}


// 获取优惠券 /api/v1/wechat/coupons/available?merchant_id=1
export function getCoupons(id: number) {
  return request<any>({
    url: `/wechat/coupons/available?merchant_id=${id}`,
    method: 'GET'
  })
}


// 领取优惠券 /api/v1/wechat/coupons/1/receive
export function receiveCoupons(id: number) {
  return request<any>({
    url: `/wechat/coupons/${id}/receive`,
    method: 'POST'
  })
}

// 获取筛选条件
export function getDictionary() {
  return request<any>({
    url: '/wechat/dictionary',
    method: 'GET'
  })
}

// 推荐产品列表
export function getProductRecommend() {
  return request<any>({
    url: '/wechat/products/recommend',
    method: 'GET'
  })
}
// 获取筛金牌服务人
export function getGoldRecommend() {
  return request<any>({
    url: '/wechat/gold-service-providers/recommend',
    method: 'GET'
  })
}

/**
/**
 * 获取产品列表
 */

/**
 * 获取商户详情
 */
export function getHotelDetail(id: number) {
  return request<any>({
    url: `/wechat/merchants/${id}`,
    method: 'GET'
  })
}

/**
 * 获取产品详情
 */
export function getProductDetail(id: number) {
  return request<any>({
    url: `/wechat/products/${id}`,
    method: 'GET'
  })
}

/**
 * 收藏产品 /api/v1/wechat/user/favorites
 */
export function favoriteProduct(target_id: number,type:string) {
  return request({
    url: `/wechat/user/favorites`,
    method: 'POST',
    data: {
      target_id: target_id,
      type:type
    }
  })
}

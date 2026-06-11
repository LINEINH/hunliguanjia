import { request } from './request'
import type { UserInfo } from '@/types/user'

/**
 * 微信登录
 */
export function login(code: string) {
  return request<{ token: string; user_info: UserInfo }>({
    url: '/wechat/login',
    method: 'POST',
    data: { code }
  })
}

/**
 * 手机号授权登录/api/v1/wechat/get-phone-number
 */
export function loginWithPhone(phoneCode: string) {
  return request<{ success: boolean }>({
    url: '/wechat/get-phone-number',
    method: 'POST',
    data: { code: phoneCode }
  })
}

/**
 * 获取用户信息 /api/v1/wechat/user/profile
 */
export function getUserInfo() {
  return request<UserInfo>({
    url: '/wechat/user/profile',
    method: 'GET'
  })
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>) {
  return request({
    url: '/api/user/info',
    method: 'PUT',
    data
  })
}

/**
 * 上传头像(需审核)
 */
export function uploadAvatar(filePath: string) {
  return request<{ avatarUrl: string }>({
    url: '/api/user/avatar',
    method: 'POST',
    data: { filePath }
  })
}

// 我的收藏列表 /api/v1/wechat/user/favorites
export function getUserFavorites(type:string) {
  return request({
    url: '/wechat/user/favorites?type=' + type,
    method: 'GET',
  })
}

// 金牌服务人的banner /wechat/banners/gold-service
export function getGoldServiceBanner() {
  return request({
    url: '/wechat/banners/gold-service',
    method: 'GET',
  })
}

// 推荐金牌服务人 /api/v1/wechat/gold-service-providers/recommend
export function getRecommendedGold() {
  return request<any>({
    url: '/wechat/gold-service-providers/recommend',
    method: 'GET',
  })
}


// 获取金牌服务人列表 /api/v1/wechat/gold-service-providers?keyword=&service_level=&page=&per_page=
export function getGoldServiceProviders(keyword: string, service_level: string, page: number, per_page: number) {
  return request<any>({
    url: `/wechat/gold-service-providers?keyword=${keyword}&service_level=${service_level}&page=${page}&per_page=${per_page}`,
    method: 'GET',
  })
} 
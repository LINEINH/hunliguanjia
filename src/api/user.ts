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
 * 获取用户信息
 */
export function getUserInfo() {
  return request<UserInfo>({
    url: '/wechat/me',
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

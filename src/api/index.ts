import { request } from './request'


/**
 * 推荐案例
 */
export function casesFeatured() {
  return request<any>({
    url: '/wechat/cases/featured',
    method: 'GET'
  })
}

// 获取首页信息
export function getHomeInfo() {
  return request<any>({
    url: '/wechat/pages/home',
    method: 'GET'
  })
}



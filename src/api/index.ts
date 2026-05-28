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





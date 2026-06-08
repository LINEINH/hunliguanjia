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


/**
 * 获取详情 /api/v1/wechat/cases/{id}
 */
export function getCasesDetail(id: number) {
  return request<any>({
    url: `/wechat/cases/${id}`,
    method: 'GET'
  })
}


// 设置婚期规划 
export function weddingPlan(wedding_date: string,total_budget: string,table_count: string) {
  return request<any>({
    url: '/wechat/user/wedding-date-plan',
    method: 'POST',
    data: { wedding_date, total_budget, table_count }
  })
}

export function getWeddingPlan() {
  return request<any>({
    url: `/wechat/user/wedding-date-plan`,
    method: 'GET'
  })
}
import { request } from './request'
import type { LotteryActivity, LotteryRecord } from '@/types/lottery'

/**
 * 获取抽奖活动
 */
export function getLotteryActivity(expoId: number) {
  return request<LotteryActivity>({
    url: `/api/expo/${expoId}/lottery`,
    method: 'GET'
  })
}

/**
 * 参与抽奖(自动触发红包发放)
 */
export function joinLottery(id: number) {
  return request<LotteryRecord>({
    url: `/api/lottery/${id}/join`,
    method: 'POST'
  })
}

/**
 * 获取中奖记录
 */
export function getLotteryRecords() {
  return request<LotteryRecord[]>({
    url: '/api/lottery/records',
    method: 'GET'
  })
}

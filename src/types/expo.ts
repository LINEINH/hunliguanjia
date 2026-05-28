/**
 * 婚博会活动
 */
export interface WeddingExpo {
  id: number
  title: string
  introduction: string  // 富文本
  startTime: string
  endTime: string
  province: string
  city: string
  venue: string
  organizer: string
  status: '未开始' | '进行中' | '已结束'
  qrcode: string  // 活动二维码
  // 统计数据
  registerCount: number
  checkinCount: number
  lotteryCount: number
  totalRedPacket: number
  welfareProducts?: any[]
}

/**
 * 用户婚博会状态
 */
export interface UserExpoStatus {
  expoId: number
  isRegistered: boolean
  isCheckin: boolean
  hasLottery: boolean
  personalQrcode: string  // 个人入场二维码
}

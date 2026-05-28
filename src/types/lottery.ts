/**
 * 抽奖活动
 */
export interface LotteryActivity {
  id: number
  expoId: number
  name: string
  mainImage: string
  lotteryTime: string
  status: '未开始' | '进行中' | '已结束'
  prizes: LotteryPrize[]
}

/**
 * 抽奖奖项(红包)
 */
export interface LotteryPrize {
  id: number
  name: string  // 一等奖
  level: number  // 1
  probability: number  // 百分比
  amount: number  // 红包金额
  totalQuota: number  // 名额限制
  wonCount: number  // 已中奖数
}

/**
 * 中奖记录
 */
export interface LotteryRecord {
  id: number
  userId: number
  prizeId: number
  prizeName: string
  amount: number
  wxBillNo?: string  // 微信回执单号
  status: '发放成功' | '发放失败' | '已补发'
  createTime: string
}

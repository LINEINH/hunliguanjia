/**
 * 婚礼管家信息
 */
export interface WeddingButler {
  id: number
  name: string
  avatar: string
  price: number
  serviceItems: string
  advantages: string
  description: string  // 富文本
  images: string[]
  video?: string
  // 统计数据
  clientCount: number
  pv: number
  uv: number
  orderCount: number
  totalSales: number
}

/**
 * 管家订单状态
 */
export type OrderStatus = '待支付' | '已支付' | '已完成' | '已取消' | '已退款'

/**
 * 管家订单
 */
export interface ButlerOrder {
  id: number
  orderNo: string
  userId: number
  butlerId: number
  butlerName: string
  amount: number
  payStatus: OrderStatus
  orderStatus: OrderStatus
  createTime: string
  payTime?: string
  completeTime?: string
  completeImages?: string[]  // 后台上传的完成凭证
}

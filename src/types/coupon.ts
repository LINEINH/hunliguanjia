/**
 * 优惠券模板
 */
export interface CouponTemplate {
  id: number
  name: string
  amount: number  // 面额
  threshold: number  // 门槛(0为无门槛)
  merchantId?: number
  merchantName?: string
  productIds?: number[]
  totalQuantity: number
  perUserLimit: number
  validType: 'fixed' | 'relative'  // 固定时间/领券后N天
  validStart?: string
  validEnd?: string
  validDays?: number
  status: '上架' | '下架' | '发完'
}

/**
 * 用户优惠券
 */
export interface UserCoupon {
  id: number
  templateId: number
  couponName: string
  amount: number
  threshold: number
  status: '未使用' | '已使用' | '已过期'
  receiveTime: string
  useTime?: string
  expireTime: string
  verifyCode: string  // 核销码
}

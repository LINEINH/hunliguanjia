/**
 * 商家分类枚举
 */
export enum MerchantCategory {
  HOTEL = '婚礼酒店',
  PLAN = '婚礼策划',
  HOST = '婚礼主持',
  MAKEUP = '婚礼跟妆',
  VIDEO = '婚礼摄像',
  PHOTO = '婚礼摄影',
  DRESS = '婚纱礼服',
  CAR = '婚车租赁'
}

/**
 * 商家信息接口
 */
export interface Merchant {
  id: number
  name: string
  logo: string
  mainImage: string
  images: string[]
  phone: string
  contact: string
  description: string
  businessLicense: string
  category: MerchantCategory
  province: string
  city: string
  district: string
  address: string
  longitude: number
  latitude: number
  status: 1 | 2  // 1-正常 2-禁用
  rating: number
  features?: string[]
  serviceItems?: string[]
  // 统计数据
  caseCount?: number
  productCount?: number
  couponIssued?: number
  couponVerified?: number
  visitCount?: number
  callCount?: number
}

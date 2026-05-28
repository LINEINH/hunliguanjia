/**
 * 服务产品分类
 */
export type ProductCategory = 
  | 'service_hotel'      // 婚礼酒店
  | 'service_plan'       // 婚礼策划
  | 'service_host'       // 婚礼主持
  | 'service_makeup'     // 婚礼跟妆
  | 'service_video'      // 婚礼摄像
  | 'service_photo'      // 婚礼摄影
  | 'service_dress'      // 婚纱礼服
  | 'service_car'        // 婚车租赁

/**
 * 酒店菜单项
 */
export interface MenuItem {
  id: number
  name: string
  image: string
  images: string[]
  price?: number
  description: string
}

/**
 * 服务产品接口
 */
export interface ServiceProduct {
  id: number
  merchantId: number
  merchantName: string
  name: string
  category: ProductCategory
  price: number
  originalPrice?: number
  features?: string
  mainImage: string
  images: string[]
  video?: string
  description: string
  status: '上架' | '下架'
  recommendHome: boolean
  recommendTopic: boolean
  sales: number
  favorites: number
  
  // 酒店特有字段
  menuItems?: MenuItem[]
  minTables?: number
  maxTables?: number
  
  // 婚车特有字段
  carBrand?: string[]
  serviceArea?: string
  
  // 主持/跟妆等特有字段
  hostName?: string  // 主持人姓名
  selfEvaluation?: string  // 主持人自评
  serviceDetails?: string  // 服务项详情
}

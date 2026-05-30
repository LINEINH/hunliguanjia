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
 * | id | integer | 商家 ID | `1` |
| name | string | 商家名称 | `"盛唐宴礼宴中心"` |
| logo | string | 商家 Logo URL | `"/uploads/logo.jpg"` |
| description | string | 详细描述 | `"专业婚礼策划服务..."` |
| short_description | string | 简短描述 | `"环境雍容华贵"` |
| rating | decimal | 评分 | `4.3` |
| business_status | string | 营业状态 | `"营业中"` |
| business_hours | string | 营业时间 | `"09:00-23:00"` |
| address | string | 详细地址 | `"太华南路 141 号"` |
| district | string | 所在区域 | `"雁塔区"` |
| table_capacity | integer | 容纳桌数 | `50` |
| meal_standard | decimal | 餐标 | `3000.00` |
| venue_types | array | 场地类型 | `["室内", "多功能厅"]` |
| features | array | 特色标签 | `["大厅无柱", "西式婚礼"]` |
| view_count | integer | 浏览次数 | `1201` |
| product_count | integer | 产品数量 | `15` |
| order_count | integer | 订单数量 | `50` |
| is_recommend | boolean | 是否推荐 | `true` |
| products | array | 产品列表 | - |
| cases | array | 案例列表 | - |
 */
export interface ServiceProduct {
  id: number
  name: string
  logo: string
  description?: string,
  rating: string,
  short_description: string,
  business_status: string,
  business_hours: string,
  address: string,
  district:  string,
  table_capacity: number,
  meal_standard: string,
  venue_types:string[],
  features:string[],
  view_count:number,
  product_count:number,
  order_count:number,
  is_recommend:boolean,
  cases:string[],


}

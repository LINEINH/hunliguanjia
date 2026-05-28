# 婚庆服务平台 - C端小程序

基于 UniApp + Vue 3 + TypeScript + uView Plus + Pinia 技术栈开发的婚庆服务平台C端小程序。

## 项目简介

本平台为备婚用户提供一站式婚庆服务,包括:
- 🏨 婚礼酒店、策划、主持、跟妆、摄像、摄影、婚纱礼服、婚车租赁等8大类服务产品展示与咨询
- 💼 婚礼管家服务在线购买
- 🎪 婚博会活动报名、签到、抽奖(微信红包实时到账)
- 🎫 优惠券领取与线下核销
- 📅 婚礼计划表与倒计时提醒

## 技术栈

- **框架**: UniApp (Vue 3)
- **语言**: TypeScript
- **状态管理**: Pinia
- **UI组件库**: uView Plus
- **样式预处理**: SCSS
- **构建工具**: Vite

## 目录结构

```
src/
├── pages/                    # 页面目录
│   ├── index/               # 首页
│   ├── merchant-list/       # 商家列表
│   ├── merchant-detail/     # 商家详情
│   ├── product-list/        # 产品列表(8类服务)
│   ├── product-detail/      # 产品详情
│   ├── butler/              # 婚礼管家
│   ├── butler-order/        # 管家订单
│   ├── expo/                # 婚博会列表
│   ├── expo-detail/         # 婚博会详情
│   ├── lottery/             # 抽奖活动
│   ├── user/                # 用户中心
│   ├── my-coupon/           # 我的优惠券
│   ├── my-order/            # 我的订单
│   ├── wedding-plan/        # 婚礼计划表
│   └── login/               # 登录授权
├── components/              # 公共组件
│   ├── navbar/             # 导航栏
│   ├── merchant-card/      # 商家卡片
│   ├── product-card/       # 产品卡片
│   ├── expo-card/          # 婚博会卡片
│   ├── coupon-card/        # 优惠券卡片
│   └── ...
├── store/                  # Pinia状态管理
│   ├── modules/
│   │   ├── user.ts         # 用户状态
│   │   ├── coupon.ts       # 优惠券状态
│   │   ├── expo.ts         # 婚博会状态
│   │   └── order.ts        # 订单状态
│   └── index.ts
├── api/                    # API接口
│   ├── request.ts          # 请求封装
│   ├── merchant.ts         # 商家接口
│   ├── product.ts          # 产品接口
│   ├── butler.ts           # 管家接口
│   ├── expo.ts             # 婚博会接口
│   ├── lottery.ts          # 抽奖接口
│   ├── coupon.ts           # 优惠券接口
│   └── user.ts             # 用户接口
├── types/                  # TypeScript类型定义
│   ├── merchant.ts
│   ├── product.ts
│   ├── butler.ts
│   ├── expo.ts
│   ├── lottery.ts
│   ├── coupon.ts
│   ├── user.ts
│   └── api.ts
├── utils/                  # 工具函数
│   ├── format.ts           # 格式化
│   ├── storage.ts          # 本地存储
│   ├── validate.ts         # 表单验证
│   └── auth.ts             # 登录授权
├── styles/                 # 全局样式
│   ├── variables.scss      # SCSS变量
│   ├── mixins.scss         # SCSS混入
│   └── common.scss         # 公共样式
├── static/                 # 静态资源
├── App.vue
├── main.ts
├── pages.json              # 路由配置
└── manifest.json           # 应用配置
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7 或 yarn
- HBuilderX (推荐) 或 Vue CLI

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.development` 和 `.env.production` 文件:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 运行项目

```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# 使用HBuilderX运行
# 打开项目目录 -> 运行 -> 运行到小程序模拟器
```

### 构建发布

```bash
# 构建H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin
```

## 核心业务模块

### 1. 服务产品展示

- 8大服务分类: 婚礼酒店、策划、主持、跟妆、摄像、摄影、婚纱礼服、婚车租赁
- 产品展示、筛选、排序
- 产品详情(图片、视频、富文本介绍)
- 收藏功能

### 2. 商家管理

- 商家列表与详情
- 商家案例展示
- 一键拨号
- 商家评分与数据统计

### 3. 婚礼管家

- 管家服务展示
- 在线购买(微信支付)
- 订单管理
- 服务完成确认

### 4. 婚博会活动

- 活动列表与详情
- 在线报名
- 个人入场二维码生成
- 现场扫码签到
- 抽奖活动(微信红包实时到账)

### 5. 优惠券系统

- 优惠券领取
- 我的优惠券管理
- 核销码展示
- 线下核销(商家端小程序)

### 6. 用户中心

- 微信一键登录
- 用户信息管理
- 订单管理
- 婚礼计划表

## 开发规范

### TypeScript 使用

- 所有 Vue 组件使用 `<script setup lang="ts">`
- Props 使用 TypeScript 接口定义
- API 响应使用泛型确保类型安全
- 所有数据模型在 `types/` 目录中定义

### 组件命名

- 组件文件夹使用 kebab-case: `merchant-card`
- 组件文件使用 PascalCase: `MerchantCard.vue`
- 使用 easycom 自动引入,无需手动 import

### 样式规范

- 使用 SCSS 预处理器
- 全局变量在 `styles/variables.scss` 中定义
- 使用 rpx 单位适配不同屏幕
- 遵循 BEM 命名规范

### API 调用

```typescript
// 使用封装的 request 方法
import { getMerchantList } from '@/api/merchant'

// 自动附加 token,统一错误处理
const merchants = await getMerchantList({ page: 1, pageSize: 10 })
```

### 状态管理

```typescript
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 访问状态
console.log(userStore.nickname)

// 调用 action
await userStore.login(code)
```

## API 接口说明

所有接口在 `src/api/` 目录下统一管理,已封装请求拦截器和响应拦截器。

### 接口列表

- **商家**: `getMerchantList`, `getMerchantDetail`, `getMerchantCases`
- **产品**: `getProductList`, `getProductDetail`, `favoriteProduct`
- **管家**: `getButlerList`, `createButlerOrder`, `confirmComplete`
- **婚博会**: `getExpoList`, `registerExpo`, `getExpoQrcode`
- **抽奖**: `getLotteryActivity`, `joinLottery`, `getLotteryRecords`
- **优惠券**: `getCouponList`, `receiveCoupon`, `getMyCoupons`
- **用户**: `login`, `getUserInfo`, `updateUserInfo`

## 常见问题

### 1. 微信登录授权

确保在 `manifest.json` 中配置了正确的微信小程序 AppID。

### 2. 微信支付

- 在后台配置微信支付商户号
- 管家订单支付调用 `uni.requestPayment`
- 支付成功后更新订单状态

### 3. 红包发放

- 后端调用微信支付商家转账到零钱接口
- 前端展示中奖结果
- 失败时提供客服联系方式

### 4. TabBar 图标

需要在 `static/tabbar/` 目录下放置对应的图标文件。

### 5. 页面装修

首页支持后台动态配置组件,后续可实现拖拽式页面装修。

## 后续规划

- [ ] 对接真实后端 API
- [ ] 实现页面装修动态渲染
- [ ] 集成微信支付(管家订单)
- [ ] 集成微信红包接口
- [ ] 商家核销小程序开发
- [ ] 员工签到小程序开发
- [ ] 数据统计图表
- [ ] 消息推送(婚礼计划提醒)
- [ ] 头像审核功能
- [ ] 收藏列表、浏览历史

## 项目维护

如有问题或建议,请联系项目维护团队。

---

**注意**: 本项目仅供内部使用,请勿外传。

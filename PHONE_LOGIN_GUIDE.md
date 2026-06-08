# 微信手机号授权登录功能说明

## 📱 功能概述

已实现微信小程序手机号授权登录功能，用户可以通过一键获取手机号的方式快速登录。

---

## ✅ 已完成的工作

### 1. 登录页面改造 (`src/pages/login/login.vue`)

**主要改动：**
- 将普通按钮改为 `<button open-type="getPhoneNumber">` 组件
- 添加 `@getphonenumber` 事件处理函数
- 实现完整的手机号授权流程

**核心流程：**
```
用户点击按钮 
  ↓
微信弹出授权弹窗
  ↓
用户同意授权
  ↓
获取 phoneCode（手机号授权码）
  ↓
执行微信登录获取 token
  ↓
使用 phoneCode 绑定手机号
  ↓
同步用户信息
  ↓
登录成功，跳转首页
```

### 2. API 接口添加 (`src/api/user.ts`)

新增接口：
```typescript
/**
 * 手机号授权登录
 */
export function loginWithPhone(phoneCode: string) {
  return request<{ success: boolean }>({
    url: '/wechat/bind-phone',
    method: 'POST',
    data: { code: phoneCode }
  })
}
```

---

## 🔧 后端接口要求

需要后端提供以下接口：

### 接口1：绑定手机号
- **URL**: `/wechat/bind-phone`
- **Method**: `POST`
- **Headers**: 需要携带 token（在 Authorization header 中）
- **Request Body**:
  ```json
  {
    "code": "手机号授权码"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```

**后端处理逻辑：**
1. 接收前端传来的 `code`（手机号授权码）
2. 使用微信提供的 API 换取手机号：
   ```javascript
   // 后端示例（Node.js）
   const accessToken = await getAccessToken(); // 获取小程序 access_token
   const result = await axios.post(
     `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
     { code: phoneCode }
   );
   
   const phoneNumber = result.data.phone_info.phoneNumber;
   ```
3. 将手机号绑定到当前用户账号
4. 更新用户信息

---

## 📋 使用说明

### 前端配置

1. **确保 manifest.json 中配置了正确的 AppID**
   ```json
   {
     "mp-weixin": {
       "appid": "你的小程序AppID"
     }
   }
   ```

2. **在微信公众平台配置服务器域名**
   - 登录 [微信公众平台](https://mp.weixin.qq.com/)
   - 进入"开发" → "开发管理" → "开发设置"
   - 配置 request 合法域名（你的后端API域名）

### 测试步骤

1. **启动开发服务器**
   ```bash
   npm run dev:mp-weixin
   ```

2. **在微信开发者工具中导入项目**
   - 项目目录：`dist/dev/mp-weixin`
   - 使用测试号或正式号

3. **测试登录流程**
   - 打开登录页面
   - 勾选用户协议
   - 点击"一键获取手机号登录"按钮
   - 微信会弹出授权弹窗
   - 点击"允许"
   - 等待登录完成

---

## ⚠️ 注意事项

### 1. 手机号获取限制

- **每个用户每月最多获取5次**（微信限制）
- 必须是**已认证的小程序**才能使用此功能
- 需要在**真机**上测试，模拟器可能无法正常工作

### 2. 用户体验优化

当前实现已包含：
- ✅ 加载状态提示
- ✅ 错误处理
- ✅ 用户协议验证
- ✅ 友好的错误提示

### 3. 安全性考虑

- phoneCode **一次性有效**，使用后失效
- 建议后端验证 code 的有效性
- Token 需要妥善保存和处理

---

## 🐛 常见问题

### Q1: 点击按钮没有反应？

**可能原因：**
1. 未勾选用户协议（按钮被禁用）
2. 未在真机上测试
3. AppID 配置错误

**解决方案：**
- 确认已勾选协议
- 使用真机测试
- 检查 manifest.json 中的 AppID

### Q2: 提示"获取手机号失败"？

**可能原因：**
1. 后端接口未实现或返回错误
2. 网络请求失败
3. Code 已过期或无效

**解决方案：**
- 检查后端接口是否正常
- 查看控制台网络请求
- 确认后端正确处理了 code

### Q3: 登录后用户信息为空？

**可能原因：**
- 后端未正确返回用户信息
- syncUserInfo 接口调用失败

**解决方案：**
- 检查 `/wechat/me` 接口
- 查看控制台日志

---

## 📝 代码关键点

### 1. 按钮配置
```vue
<button
  open-type="getPhoneNumber"
  @getphonenumber="handleGetPhoneNumber"
>
  一键获取手机号登录
</button>
```

### 2. 事件处理
```typescript
async function handleGetPhoneNumber(e: any) {
  // 检查用户是否授权
  if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
    // 用户拒绝
    return;
  }
  
  // 获取授权码
  const { code } = e.detail;
  
  // 使用 code 换取手机号
  await bindPhoneNumber(code);
}
```

### 3. 完整流程
```typescript
// 1. 微信登录获取 token
await performWxLogin();

// 2. 绑定手机号
await bindPhoneNumber(phoneCode);

// 3. 同步用户信息
await userStore.syncUserInfo();
```

---

## 🎯 后续优化建议

1. **添加 loading 动画**
   - 在获取手机号时显示全屏 loading

2. **错误重试机制**
   - 网络失败时提供重试按钮

3. **登录状态持久化**
   - 确保刷新后仍保持登录状态

4. **多登录方式**
   - 保留原有的 code 登录方式作为备选

5. **用户引导**
   - 首次使用时显示授权说明

---

## 📞 技术支持

如果遇到问题，请检查：
1. 微信开发者工具控制台日志
2. 后端接口返回数据
3. 网络请求是否正常
4. AppID 和服务器配置是否正确

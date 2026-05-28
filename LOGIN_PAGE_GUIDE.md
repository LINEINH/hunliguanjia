# 登录页面功能说明

## 📱 页面效果预览

**访问地址**: http://localhost:5173/#/pages/login/login

## ✨ 功能特性

### 1. 视觉设计
- **渐变背景**: 从浅粉色(#FFF5F2)到浅灰色(#F8F8F8)的优雅渐变
- **品牌展示**: Logo + 标题 + 副标题的经典布局
- **渐变按钮**: 从婚庆红(#E8380D)到浅红(#FF6B6B)的渐变色
- **阴影效果**: 按钮带有柔和的红色阴影,增强立体感
- **圆角设计**: 统一的圆角风格,现代感十足

### 2. 核心功能

#### 微信一键登录
- 调用微信登录接口获取 code
- 将 code 发送到后端换取 token
- 保存 token 和用户信息到本地存储
- 更新 Pinia 状态管理
- 登录成功后自动跳转

#### 用户协议
- 必须勾选协议才能登录
- 未勾选时显示提示
- 点击协议链接查看详细内容
- 使用 uView Modal 弹窗展示

#### 加载状态
- 登录中按钮显示"登录中..."
- 按钮禁用防止重复点击
- 登录成功后延迟跳转,显示成功提示

#### 错误处理
- 用户取消授权: 友好提示
- 网络错误: 明确提示检查网络
- 其他错误: 通用错误提示
- 所有错误都不影响按钮后续使用

### 3. 交互细节

#### 按钮交互
```
默认状态: 渐变色 + 阴影 + 白色文字
↓ 点击
加载状态: 禁用 + "登录中..."
↓ 成功
成功提示: Toast "登录成功"
↓ 1.5秒后
页面跳转: 返回上一页或首页
```

#### 协议勾选
```
未勾选 → 点击登录 → Toast "请先同意用户协议"
已勾选 → 点击登录 → 执行登录流程
```

### 4. 页面跳转逻辑

```javascript
// 登录成功后的跳转逻辑
const pages = getCurrentPages()
if (pages.length > 1) {
  // 有上一页,返回
  uni.navigateBack()
} else {
  // 直接访问登录页,跳转到首页
  uni.switchTab({ url: '/pages/index/index' })
}
```

### 5. 状态管理集成

#### Pinia User Store
```typescript
// 登录前
isLoggedIn: false
userInfo: null
token: null

// 登录后
isLoggedIn: true
userInfo: { id, nickname, avatar, ... }
token: "xxx"
```

#### 本地存储
```javascript
// 登录成功后自动保存
uni.setStorageSync('token', token)
uni.setStorageSync('userInfo', userInfo)
```

### 6. 样式规范

#### 使用的 SCSS 变量
```scss
$primary-color: #E8380D;      // 婚庆红
$secondary-color: #FF6B6B;    // 浅红
$text-secondary: #999999;     // 次要文字
$spacing-xl: 48rpx;           // 大间距
$radius-lg: 24rpx;            // 大圆角
$font-lg: 36rpx;              // 大字体
```

#### 响应式设计
- 使用 rpx 单位适配不同屏幕
- 弹性布局(flex)自适应
- 最小高度 100vh 确保全屏显示

### 7. 与其他页面的衔接

#### 从用户中心跳转
```
用户中心 → 点击"点击登录" → 登录页 → 登录成功 → 返回用户中心
```

#### 从其他页面跳转
```
任意页面 → 需要登录的操作 → 登录页 → 登录成功 → 返回原页面
```

#### 直接访问
```
浏览器输入登录页URL → 登录成功 → 跳转到首页(TabBar)
```

## 🔧 技术实现

### 核心代码

#### 登录函数
```typescript
async function handleWxLogin() {
  // 1. 验证协议
  if (!agreedToTerms.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }

  try {
    // 2. 设置加载状态
    isLoading.value = true
    
    // 3. 调用微信登录
    await wxLogin()
    
    // 4. 显示成功提示
    uni.showToast({ title: '登录成功', icon: 'success' })
    
    // 5. 延迟跳转
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    }, 1500)
    
  } catch (error) {
    // 6. 错误处理
    uni.showToast({ title: errorMessage, icon: 'none' })
  } finally {
    // 7. 恢复按钮状态
    isLoading.value = false
  }
}
```

### 依赖的工具函数

#### wxLogin (src/utils/auth.ts)
```typescript
export async function wxLogin(): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async (loginRes) => {
        if (loginRes.code) {
          const userStore = useUserStore()
          await userStore.login(loginRes.code)
          resolve()
        } else {
          reject(new Error('登录失败'))
        }
      },
      fail: (err) => reject(err)
    })
  })
}
```

### API 调用流程

```
用户点击登录按钮
  ↓
调用 wxLogin()
  ↓
uni.login() 获取 code
  ↓
调用 userStore.login(code)
  ↓
调用 loginApi(code) (src/api/user.ts)
  ↓
POST /api/user/login { code }
  ↓
后端返回 { token, userInfo }
  ↓
保存到 store 和本地存储
  ↓
登录成功,页面跳转
```

## 📊 测试建议

### H5 环境测试
1. 打开浏览器访问 http://localhost:5173/#/pages/login/login
2. 检查页面布局和样式
3. 测试协议勾选功能
4. 测试按钮点击效果
5. 查看控制台日志

### 微信小程序环境测试
1. 使用微信开发者工具打开项目
2. 测试真实的微信登录流程
3. 测试登录后的页面跳转
4. 测试状态同步

### 断点调试
在以下位置设置断点:
- handleWxLogin 函数入口
- wxLogin 调用处
- catch 错误处理处
- 页面跳转前

## 🎯 后续优化建议

1. **添加动画效果**
   - Logo 淡入动画
   - 按钮点击动画
   - 页面切换动画

2. **增强用户体验**
   - 添加登录页背景图
   - 优化加载状态展示
   - 添加登录失败重试功能

3. **功能扩展**
   - 添加手机号登录
   - 添加账号密码登录
   - 添加注册功能

4. **性能优化**
   - Logo 图片压缩
   - 预加载下一页资源
   - 优化首屏渲染

---

**开发完成时间**: 2026年4月29日
**技术栈**: Vue 3 + TypeScript + uView Plus + Pinia
**页面路径**: src/pages/login/login.vue

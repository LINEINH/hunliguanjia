# 小程序主包体积优化指南

## 📊 当前问题分析

根据检测，你的小程序主包超过1.5M限制，主要原因：

1. **所有页面都在主包** - 没有使用分包配置（已修复✅）
2. **大尺寸图片** - 发现3张超过100K的图片需要优化
   - `test.png`: 320K
   - `post1.png`: 320K  
   - `bg4.png`: 123K
3. **依赖包体积** - uView Plus UI库占用一定空间

---

## ✅ 已完成优化

### 1. 分包配置（减少约60-80%主包体积）

已将非 tabBar 页面移到分包中：

**主包保留页面**（4个tabBar页面）：
- pages/index/index
- pages/merchant/merchant-list
- pages/expo/expo
- pages/user/user

**分包页面**（13个普通页面）：
- pages/index/case → 分包 pages/index
- pages/merchant/* (7个页面) → 分包 pages/merchant
- pages/expo/* (2个页面) → 分包 pages/expo
- pages/user/* (5个页面) → 分包 pages/user
- pages/login/login → 分包 pages/login

---

## 🔧 待执行优化

### 2. 图片资源优化（预计减少200-400K）

#### 方法一：使用在线工具压缩（推荐）

1. **TinyPNG** (https://tinypng.com/)
   - 支持 PNG/JPG 智能压缩
   - 可保持透明度
   - 压缩率通常可达50-70%

2. **Squoosh** (https://squoosh.app/)
   - Google出品的在线图片优化工具
   - 支持多种格式转换
   - 可实时预览效果

3. **ImageOptim** (Mac应用)
   - 本地批量处理
   - 无损压缩

#### 方法二：命令行工具（适合批量处理）

```bash
# 安装 imagemin
npm install -g imagemin-cli imagemin-pngquant

# 压缩PNG图片
imagemin src/static/images/*.png --out-dir=src/static/images/optimized

# 或使用 pngquant
pngquant --quality=65-80 src/static/images/*.png
```

#### 方法三：转换为WebP格式（体积可减少50-70%）

```bash
# 安装 cwebp
brew install webp

# 转换PNG为WebP
cwebp -q 80 src/static/images/test.png -o src/static/images/test.webp
```

然后在代码中使用：
```vue
<image src="/static/images/test.webp" mode="aspectFill"></image>
```

#### 针对你的项目建议优化的图片：

| 文件名 | 当前大小 | 建议操作 | 预期节省 |
|--------|---------|---------|---------|
| test.png | 320K | 压缩或转WebP | ~200K |
| post1.png | 320K | 压缩或转WebP | ~200K |
| bg4.png | 123K | 压缩或转WebP | ~80K |
| bg3.png | 88K | 适度压缩 | ~40K |

**总计预期节省：~520K**

---

### 3. 代码层面优化

#### 开启Vite构建优化

检查 `vite.config.ts`，确保以下配置：

```typescript
export default defineConfig({
  plugins: [uni()],
  build: {
    minify: 'terser',  // 启用代码压缩
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除console
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          uview: ['uview-plus']
        }
      }
    }
  }
})
```

#### 按需引入uView Plus

如果只使用了部分组件，可以配置按需引入：

在 `main.ts` 中：
```typescript
import uviewPlus from 'uview-plus'

// 只引入使用的组件
app.use(uviewPlus, {
  components: ['up-icon', 'up-button', 'up-input'] // 列出实际使用的组件
})
```

---

### 4. 其他优化建议

#### 移除未使用的文件
```bash
# 检查是否有未使用的图片
find src/static/images -name "*.png" -exec grep -r {} src/ \; | wc -l
```

#### 使用CDN加载大图
对于背景图等大尺寸资源，考虑上传到CDN：

```vue
<!-- 本地 -->
<view class="bg" style="background-image: url('/static/images/bg4.png')"></view>

<!-- CDN（推荐） -->
<view class="bg" style="background-image: url('https://cdn.example.com/bg4.png')"></view>
```

---

## 📝 操作步骤

### 第一步：重新编译测试分包效果

```bash
# 清除缓存
rm -rf dist/build/mp-weixin

# 重新编译
npm run build:mp-weixin
```

在微信开发者工具中：
1. 点击"详情" → "基本信息"
2. 查看"代码构成"中的主包和分包大小
3. 确认主包是否小于1.5M

### 第二步：如果仍然超限，优化图片

1. 下载需要优化的图片
2. 使用 TinyPNG 压缩
3. 替换原文件
4. 重新编译

### 第三步：验证上传

在微信开发者工具中点击"上传"，应该可以通过审核。

---

## 🎯 预期效果

| 优化项 | 预计减少体积 |
|--------|-------------|
| 分包配置 | 800K-1.2M |
| 图片压缩 | 400K-600K |
| 代码优化 | 100K-200K |
| **总计** | **1.3M-2M** |

---

## ⚠️ 注意事项

1. **分包后跳转路径不变** - uni.navigateTo 仍使用完整路径
2. **tabBar页面必须在主包** - 否则会导致切换异常
3. **静态资源全局共享** - static目录下的资源所有包都可访问
4. **重新编译生效** - 修改配置后必须重新编译
5. **清除缓存** - 微信开发者工具需要清除缓存后重新导入

---

## 📞 常见问题

**Q: 分包后页面跳转报错？**
A: 确保使用完整路径，如 `/pages/merchant/hotel`

**Q: 图片压缩后模糊？**
A: 调整压缩质量参数，建议在65-80之间平衡体积和质量

**Q: 如何查看各包的具体大小？**
A: 微信开发者工具 → 详情 → 基本信息 → 代码构成

**Q: uView Plus能否进一步减小体积？**
A: 可以尝试按需引入，但需要手动配置每个使用的组件

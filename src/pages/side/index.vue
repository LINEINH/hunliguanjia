<template>
  <view class="side-page">
    <up-navbar-mini
      @leftClick="leftClick"
      :autoBack="true"
      homeUrl="/pages/index/index"
    >
    </up-navbar-mini>
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="user-info">
        <image :src="userProfile.logo" mode="aspectFill" class="user-avatar" />
        <view class="user-detail">
          <view class="user-top">
            <text class="user-nickname">{{ userProfile.name }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="card menu-list">
      <view class="menu-item" @click="navigateTo('/pages/side/product')">
        <image
          src="/static/images/11.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">服务商品库</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/side/coupon')">
        <image
          src="/static/images/40.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">优惠券管理</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="handleCouponScan(1)">
        <image
          src="/static/images/41.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">核销优惠券</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="handleCouponScan(2)">
        <image
          src="/static/images/42.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">核销商品</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
    </view>

    <view class="actions">
      <button class="btn-index btn-main">商家首页</button>

      <button class="btn-submit btn-main">在线咨询</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getMerchantInfo } from "@/api/user";

// 定义方法
const leftClick = () => {
  console.log("leftClick");
  // 返回上一页
  uni.navigateBack();
};

// 定义用户对象
const userProfile = ref<any>(null);
// 获取用户信息
async function loadUserInfo() {
  // 检查是否有 token

  try {
    const userInfo: any = await getMerchantInfo();
    // 更新 store 中的用户信息

    console.log("用户信息:", userInfo);
    // 更新用户信息对象
    userProfile.value = userInfo;
  } catch (error) {
    console.error("获取商家信息失败:", error);
  }
}

// 导航
function navigateTo(url: string) {
  uni.navigateTo({ url });
}

// 核销优惠券 - 扫描二维码
function handleCouponScan(index: number) {
  console.log("=== 开始扫码 ===");

  // 调用微信扫码API
  uni.scanCode({
    onlyFromCamera: true, // 只允许从相机扫码
    scanType: ["qrCode"], // 只识别二维码
    success: (res) => {
      console.log("=== 扫码成功 ===");
      console.log("完整返回:", JSON.stringify(res));

      // 获取扫码结果（微信小程序使用 path 字段）
      const scanResult = res.path || res.result || "";
      console.log("扫码结果内容:", scanResult);
      console.log("扫码结果类型:", typeof scanResult);

      if (!scanResult) {
        console.error("扫码结果为空！");
        uni.showModal({
          title: "提示",
          content: "未能获取到二维码信息，请重试",
          showCancel: false,
        });
        return;
      }

      // 显示扫码成功提示
      uni.showToast({
        title: "扫码成功",
        icon: "success",
        duration: 1500,
      });

      // 尝试解析参数（支持两种格式）
      let code = "";
      let type = "";

      try {
        // 格式1: 普通URL参数 ?code=xxx&type=xxx
        const hasCodeParam =
          scanResult.includes("?code=") || scanResult.includes("&code=");
        const hasTypeParam =
          scanResult.includes("?type=") || scanResult.includes("&type=");

        if (hasCodeParam && hasTypeParam) {
          console.log("检测到普通URL参数格式");
          // 提取查询字符串
          let queryString = "";
          if (scanResult.includes("?")) {
            queryString = scanResult.split("?")[1];
          } else {
            queryString = scanResult;
          }

          console.log("查询字符串:", queryString);

          // 手动解析 URL 参数
          const params: any = {};
          const pairs = queryString.split("&");

          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1] || "");
            params[key] = value;
          }

          console.log("解析后的参数对象:", params);
          code = params.code || "";
          type = params.type || "";
        }
        // 格式2: 微信小程序 scene 参数 ?scene=xxx
        else if (
          scanResult.includes("?scene=") ||
          scanResult.includes("&scene=")
        ) {
          console.log("检测到 scene 参数格式");

          // 提取 scene 参数值
          let sceneValue = "";
          if (scanResult.includes("?scene=")) {
            sceneValue = scanResult.split("?scene=")[1].split("&")[0];
          } else {
            const parts = scanResult.split("&scene=");
            sceneValue = parts[parts.length - 1].split("&")[0];
          }

          console.log("scene 原始值:", sceneValue);

          // URL 解码 scene 参数
          const decodedScene = decodeURIComponent(sceneValue);
          console.log("scene 解码后:", decodedScene);

          // 解析 scene 中的参数 (格式: t=coupon&c=CP20260611527294)
          const sceneParams: any = {};
          const scenePairs = decodedScene.split("&");

          for (let i = 0; i < scenePairs.length; i++) {
            const pair = scenePairs[i].split("=");
            const key = pair[0].trim();
            const value = pair[1] ? pair[1].trim() : "";
            sceneParams[key] = value;
          }

          console.log("scene 参数对象:", sceneParams);

          // 映射参数：t -> type, c -> code
          type = sceneParams.t || sceneParams.type || "";
          code = sceneParams.c || sceneParams.code || "";
        }
        // 格式3: 直接包含 t= 和 c= 参数
        else if (scanResult.includes("t=") && scanResult.includes("c=")) {
          console.log("检测到直接参数格式");

          const params: any = {};
          let queryString = scanResult;
          if (scanResult.includes("?")) {
            queryString = scanResult.split("?")[1];
          }

          const pairs = queryString.split("&");
          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            const key = decodeURIComponent(pair[0]).trim();
            const value = decodeURIComponent(pair[1] || "").trim();
            params[key] = value;
          }

          console.log("解析后的参数对象:", params);
          type = params.t || params.type || "";
          code = params.c || params.code || "";
        }

        console.log("=== 最终解析结果 ===");
        console.log("code:", code);
        console.log("type:", type);
        console.log("code 长度:", code.length);
        console.log("type 长度:", type.length);

        if (!code || !type) {
          console.error("参数为空！");
          uni.showModal({
            title: "提示",
            content: `参数解析失败\ncode: ${code}\ntype: ${type}\n\n原始二维码: ${scanResult}`,
            showCancel: false,
          });
          return;
        }

        // 构造跳转 URL
        const text = index === 1 ? "scancode" : "scanproduct";
        const targetUrl = `/pages/side/${text}?code=${code}&type=${type}`;
        console.log("准备跳转到:", targetUrl);

        // 显示即将跳转的提示
        uni.showToast({
          title: "正在跳转...",
          icon: "loading",
          duration: 1000,
        });

        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          console.log("执行跳转...");
          uni.navigateTo({
            url: targetUrl,
            success: () => {
              console.log("跳转成功！");
            },
            fail: (err) => {
              console.error("跳转失败:", err);
              uni.showModal({
                title: "跳转失败",
                content: JSON.stringify(err),
                showCancel: false,
              });
            },
          });
        }, 1000);
      } catch (error) {
        console.error("解析参数异常:", error);
        uni.showModal({
          title: "解析错误",
          content: String(error),
          showCancel: false,
        });
      }
    },
    fail: (err) => {
      console.error("=== 扫码失败 ===");
      console.error("错误信息:", err);
      console.error("错误消息:", err.errMsg);

      // 用户取消扫码不提示错误
      if (err.errMsg && !err.errMsg.includes("cancel")) {
        uni.showToast({
          title: "扫码失败，请重试",
          icon: "none",
        });
      }
    },
  });
}

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<style lang="scss" scoped>
.side-page {
  .user-header {
    //引入背景图片
    background: linear-gradient(180deg, #f1daa6 0%, #eac47b 100%);
    padding: 70rpx 24rpx;
    .user-info {
      display: flex;
      align-items: center;
      padding-top: 140rpx;
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: $radius-round;
        margin-right: $spacing-md;
      }

      .user-detail {
        flex: 1;
        .user-nickname {
          display: block;
          font-size: $font-lg;
          font-weight: bold;
          color: #000;
          margin-bottom: $spacing-xs;
        }
        .user-top {
          display: flex;
          align-items: center;
        }
        .user-icon {
          width: 40rpx;
          height: 40rpx;
          margin-left: $spacing-sm;
        }
        .user-date {
          font-size: $font-md;
          color: #808080;
        }

        .user-tip {
          font-size: $font-sm;
          color: $text-secondary;
        }
      }
    }
    .user-intro {
      margin-top: $spacing-md;
      background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/10/6a28ec100de21.png");
      background-size: cover;
      background-position: center;
      border-radius: 20rpx;
      padding: 48rpx 32rpx;
      .user-intro-title {
        display: flex;
        align-items: center;
        margin-bottom: $spacing-md;
        .user-icon {
          width: 40rpx;
          height: 40rpx;
          margin-right: $spacing-sm;
        }
        .user-intro-title-text {
          font-size: $font-md;
          color: #e9cc90;
          margin-right: $spacing-sm;
        }
        .user-primary {
          border-radius: 40rpx;
          background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
          color: #612500;
          font-size: $font-sm;
          padding: 6rpx 24rpx;
        }
      }
      .user-intro-content {
        font-size: $font-sm;
        color: #fff;
        line-height: 1.5;
        /* 多行文本省略 */
      }
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 40rpx;
      margin-right: $spacing-md;
    }
    .menu-image {
      width: 40rpx;
      height: 40rpx;
      margin-right: $spacing-md;
    }

    .menu-text {
      flex: 1;
      font-size: $font-md;
      color: $text-primary;
    }

    .menu-arrow {
      font-size: 40rpx;
      color: $text-secondary;
    }
  }
  .actions {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding-top: 40rpx;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-main {
      width: 340rpx;
      height: 84rpx;
      line-height: 84rpx;
      border: none;
      border-radius: 20rpx;
      font-size: 30rpx;
      border: none;
    }
    .btn-submit {
      background: linear-gradient(
        136.06deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
      color: #612500;
    }
    .btn-index {
      color: #808080;
      background: linear-gradient(
          0deg,
          rgba(229, 229, 229, 1),
          rgba(229, 229, 229, 1)
        ),
        linear-gradient(135deg, #f1daa6 0%, #f9eccc 33.03%, #e9cc90 100%);
    }
  }
}

.card {
  padding: 0;
  margin: 24rpx;
}
</style>
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
      <view class="menu-item" @click="showCode()">
        <image
          src="/static/images/42.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">展会二维码</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
    </view>

    <view class="actions">
      <button class="btn-index btn-main" @click="openDetail()">商家首页</button>

      <button class="btn-submit btn-main" open-type="contact">在线咨询</button>
    </view>

    <up-popup
      :show="show"
      mode="center"
      :round="10"
      @close="close"
      @open="open"
      closeable="true"
    >
      <view>
        <image :src="codeUrl" mode="aspectFill" class="codeimage"></image>
      </view>
    </up-popup>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getMerchantInfo, qrcode } from "@/api/user";

// 定义方法
const leftClick = () => {
  console.log("leftClick");
  // 返回上一页
  uni.navigateBack();
};

function openDetail() {
  uni.navigateTo({
    url: `/pages/merchant/hotelDetail?id=${userProfile.value.id}`,
  });
}
// 创建响应式数据
const show = ref(false);

const codeUrl = ref("");

function open() {
  // 打开逻辑，比如设置 show 为 true
  show.value = true;
  // console.log('open');
}

function openCode(url: any) {
  codeUrl.value = url;
  open();
}

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
  console.log("扫码类型:", index === 1 ? "优惠券" : "商品");

  // 显示加载提示
  uni.showLoading({
    title: "正在启动相机...",
    mask: true,
  });

  // 调用微信扫码API（支持多种二维码类型）
  uni.scanCode({
    onlyFromCamera: true, // 只允许从相机扫码
    scanType: ["qrCode", "barCode", "datamatrix", "pdf417", "wxCode"], // 支持多种码类型，包括小程序码
    autoDecodeCharset: true, // 自动识别字符集
    success: (res) => {
      // 隐藏加载提示
      uni.hideLoading();

      console.log("=== 扫码成功 ===");
      console.log("完整返回:", JSON.stringify(res));
      console.log("scanType:", res.scanType);
      console.log("charSet:", res.charSet);

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
        const typeText = index === 1 ? "coupon" : "product";
        const targetUrl = `/pages/side/${text}?code=${code}&type=${typeText}`;
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
      // 隐藏加载提示
      uni.hideLoading();

      console.error("=== 扫码失败 ===");
      console.error("错误信息:", err);
      console.error("错误消息:", err.errMsg);

      // 用户取消扫码不提示错误
      if (err.errMsg && err.errMsg.includes("cancel")) {
        console.log("用户取消扫码");
        return;
      }

      // 其他错误，显示详细信息
      uni.showModal({
        title: "扫码失败",
        content: `错误信息: ${
          err.errMsg || "未知错误"
        }\n\n可能原因:\n1. 相机权限未授权\n2. 光线太暗\n3. 二维码模糊或损坏`,
        showCancel: false,
        confirmText: "知道了",
      });
    },
  });
}

function close() {
  // 关闭逻辑，设置 show 为 false
  show.value = false;
  // console.log('close');
}

// 点击showcode调用接口 qrcode
function showCode() {
  qrcode().then((res) => {
    console.log(res);
    if (res) {
      codeUrl.value = res.qr_code;
      show.value = true;
    }
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
.codeimage {
  width: 500rpx;
  height: 500rpx;
  margin: 20rpx;
  display: block;
}
</style>
<template>
  <view class="user-gift-page">
    <view v-if="loading" class="loading">签到中...</view>
    <view v-else-if="success" class="success">
      <text class="success-icon">✓</text>
      <text class="success-text">签到成功</text>
      <text class="tip-text">即将返回首页</text>
    </view>
    <view v-else-if="error" class="error">
      <text class="error-icon">✗</text>
      <text class="error-text">未报名该活动</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { checkin } from "@/api/expo";

const loading = ref(true);
const success = ref(false);
const error = ref(false);
const errorMsg = ref("");

// 获取页面参数
function getPageParams() {
  const pages = getCurrentPages();
  const currentPage: any = pages[pages.length - 1];

  return {
    u: currentPage.options?.u || "",
    a: currentPage.options?.a || "",
  };
}

// 执行签到
async function handleCheckin() {
  try {
    const { u, a } = getPageParams();

    if (!u || !a) {
      throw new Error("缺少必要参数");
    }

    // 调用签到接口
    const res = await checkin(u, a);

    // 判断签到是否成功
    if (res) {
      // 签到成功
      loading.value = false;
      success.value = true;

      // 2秒后跳转到首页
      setTimeout(() => {
        uni.switchTab({
          url: "/pages/user/user",
        });
      }, 2000);
    } else {
      // 签到失败
      throw new Error(res.message || res.msg || "签到失败");
    }
  } catch (err: any) {
    loading.value = false;
    error.value = true;
    errorMsg.value = err.message || "签到失败，请重试";

    console.error("签到失败:", err);
  }
}

onLoad(() => {
  handleCheckin();
});

// 页面分享
onShareAppMessage(() => {
  return {
    title: "现场签到 - 壹嫁婚选",
    path: "/pages/expo/sign",
    imageUrl: "",
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "婚博会现场签到 - 壹嫁婚选",
    path: "/pages/expo/sign",
    imageUrl: "",
  };
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-gift-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.loading {
  font-size: 32rpx;
  color: #999;
}

.success {
  text-align: center;

  .success-icon {
    display: block;
    font-size: 120rpx;
    color: #52c41a;
    margin-bottom: 20rpx;
  }

  .success-text {
    display: block;
    font-size: 40rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .tip-text {
    display: block;
    font-size: 28rpx;
    color: #999;
  }
}

.error {
  text-align: center;

  .error-icon {
    display: block;
    font-size: 120rpx;
    color: #ff4d4f;
    margin-bottom: 20rpx;
  }

  .error-text {
    display: block;
    font-size: 32rpx;
    color: #ff4d4f;
  }
}
</style>

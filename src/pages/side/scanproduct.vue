<template>
  <view class="user-scan-page">
    <view class="status" v-if="couponInfo.status === 1">
      <up-icon
        name="checkmark-circle-fill"
        size="80"
        color="#EAC47B"
        class="icon"
      ></up-icon>
      <text class="text">已核销</text>
    </view>
    <view class="scanConcent">
      <view class="iteminfo">
        <view class="coupon-title">
          <text class="coupon-name">{{ couponInfo.gift_name }}</text>
          <text class="coupon-shop">{{ couponInfo.received_at }}</text>
        </view>
      </view>
      <view class="qrcode">
        <!-- <image src="/static/images/qrcode.png" mode=""></image> -->
        <view class="text">优惠券码：{{ couponInfo.redemption_code }}</view>
      </view>
    </view>
    <view class="summary">
      <view class="summary-item">
        <text class="summary-label">商户名称</text>
        <text class="summary-value">{{ couponInfo.merchant_name }}</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">领取渠道</text>
        <text class="summary-value">婚礼管家小程序领取</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">领取时间</text>
        <text class="summary-value">{{ couponInfo.received_at }}</text>
      </view>
    </view>
    <!-- <view class="cancel">作废此券</view> -->
    <view class="actions" v-if="couponInfo.status === 0">
      <button class="btn-submit" @click="submit">核销</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";

import { getCouponInfo, couponsVerify } from "@/api/user";

// 获取优惠券信息
const couponInfo = ref();
// 获取页面参数
function getPageParams() {
  const pages = getCurrentPages();
  const currentPage: any = pages[pages.length - 1];

  return {
    code: currentPage.options?.code || "",
    type: currentPage.options?.type || "",
  };
}

// 格式化日期
const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

// 执行签到
async function handleCheckin() {
  try {
    const { code, type } = getPageParams();

    if (!code || !type) {
      throw new Error("缺少必要参数");
    }

    // 调用签到接口
    const res = await getCouponInfo(code, type);
    console.log("签到结果:", res);
    // 判断签到是否成功
    if (res) {
      couponInfo.value = res;
    }
  } catch (err: any) {
    console.error("签到失败:", err);
  }
}

onMounted(() => {
  handleCheckin();
});
const submit = async () => {
  // 核销券码
  const { code, type } = getPageParams();
  const res = await couponsVerify(code, type);
  if (res) {
    uni.showToast({
      title: "核销成功",
      icon: "success",
      duration: 1500,
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-scan-page {
  background: #f0f0f0;
  min-height: 100vh;
  .status {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40rpx;
    .icon {
      margin-bottom: 20rpx;
    }
    text {
      font-size: 28rpx;
      color: #000000;
      margin-top: 20rpx;
    }
  }
  .scanConcent {
    background: #fff;
    padding: 30rpx;
    border-radius: 16rpx;
    margin: 20rpx;
    .iteminfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .coupon-title {
        display: flex;
        flex-direction: column;
        .coupon-name {
          font-size: 30rpx;
          font-weight: bold;
          color: #3f3f3f;
          margin-bottom: 10rpx;
        }
        .coupon-shop {
          font-size: 24rpx;
          color: #999999;
          margin-bottom: 10rpx;
        }
      }
      .coupon-price {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .coupon-price {
          font-size: 60rpx;
          color: #bf974a;
          font-weight: bold;
        }
        .coupon-get {
          font-size: 28rpx;
          color: #bf974a;
        }
      }
    }
  }
  .qrcode {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 20rpx;
    padding: 20rpx;
    image {
      width: 500rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
    .text {
      font-size: 32rpx;
      color: #000000;
    }
  }
  .summary {
    background: white;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 30rpx;
    .summary-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1px solid #a3aeb6;
      .summary-label {
        font-size: 28rpx;
        color: #a3aeb6;
        margin-right: 20rpx;
      }

      .summary-value {
        font-size: 28rpx;
        color: #383838;
      }
    }
    .summary-item:last-child {
      border-bottom: none;
    }
  }
  .cancel {
    margin: 40rpx;
    text-align: center;
    color: #bf974a;
  }
  .actions {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 32rpx 0;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    .btn-submit {
      width: 680rpx;
      height: 84rpx;
      line-height: 84rpx;
      background: linear-gradient(
        136.06deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
      color: #612500;
      border: none;
      border-radius: 42rpx;
      font-size: 30rpx;
    }
  }
}
</style>
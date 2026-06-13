<template>
  <view class="user-scan-page">
    <view class="scanConcent">
      <view class="iteminfo">
        <view class="coupon-title">
          <text class="coupon-name">测试测试</text>
          <text class="coupon-shop">123～345677</text>
        </view>
        <view class="coupon-price">
          <text class="coupon-price"
            ><text class="coupon-get">￥</text>200</text
          >
          <text class="coupon-get">满1000使用</text>
        </view>
      </view>
      <view class="qrcode">
        <image src="/static/images/qrcode.png" mode=""></image>
        <view class="text"> 123244544454 </view>
      </view>
    </view>
    <view class="summary">
      <view class="summary-item">
        <text class="summary-label">商户名称</text>
        <text class="summary-value">111</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">领取渠道</text>
        <text class="summary-value">婚礼管家小程序领取</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">领取时间</text>
        <text class="summary-value">2025.04.09 22:38:51</text>
      </view>
    </view>
    <view class="cancel">作废此券</view>
    <view class="actions">
      <button class="btn-submit" @click="submit">核销</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getMyCoupons } from "@/api/coupon";

const submit = async () => {
  if (!description.value.trim()) {
    uni.showToast({ title: "请填写问题描述", icon: "none" });
    return;
  }

  uni.showLoading({ title: "提交中" });

  try {
    // 提交投诉信息
    const payload = {
      merchant_id: 1,
      content: description.value,
      images: images.value,
      phone: contact.value,
    };

    await complaint(payload);

    uni.hideLoading();
    uni.showToast({ title: "提交成功，我们会尽快处理", icon: "success" });

    // 提交后清空表单
    description.value = "";
    images.value = [];
    contact.value = "";
  } catch (err) {
    uni.hideLoading();
    console.error("提交投诉失败", err);
    uni.showToast({ title: "提交失败，请重试", icon: "none" });
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-scan-page {
  background: #f0f0f0;
  min-height: 100vh;
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
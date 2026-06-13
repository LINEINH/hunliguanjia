<template>
  <view class="user-coupon-page">
    <view class="couponList">
      <view v-if="coupons.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
      <view class="couponTtem" v-for="item in coupons" :key="item.id">
        <view class="iteminfo">
          <view class="coupon-title">
            <text class="coupon-name">{{ item.name }}</text>
            <text class="coupon-shop">{{ item.merchant.name }}</text>
            <text class="coupon-shop"
              >{{ formatDate(item.start_time) }}～{{
                formatDate(item.end_time)
              }}</text
            >
          </view>
          <view class="coupon-price">
            <text class="coupon-price"
              ><text class="coupon-get">￥</text>{{ item.value }}</text
            >
            <text class="coupon-get">满{{ item.min_amount }}使用</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import { getMycoupon } from "@/api/user";

// 优惠券列表
const coupons = ref([]);

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
// 获取优惠券列表
const loadCoupons = async (status) => {
  try {
    const response = await getMycoupon();
    coupons.value = response.data || [];
  } catch (error) {
    console.error("获取优惠券列表失败:", error);
    uni.showToast({
      title: "获取优惠券失败",
      icon: "none",
    });
  }
};

onMounted(() => {
  loadCoupons();
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-coupon-page {
  background: #f0f0f0;
  min-height: 100vh;

  .tabview {
    background: #fff;
    padding: 20rpx 0;
  }
  .couponList {
    padding: 20rpx;
    .couponTtem {
      background: #fff;
      padding: 20rpx 40rpx;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      .iteminfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dashed #f1f1f1;
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
      .recipt {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20rpx;
        .recipt-rule {
          font-size: 28rpx;
          color: #999999;
        }
        .recipt-get {
          color: #612500;
          padding: 10rpx 20rpx;
          font-size: 28rpx;
          opacity: 1;
          border-radius: 30rpx;
          background: linear-gradient(
            135deg,
            #f1daa6 0%,
            #f9eccc 33.03%,
            #e9cc90 100%
          );
        }
      }
    }
  }
  .empty-state {
    margin-top: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .empty-text {
      text-align: center;
      font-size: 28rpx;
      color: #999999;
      margin-top: 50rpx;
    }
  }
}
</style>
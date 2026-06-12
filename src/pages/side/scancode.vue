<template>
  <view class="user-gift-page">
    <view class="giftlist">
      <view class="giftitem">
        <view class="giftimg">
          <image
            src="/static/images/post.png"
            mode="aspectFill"
            class="image"
          ></image>
        </view>
        <view class="giftinfo">
          <view class="giftname"> 红双喜手工串珠胸针 </view>
          <view class="gifttime"> 2025.04.09-2025.04.09 </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getMyCoupons } from "@/api/coupon";
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-gift-page {
  background: #f0f0f0;
  min-height: 100vh;
  .giftlist {
    margin: 20rpx;
    .giftitem {
      padding: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      background: #fff;
      border-radius: 20rpx;
      .giftimg {
        width: 150rpx;
        height: 150rpx;
        margin-right: 10rpx;
        .image {
          width: 152rpx;
          height: 152rpx;
        }
      }
      .giftinfo {
        .giftname {
          font-size: 28rpx;
          color: #333333;
          margin-bottom: 10rpx;
        }
        .gifttime {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }
}
</style>
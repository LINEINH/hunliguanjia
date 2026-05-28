<template>
  <view class="exchange-container">
    <view class="planItem">
      <view class="ad">
        <image
          src="/static/images/post1.png"
          mode="aspectFill"
          class="ad-image"
        />
      </view>
      <view class="moments-grid">
        <template v-for="(moment, index) in momentsList" :key="index">
          <view class="moment-item" @click="navigateToPlanItem()">
            <image
              :src="moment.image"
              class="moment-image"
              mode="aspectFill"
            ></image>
            <view class="moment-info">
              <text class="moment-title">{{ moment.title }}</text>

              <text class="moment-subtitle">含司仪、跟妆、摄影、摄像</text>
              <view class="moment-intro">
                <image
                  src="/static/images/29.png"
                  mode="aspectFill"
                  class="user-icon"
                ></image>
                <text class="user-name">测试测试</text>
                <view class="change">兑换</view>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { casesFeatured } from "@/api/index";
import type { Merchant } from "@/types/merchant";

const momentsList = ref<any>([
  {
    image: "/static/images/banner1.png",
    title: "浪漫婚礼现场浪漫婚礼现场浪漫婚礼现场浪漫婚礼现场",
    description: "精心布置的婚礼场地，见证幸福时刻",
  },
  {
    image: "/static/images/banner.png",
    title: "甜蜜婚纱照",
    description: "专业摄影师捕捉每一个动人瞬间",
  },
  {
    image: "/static/images/banner.png",
    title: "温馨家庭聚会",
    description: "亲朋好友共同见证的美好时光",
  },
  {
    image: "/static/images/banner.png",
    title: "梦幻婚礼策划",
    description: "量身定制的专属婚礼方案",
  },
]);

// 导航到商家列表
function navigateToPlanItem() {
  uni.navigateTo({ url: "/pages/merchant/planItem" });
}

// 加载数据
onMounted(() => {
  // TODO: 调用 API 加载数据
  console.log("首页加载");
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.exchange-container {
  .planItem {
    margin: $spacing-md;
    padding-bottom: 30rpx;
    .ad {
      margin-bottom: $spacing-md;
      .ad-image {
        width: 100%;
        height: 300rpx;
        border-radius: $radius-md;
      }
    }
  }

  .moments-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
    border-radius: 20rpx;
    .moment-item {
      background-color: #fff;
      border-radius: $radius-md;
      overflow: hidden;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

      .moment-image {
        width: 100%;
        height: 320rpx;
        display: block;
      }

      .moment-info {
        padding: $spacing-md;

        .moment-title {
          display: block;
          font-size: 28rpx;
          font-weight: bold;
          color: $text-primary;
          // 两行显示省略号
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          height: 74rpx;
        }
        .moment-subtitle {
          font-size: $font-xs;
          color: #808080;
          margin-top: 10rpx;
          // 一行显示隐藏
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .moment-intro {
          display: flex;
          align-items: center;
          padding-top: $spacing-sm;
          .user-icon {
            width: 30rpx;
            height: 30rpx;
            border-radius: 50%;
            margin-right: $spacing-sm;
          }
          .user-name {
            font-size: $font-xs;
            color: #383838;
            margin-right: auto;
          }
          .change {
            color: #bf974a;
            font-size: $font-xs;
            border: 1px solid #f0cd8c;
            padding: 10rpx 20rpx;
            border-radius: 30rpx;
          }
        }
      }
    }
  }
}
</style>
<template>
  <view class="butler-container">
    <!-- 轮播图 -->
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="planItem">
      <view class="intro">
        <view class="title">婚礼管家服务</view>
        <view class="subtitle"
          >十年婚礼经验，专属顾问一对一，让完美婚礼触手可及花小钱办大事，婚礼管家帮您省心省力更省钱</view
        >
        <view class="description"> 测试测试 </view>
      </view>

      <view class="cardBanner">
        <up-swiper
          :list="cardList"
          :autoplay="false"
          :circular="true"
          :indicator="true"
          :previousMargin="80"
          :nextMargin="80"
          :duration="500"
          :radius="10"
          height="380"
          @change="handleCardChange"
          bgColor="transparent"
        >
          <template #default="{ item }">
            <view class="card-item">
              <image :src="item.image" mode="aspectFill" class="card-image" />
              <view class="card-info">
                <view class="card-host">
                  <image
                    src="/static/images/user.png"
                    mode="aspectFill"
                    class="user-pic"
                  ></image>
                  <view class="card-host-info">
                    <view class="card-host-name">{{ item.name }}</view>
                    <view class="rate">
                      <text class="icon-star">4.4</text>
                      <text class="year"> 16年经验 </text>
                    </view>
                  </view>
                </view>
                <view class="card-footer">
                  <text class="card-price">¥{{ item.price }}</text>
                  <image
                    src="/static/images/like.png"
                    mode="aspectFill"
                    class="like"
                  ></image>
                </view>
              </view>
            </view>
          </template>
        </up-swiper>
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

// 轮播图数据
const banners = ref([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);

// 导航到商家列表
function navigateToPlanItem() {
  uni.navigateTo({ url: "/pages/merchant/planItem" });
}

const cardList = ref<any>([
  {
    image: "/static/images/banner1.png",
    name: "婚礼主持-晓腾",
    time: "16年经验",
    price: "1000起",
    rate: 4.5,
    avatar: "/static/images/user.png",
  },
  {
    image: "/static/images/banner.png",
    name: "婚礼主持-李晓腾",
    time: "16年经验",
    price: "1000起",
    rate: 3,
    avatar: "/static/images/user.png",
  },
  {
    image: "/static/images/banner1.png",
    name: "婚礼主持-张晓腾",
    time: "16年经验",
    price: "1000起",
    rate: 4,
    avatar: "/static/images/user.png",
  },
]);

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

const handleCardChange = () => {
  console.log(11);
};

// 加载数据
onMounted(() => {
  // TODO: 调用 API 加载数据
  console.log("首页加载");
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.butler-container {
  .banner {
    margin-bottom: $spacing-md;
    .banner-swiper {
      height: 320rpx;
      border-radius: $radius-md;
      overflow: hidden;
    }
    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
  .planItem {
    padding-bottom: 30rpx;
    .intro {
      background: #ffff;
      padding: $spacing-md;
      margin-bottom: $spacing-md;
      border-radius: 20rpx;
      margin: $spacing-md;
      .title {
        color: #eac47b;
        font-size: 36rpx;
        margin-bottom: $spacing-sm;
      }
      .subtitle {
        font-size: 28rpx;
        color: #383838;
      }
      .description {
        font-size: $font-xs;
        color: #808080;
        margin-top: 10rpx;
      }
    }
  }

  .cardBanner {
    margin: $spacing-md 0;
    background-image: url("/static/images/bg1.png");
    background-size: cover;
    background-position: center;
    padding: $spacing-md;
  }

  .card-item {
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
    height: 620rpx;
    margin: 0 10rpx;
  }

  .card-image {
    width: 100%;
    height: 420rpx;
    display: block;
  }

  .card-info {
    padding: $spacing-md $spacing-sm;
    .card-host {
      display: flex;
      align-content: center;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 20rpx;
      .user-pic {
        width: 68rpx;
        height: 68rpx;
      }
      .card-host-info {
        margin-left: 10rpx;
        .card-host-name {
          font-size: 28rpx;
        }
        .rate {
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-star {
            border-radius: 20rpx;
            background: linear-gradient(
              180deg,
              #f1daa6 0%,
              #f9eccc 33.03%,
              #e9cc90 100%
            );
            padding: 6rpx 20rpx;
            color: #d43030;
          }
          .year {
            font-size: 24rpx;
            color: #a6a6a6;
          }
        }
      }
    }
  }

  .card-name {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10rpx;
  }

  .card-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #bf974a;
  }

  .like {
    width: 30rpx;
    height: 30rpx;
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
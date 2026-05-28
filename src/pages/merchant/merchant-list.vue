<template>
  <view class="merchant-list-page">
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="category-grid">
      <view
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @click="navigateToCategory(category)"
      >
        <image :src="category.icon" class="category-icon" />
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>
    <view class="goods-list">
      <view class="goods-item" v-for="(item, index) in goodsList" :key="index">
        <view class="tag">婚礼策划 </view>
        <image :src="item.image" class="goods-image" mode="aspectFill" />
        <view class="goods-info">
          <view class="goods-name">{{ item.name }}</view>
          <view class="goods-intro">
            <image
              src="/static/images/user.png"
              mode="aspectFill"
              class="user-icon"
            ></image>
            <text class="user-name">{{ item.price }}</text>
            <image
              src="/static/images/like.png"
              mode="aspectFill"
              class="like"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 自定义 TabBar -->
    <!-- <custom-tabbar :current="1" /> -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// TODO: 实现商家列表功能
// 轮播图数据
const banners = ref([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);
// 服务分类
const categories = ref([
  {
    id: 1,
    name: "婚纱照",
    icon: "/static/images/19.png",
    path: "/pages/product-list/product-list?category=service_hotel",
  },
  {
    id: 2,
    name: "婚礼酒店",
    icon: "/static/images/20.png",
    path: "/pages/merchant/hotel",
  },
  {
    id: 3,
    name: "婚礼策划",
    icon: "/static/images/21.png",
    path: "/pages/merchant/plan",
  },
  {
    id: 4,
    name: "婚纱礼服",
    icon: "/static/images/22.png",
    path: "/pages/product-list/product-list?category=service_makeup",
  },
  {
    id: 5,
    name: "目的地婚礼",
    icon: "/static/images/23.png",
    path: "/pages/product-list/product-list?category=service_video",
  },
  {
    id: 6,
    name: "婚礼主持",
    icon: "/static/images/24.png",
    path: "/pages/merchant/host",
  },
  {
    id: 7,
    name: "婚礼跟妆",
    icon: "/static/images/25.png",
    path: "/pages/product-list/product-list?category=service_dress",
  },
  {
    id: 8,
    name: "婚礼摄影",
    icon: "/static/images/26.png",
    path: "/pages/product-list/product-list?category=service_car",
  },
  {
    id: 9,
    name: "婚礼摄像",
    icon: "/static/images/27.png",
    path: "/pages/product-list/product-list?category=service_car",
  },
  {
    id: 10,
    name: "婚礼周边",
    icon: "/static/images/28.png",
    path: "/pages/product-list/product-list?category=service_car",
  },
]);
// 导航到分类
function navigateToCategory(category: any) {
  uni.navigateTo({ url: category.path });
}

const goodsList = ref([
  {
    id: 1,
    name: "壹桁奖年度最佳婚礼主持中国金标奖年度活力红人亚洲婚礼风尚主持创造营导师",
    price: "婚礼主持-晓腾",
    sales: 150,
    image: "/static/images/bg4.png",
  },
  {
    id: 2,
    name: "壹桁奖年度最佳婚礼主持中国金标奖年度活力红人亚洲婚礼风尚主持创造营导师",
    price: 3999,
    sales: 120,
    image: "/static/images/bg4.png",
  },
  {
    id: 3,
    name: "壹桁奖年度最佳婚礼主持中国金标奖年度活力红人亚洲婚礼风尚主持创造营导师",
    price: 4999,
    sales: 80,
    image: "/static/images/bg4.png",
  },
]);
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.merchant-list-page {
  .banner {
    margin-bottom: $spacing-md;
    .banner-swiper {
      height: 320rpx;
      overflow: hidden;
    }

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: $spacing-md;
    padding: $spacing-md;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .category-icon {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: $spacing-sm;
      }

      .category-name {
        font-size: $font-xs;
        color: $text-primary;
      }
    }
  }
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40rpx;

    .tag {
      border-radius: 0 0 20rpx 20rpx;
      background: linear-gradient(
        213.75deg,
        #3e3e3e 0%,
        #393939 44.44%,
        #000000 100%
      );
      color: #fff;
      font-size: $font-xs;
      z-index: 1;
      width: 140rpx;
      height: 40rpx;
      text-align: center;
      color: #e9cc90;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0%);

      //
    }
    .goods-item {
      position: relative;
      width: 47%;
      display: flex;
      flex-direction: column;
      border-radius: 30rpx;
      overflow: hidden;
      background: #fff;
      margin-bottom: 20rpx;
      margin-left: 2%;
      .goods-image {
        width: 100%;
      }
      .goods-info {
        padding: $spacing-md;
      }
      .goods-name {
        font-size: $font-sm;
        color: #383838;
        // 限制两行文本显示，超出部分显示省略号
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .goods-price {
        font-size: $font-xs;
        color: $text-primary;
      }
      .goods-intro {
        display: flex;
        align-items: center;
        margin-top: $spacing-sm;
        border-top: 1px solid #e5e5e5;
        padding-top: $spacing-sm;
        .user-icon {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          margin-right: $spacing-sm;
        }
        .user-name {
          font-size: $font-xs;
          color: $text-secondary;
          margin-right: auto;
        }
        .like {
          width: 30rpx;
          height: 30rpx;
        }
      }
    }
  }
}
</style>

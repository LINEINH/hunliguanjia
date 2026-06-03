<template>
  <view class="merchant-list-page">
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image_url" mode="aspectFill" class="banner-image" />
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
          <view class="goods-name">{{ item.personal_intro }}</view>
          <view class="goods-intro">
            <image
              src="/static/images/user.png"
              mode="aspectFill"
              class="user-icon"
            ></image>
            <text class="user-name">{{ item.name }}</text>
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
import { getBanners, merchants } from "@/api/product";

// TODO: 实现商家列表功能
// 轮播图数据
const banners = ref<any[]>([]);
// 服务分类
const categories = ref([
  {
    id: 1,
    name: "婚纱照",
    icon: "/static/images/19.png",
    path: "/pages/merchant/plan?title=婚纱照&category=1",
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
    path: "/pages/merchant/plan?title=婚礼策划&category=3",
  },
  {
    id: 4,
    name: "婚纱礼服",
    icon: "/static/images/22.png",
    path: "/pages/merchant/plan?title=婚纱礼服&category=4",
  },
  {
    id: 5,
    name: "目的地婚礼",
    icon: "/static/images/23.png",
    path: "/pages/merchant/plan?title=目的地婚礼&category=5",
  },
  {
    id: 6,
    name: "婚礼主持",
    icon: "/static/images/24.png",
    path: "/pages/merchant/plan?title=婚礼主持&category=6",
  },
  {
    id: 7,
    name: "婚礼跟妆",
    icon: "/static/images/25.png",
    path: "/pages/merchant/plan?title=婚礼跟妆&category=7",
  },
  {
    id: 8,
    name: "婚礼摄影",
    icon: "/static/images/26.png",
    path: "/pages/merchant/plan?title=婚礼摄影&category=8",
  },
  {
    id: 9,
    name: "婚礼摄像",
    icon: "/static/images/27.png",
    path: "/pages/merchant/plan?title=婚礼摄像&category=9",
  },
  {
    id: 10,
    name: "婚礼周边",
    icon: "/static/images/28.png",
    path: "/pages/merchant/plan?title=婚礼周边&category=10",
  },
]);
// 导航到分类
function navigateToCategory(category: any) {
  uni.navigateTo({ url: category.path });
}

// 商品列表数据
const goodsList = ref<any[]>([]);

// 获取banner
const loadGetBanner = async () => {
  try {
    const response = await getBanners(1);
    // 假设响应数据格式为 { data: [...] } 或直接是数组
    banners.value = response || [];
    console.log("banner:", response);
  } catch (error) {
    console.error("请求推荐商家数据出错:", error);
  }
};

onMounted(() => {
  loadGetBanner();
});
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

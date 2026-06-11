<template>
  <view class="merchant-list-page">
    <view class="banner">
      <swiper
        class="banner-swiper"
        autoplay
        circular
        indicator-dots
        indicator-active-color="#fff"
      >
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
      <view v-if="goodsList.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
      <view class="goods-item" v-for="(item, index) in goodsList" :key="index">
        <view class="tag">{{ getCategoryName(item.category_id) }}</view>
        <image
          :src="item.cover_image"
          class="goods-image"
          mode="aspectFill"
          @click="openDetail(item)"
        />
        <view class="goods-info">
          <view class="goods-name" @click="openDetail(item)">{{
            item.description
          }}</view>
          <view class="goods-intro">
            <image
              :src="item.merchant.logo"
              mode="aspectFill"
              class="user-icon"
              @click="openDetail(item)"
            ></image>
            <text class="user-name">{{ item.merchant.name }}</text>
            <up-icon
              name="star"
              size="24"
              :color="item.isFavorited ? '#FFD700' : '#E5E5E5'"
              @click.stop="toggleFavorite(item)"
            ></up-icon>
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
import { onShow } from "@dcloudio/uni-app";
import {
  getBanners,
  getProductRecommend,
  favoriteProduct,
  unfavoriteProduct,
} from "@/api/product";
import { useUserStore } from "@/store/modules/user";

// 获取用户store
const userStore = useUserStore();

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
    path: "/pages/merchant/host?title=婚礼主持",
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

// 分类名称映射
const categoryNames: Record<number, string> = {
  1: "婚纱照",
  2: "婚礼酒店",
  3: "婚礼策划",
  4: "婚纱礼服",
  5: "目的地婚礼",
  6: "婚礼主持",
  7: "婚礼跟妆",
  8: "婚礼摄影",
  9: "婚礼摄像",
  10: "婚礼周边",
};

// 根据 category_id 获取分类名称
const getCategoryName = (categoryId: number): string => {
  return categoryNames[categoryId] || "未知分类";
};

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

// 获取推荐产品
const loadGetProductRecommend = async () => {
  try {
    const response = await getProductRecommend();
    // 假设响应数据格式为 { data: [...] } 或直接是数组
    goodsList.value = response || [];
    console.log("推荐产品:", response);
  } catch (error) {
    console.error("请求推荐产品数据出错:", error);
  }
};

function openDetail(item: any) {
  if (item && item.id) {
    uni.navigateTo({
      url: `/pages/merchant/planItem?id=${item.id}`,
    });
  }
}

// 切换收藏状态
async function toggleFavorite(item: any) {
  console.log("userStore:", userStore.userInfo);
  // 检查是否登录
  if (!userStore.isLoggedIn || !userStore.userInfo) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再收藏",
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: "/pages/login/login",
          });
        }
      },
    });
    return;
  }

  // 检查是否有产品ID
  if (!item.id) {
    uni.showToast({
      title: "产品信息错误",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: item.isFavorited ? "取消收藏中..." : "收藏中...",
      mask: true,
    });

    // 根据当前收藏状态调用不同的接口
    if (item.isFavorited) {
      // 取消收藏：target_id为商品ID，type为product
      await unfavoriteProduct(item.id, "product");
    } else {
      // 收藏：target_id为商品ID，type为product
      await favoriteProduct(item.id, "product");
    }

    // 切换收藏状态
    item.isFavorited = !item.isFavorited;

    uni.hideLoading();
    uni.showToast({
      title: item.isFavorited ? "收藏成功" : "已取消收藏",
      icon: "success",
    });
  } catch (error) {
    uni.hideLoading();
    console.error("收藏操作失败:", error);
    uni.showToast({
      title: "操作失败，请重试",
      icon: "none",
    });
  }
}

onMounted(() => {
  loadGetBanner();
  loadGetProductRecommend();
});

// 页面显示时重新加载数据（tabbar 切换时触发）
onShow(() => {
  loadGetBanner();
  loadGetProductRecommend();
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.merchant-list-page {
  .banner {
    margin-bottom: $spacing-md;

    .banner-swiper {
      height: 540rpx;
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

    .empty-state {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 100rpx 0;

      .empty-text {
        font-size: $font-sm;
        color: $text-secondary;
      }
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

      .tag {
        border-radius: 0 0 20rpx 20rpx;
        background: linear-gradient(
          213.75deg,
          #3e3e3e 0%,
          #393939 44.44%,
          #000000 100%
        );
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
      }

      .goods-image {
        width: 100%;
      }

      .goods-info {
        padding: $spacing-md;
      }

      .goods-name {
        font-size: $font-sm;
        color: #383838;
        height: 70rpx;
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
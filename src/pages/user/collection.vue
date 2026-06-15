<template>
  <view class="user-coupon-page">
    <view class="tabview">
      <up-tabs
        :list="list"
        @click="click"
        scrollable="false"
        lineWidth="20"
        lineColor="#333333"
        :activeStyle="{
          color: '#333333',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: '#999999',
          transform: 'scale(1)',
        }"
        itemStyle="width: 33.33%;text-align: center; height: 80rpx;"
      ></up-tabs>
    </view>

    <view class="goods-list">
      <view v-if="favoritesList.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
      <view
        class="goods-item"
        v-for="(item, index) in favoritesList"
        :key="index"
        @click="openDetail(item)"
      >
        <image
          :src="
            item.merchant?.cover_image ||
            item.product?.cover_image ||
            item.service?.cover_image
          "
          class="goods-image"
          mode="aspectFill"
        />
        <view class="goods-info">
          <view class="goods-name">{{
            item.merchant?.name || item.product?.name || item.service?.name
          }}</view>
          <view class="goods-intro">
            <image
              src="/static/images/user.png"
              mode="aspectFill"
              class="user-icon"
            ></image>
            <text class="user-name">{{
              item.merchant?.name || item.product?.name || item.service?.name
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getUserFavorites } from "@/api/user";

// 创建响应式数据
const list = reactive([
  { name: "商家", type: "merchant" },
  { name: "产品", type: "product" },
  { name: "服务人", type: "gold_service_provider" },
]);

// 当前选中的tab
const activeTab = ref(0);

// 优惠券列表
const favoritesList = ref([]);

// 空状态文本
const emptyText = computed(() => {
  const texts = ["暂无商家收藏", "暂无产品收藏", "暂无服务人收藏"];
  return texts[activeTab.value];
});

// 定义方法
function click(index) {
  activeTab.value = index;
  console.log("点击了tab", index.type);
  loadFavorites(index.type);
}

function openDetail(item) {
  if (item && item.id) {
    // 判断是商家还是产品
    if (item.merchant) {
      uni.navigateTo({
        url: `/pages/merchant/hotelDetail?id=${item.merchant.id}`,
      });
    } else if (item.product) {
      uni.navigateTo({
        url: `/pages/merchant/planItem?id=${item.product.id}`,
      });
    } else if (item.gold_service_provider) {
      uni.navigateTo({
        url: `/pages/user/butlerDetail?id=${item.gold_service_provider.id}`,
      });
    }
  }
}
// 获取列表
const loadFavorites = async (type) => {
  try {
    const response = await getUserFavorites(type);
    favoritesList.value = response.data || [];
  } catch (error) {
    console.error("获取列表失败:", error);
    uni.showToast({
      title: "获取失败",
      icon: "none",
    });
  }
};

onMounted(() => {
  loadFavorites("merchant");
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
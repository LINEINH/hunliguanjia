<template>
  <view class="hotel-page">
    <!-- 酒店列表 -->
    <scroll-view class="list" scroll-y="true" @scrolltolower="loadMore">
      <view v-if="merchantList.length === 0" class="empty">暂无匹配的商家</view>
      <view
        v-for="merchant in merchantList"
        :key="merchant.id"
        class="hotel-card"
        @click="openDetail(merchant)"
      >
        <image
          class="hotel-img"
          :src="
            merchant.cover_image ||
            (merchant.images && merchant.images.length > 0
              ? merchant.images[0]
              : '')
          "
          mode="aspectFill"
        />
        <view class="hotel-info">
          <view class="hotel-row">
            <text class="hotel-name">{{
              merchant.name || merchant.title
            }}</text>
          </view>
          <view class="hotel-time">
            <text class="rate">{{ merchant.rating }}分</text>
          </view>
          <view class="description">{{
            merchant.description || "暂无描述"
          }}</view>
          <view class="hotel-desc">
            <up-icon name="map" size="14" color="#AB7E2B"> </up-icon>
            <text class="text">{{ merchant.address || "暂无地址" }}</text>
          </view>

          <view class="hotel-intro">
            <image
              :src="merchant.logo"
              mode="aspectFill"
              class="user-icon"
            ></image>
            <text class="user-name">{{ merchant.name }}</text>
          </view>
        </view>
      </view>
      <view v-if="loading" class="loading">加载中...</view>
      <view v-if="!hasMore && merchantList.length > 0" class="no-more"
        >没有更多数据了</view
      >
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import { getMyproducts } from "@/api/user";

// 搜索关键词
const searchKeyword = ref("");

// 添加筛选条件数据的响应式变量
const filterData = ref(null);

// 添加加载状态
const loading = ref(false);

// 定义响应式数据
const merchantList = ref([]);
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页数量
const total = ref(0); // 总数据量
const loadingMore = ref(false); // 是否正在加载更多
const noMore = ref(false); // 是否还有更多数据

// 调用接口获取商家列表
async function loadMerchants(params = {}, resetPage = true) {
  console.log("接口调用参数:", params);
  try {
    // 调用 merchants 接口，获取指定页码和数量的数据
    const response = await getMyproducts();
    console.log(response, "response");
    if (response) {
      merchantList.value = response.data;
      console.log("商家列表:", merchantList.value);
    }
  } catch (error) {
    console.error("获取商家列表失败:", error);
    uni.showToast({
      title: "获取商家列表失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

// 加载筛选条件数据

onMounted(() => {
  loadMerchants();
});

function openDetail(hotel) {
  console.log("打开酒店详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/planItem?id=${hotel.id}`,
    });
  }
}
</script>



<style lang="scss" scoped>
@import "@/styles/variables.scss";
.page {
  background: #f0f0f0;
  min-height: 100vh;
}

.fixedcon {
  position: fixed;
  left: 0;
  right: 0;
  top: 170rpx;
  z-index: 99999;
}

.banner {
  margin-bottom: $spacing-md;
  margin-top: 380rpx;
  .banner-swiper {
    height: 460rpx;
    border-radius: $radius-md;
    overflow: hidden;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
}
.search-bar {
  display: flex;
  padding: 20rpx;
  background: #fff;
  .search-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-radius: 40rpx;
    border: 1px solid #eac47b;
    background: #fff;
    padding-left: 20rpx;
    .search-box-left {
      display: flex;
      align-items: center;
    }
    .uni-input {
      font-size: 28rpx;
      margin-left: 10rpx;
    }
    .search-box-btn {
      border-radius: 40rpx;
      background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
      color: #fff;
      height: 60rpx;
      color: #612500;
      padding: 0 28rpx;
      font-size: 26rpx;
      line-height: 60rpx;
    }
  }
}
.search-input {
  flex: 1;
  height: 36px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
.search-btn {
  margin-left: 8px;
  padding: 0 12px;
  border-radius: 6px;
  background: #2979ff;
  color: #fff;
  height: 36px;
}
.filters {
  display: flex;
  margin-bottom: 20rpx;
  background: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
}
.filter-item {
  width: 23%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #383838;
  height: 60rpx;
  border-radius: 20rpx;
  color: #383838;
  font-size: 28rpx;
}
.filter-item.active {
  background: linear-gradient(135deg, #f1daa6 0%, #f9eccc 33.03%, #e9cc90 100%);
  border: 1px solid #f0cd8c;

  color: #ab7e2b;
}
.clear-btn {
  padding: 8px 10px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #f0a;
  color: #f00;
  min-width: 80px;
}
.list {
  min-height: 400rpx;
}
.hotel-card {
  display: flex;
  background: #fff;
  border-radius: 20rpx 0 0 20rpx;
  margin: 20rpx;

  padding-right: 20rpx;
}

.hotel-info {
  flex: 1;
}
.hotel-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  height: 60rpx;
  margin-top: 20rpx;
}
.hotel-name {
  font-size: 32rpx;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.hotel-time {
  color: #808080;
  font-size: 26rpx;
  font-weight: 500;
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  .rate {
    border-radius: 20rpx;
    background: linear-gradient(
      180deg,
      #f1daa6 0%,
      #f9eccc 33.03%,
      #e9cc90 100%
    );
    padding: 3rpx 10rpx;
    color: #ab7e2b;
  }
}
.description {
  // 一行省略
  font-weight: 400;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 24rpx;
  color: #808080;
  margin-top: 15rpx;
  width: 80%;
}
.hotel-desc {
  font-size: 24rpx;
  color: #808080;
  margin: 15rpx 0;
  display: flex;
  align-items: center;
  width: 80%;
  .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.hotel-price {
  font-size: 26rpx;
  color: #ff6b00;
}
.hotel-intro {
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
}

.highlight {
  font-size: 24rpx;
  color: #ab7e2b;
  border: 1px solid #ab7e2b;
  padding: 4rpx 12rpx;
  border-radius: 24rpx;
}
.empty {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.no-more,
.loading {
  text-align: center;
  font-size: 26rpx;
  color: #999;
  margin-top: 40rpx;
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

.hotel-page {
  .page {
    background: #f0f0f0;
    min-height: 100vh;
  }

  .list {
    min-height: 400rpx;
    padding-top: 30rpx;
  }
  .hotel-card {
    display: flex;
    background: #fff;
    border-radius: 20rpx 0 0 20rpx;
    margin: 20rpx;
    padding-right: 20rpx;
    margin-top: 10rpx;
  }
  .hotel-img {
    width: 240rpx;
    height: 360rpx;
    border-radius: 6px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .hotel-info {
    flex: 1;
  }
  .hotel-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .hotel-name {
    font-size: 32rpx;
    font-weight: 600;
    margin-top: 30rpx;
    // 只可以显示一行
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .hotel-time {
    color: #808080;
    font-size: 26rpx;
    font-weight: 500;
    margin-top: 30rpx;
    .rate {
      border-radius: 20rpx;
      background: linear-gradient(
        180deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
      padding: 3rpx 10rpx;
      color: #ab7e2b;
    }
  }
  .hotel-desc {
    font-size: 24rpx;
    color: #808080;
    margin: 15rpx 0;
  }
  .hotel-price {
    font-size: 26rpx;
    color: #ff6b00;
  }
  .hotel-address {
    font-size: 24rpx;
    color: #808080;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1px solid #bcbcbc;
    display: flex;
    align-items: center;
  }
  .hotel-highlights {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .highlight {
    font-size: 24rpx;
    color: #ab7e2b;
    border: 1px solid #ab7e2b;
    padding: 4rpx 12rpx;
    border-radius: 24rpx;
  }
  .empty {
    text-align: center;
    color: #999;
    padding: 30px 0;
  }

  .loading-more,
  .no-more {
    text-align: center;
    padding: 20rpx 0;
    color: #999;
  }
}
</style>
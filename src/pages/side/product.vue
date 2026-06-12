<template>
  <view class="hotel-page">
    <!-- 酒店列表 -->
    <scroll-view
      class="list"
      scroll-y="true"
      @scrolltolower="loadMoreMerchants"
      :lower-threshold="50"
    >
      <view v-if="filteredHotels.length === 0" class="empty"
        >暂无匹配的酒店</view
      >
      <view
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        class="hotel-card"
        @click="openDetail(hotel)"
      >
        <image class="hotel-img" :src="hotel.logo" mode="aspectFill" />
        <view class="hotel-info">
          <view class="hotel-row">
            <text class="hotel-name">{{ hotel.name }}</text>
          </view>
          <view class="hotel-time"
            ><text class="rate">{{ hotel.rating }}分</text>
            {{ hotel.business_status }} {{ hotel.business_hours }}
          </view>
          <view class="hotel-desc"> {{ hotel.description }} </view>
          <view class="hotel-highlights">
            <text
              v-for="(h, idx) in hotel.personnel_tags"
              :key="idx"
              class="highlight"
              >#{{ h }}</text
            >
          </view>
          <view class="hotel-address">
            <up-icon name="map" size="14" color="# AB7E2B"> </up-icon>
            {{ hotel.address }}</view
          >
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="loading-more" v-if="loadingMore">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore">
        <text>没有更多数据了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import { getHotelFilter, merchants } from "@/api/product";

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
    if (resetPage) {
      // 重置分页参数
      currentPage.value = 1;
      merchantList.value = [];
      noMore.value = false;
      loading.value = true;
    } else {
      // 加载更多时显示加载状态
      loadingMore.value = true;
    }
    params.service_category_id = 2;

    // 调用 merchants 接口，获取指定页码和数量的数据
    const response = await merchants(currentPage.value, pageSize.value, params);
    console.log(response, "response");
    if (response) {
      if (resetPage) {
        // 重置数据
        merchantList.value = response.list || [];
        total.value =
          response.pagination.total ||
          (response.list && response.list.length ? response.list.length : 0);
      } else {
        // 追加数据
        const newData = response.list || [];
        merchantList.value = [...merchantList.value, ...newData];

        // 判断是否还有更多数据
        if (
          response.pagination.total &&
          merchantList.value.length >= response.pagination.total
        ) {
          noMore.value = true;
        }
      }

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

// 加载更多商家
async function loadMoreMerchants() {
  if (loading.value || loadingMore.value || noMore.value) {
    return; // 正在加载或没有更多数据时，不执行
  }

  currentPage.value++;
  await loadMerchants(getCurrentParams(), false);
}

// 加载筛选条件数据

onMounted(() => {
  loadMerchants({}, true);
});

function openDetail(hotel) {
  console.log("打开酒店详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotelDetail?id=${hotel.id}`,
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.hotel-page {
  .page {
    background: #f0f0f0;
    min-height: 100vh;
  }

  .list {
    min-height: 400rpx;
    padding-top: 360rpx;
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
      color: #d43030;
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
<template>
  <view class="expo-container">
    <!-- 轮播图 -->
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="ad" v-if="ongoingExpos && ongoingExpos.length">
      <image
        :src="ongoingExpos[0].cover_image"
        mode="aspectFill"
        class="ad-image"
        @click="navigateToDetail(ongoingExpos[0].id)"
      />
    </view>
    <view class="cardtitle">精彩回顾</view>
    <view class="cardBanner">
      <up-swiper
        :list="list3"
        previousMargin="30"
        nextMargin="30"
        circular
        :autoplay="false"
        radius="5"
        bgColor="#ffffff"
      ></up-swiper>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getExpoList } from "@/api/expo";
import type { ServiceProduct } from "@/types/product";
import type { WeddingExpo } from "@/types/expo";
import { reactive } from "vue";

// 婚博会
const expos = ref<WeddingExpo[]>([]);
const ongoingExpos = ref<WeddingExpo[]>([]); // 进行中的活动
const completedExpos = ref<WeddingExpo[]>([]); // 已完成的活动
const loading = ref(true);
const banners = ref([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);

// 导航到分类
function navigateToCategory(category: any) {
  uni.navigateTo({ url: category.path });
}

// 导航到商家列表
function navigateToDetail(expoId: number) {
  uni.navigateTo({ url: `/pages/expo/expodetail?id=${expoId}` });
}

// 导航到婚博会详情页
function goToExpoDetail(expo: WeddingExpo) {
  // 这里可以传递expo的id到详情页
  uni.navigateTo({
    url: `/pages/expo-detail/expo-detail?id=${expo.id}`,
  });
}

// 根据状态返回对应样式类
function getStatusClass(status: string) {
  switch (status) {
    case "进行中":
      return "status-going";
    case "已结束":
      return "status-ended";
    case "未开始":
      return "status-upcoming";
    default:
      return "";
  }
}

// 格式化日期显示
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

const list3 = reactive([
  "/static/images/banner1.png",
  "/static/images/banner.png",
  "/static/images/banner1.png",
]);

// 获取婚博会列表
async function fetchExpoList() {
  try {
    loading.value = true;
    const response = await getExpoList();
    console.log("婚博会列表:", response);

    // 存储所有活动
    expos.value = response || [];

    ongoingExpos.value =
      response.filter((item: any) => item.status === 1) || [];
    // 根据状态筛选：status为1是进行中，2是已完成
    completedExpos.value =
      response.filter((item: any) => item.status === 2) || [];

    console.log("进行中的活动:", ongoingExpos.value);
  } catch (error) {
    console.error("获取婚博会列表失败:", error);
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

// 页面加载时获取婚博会列表
onMounted(() => {
  fetchExpoList();
});
</script>

<style lang="scss" scoped>
.expo-container {
  padding-bottom: 50rpx;
  .banner {
    margin-bottom: $spacing-md;
    .banner-swiper {
      height: 420rpx;
      border-radius: $radius-md;
      overflow: hidden;
    }
    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
  .ad {
    margin: $spacing-md;
    height: 800rpx;
    .ad-image {
      width: 100%;
      height: 800rpx;
      border-radius: $radius-md;
    }
  }
  .cardtitle {
    color: #ab7e2b;
    margin: $spacing-md;
    font-size: 32rpx;
    font-weight: bold;
  }

  .expo-list {
    padding: 0 $spacing-md;

    .loading,
    .no-data {
      text-align: center;
      padding: 40rpx;
      color: #999;
    }

    .expo-items {
      .expo-item {
        background: #fff;
        border-radius: $radius-md;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

        .expo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20rpx;

          .expo-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            flex: 1;
            margin-right: 20rpx;
          }

          .expo-status {
            font-size: 24rpx;
            padding: 6rpx 16rpx;
            border-radius: 20rpx;

            &.status-going {
              background: #e8f5e9;
              color: #4caf50;
            }

            &.status-ended {
              background: #e0e0e0;
              color: #757575;
            }

            &.status-upcoming {
              background: #e3f2fd;
              color: #2196f3;
            }
          }
        }

        .expo-meta {
          display: flex;
          flex-direction: column;
          margin-bottom: 20rpx;

          .expo-time,
          .expo-location {
            font-size: 26rpx;
            color: #666;
            margin-bottom: 10rpx;
          }
        }

        .expo-intro {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20rpx;
        }

        .expo-stats {
          display: flex;
          justify-content: space-around;

          .stat-item {
            font-size: 24rpx;
            color: #999;
            padding: 6rpx 12rpx;
            background: #f5f5f5;
            border-radius: 10rpx;
          }
        }
      }
    }
  }
}
</style>
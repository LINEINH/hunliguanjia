<template>
  <view class="expo-container">
    <!-- 轮播图 -->
    <view class="banner">
      <swiper
        class="banner-swiper"
        autoplay
        circular
        indicator-dots
        indicator-active-color="#fff"
      >
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image_url" mode="aspectFill" class="banner-image" lazy-load />
        </swiper-item>
      </swiper>
    </view>
    <view class="ad" v-if="ongoingExpos && ongoingExpos.length">
      <image
        :src="ongoingExpos[0].cover_image"
        mode="widthFix"
        class="ad-image"
        @click="navigateToDetail(ongoingExpos[0].id)"
        lazy-load
      />
    </view>
    <view class="cardtitle">精彩回顾</view>
    <view class="cardBanner">
      <up-swiper
        :list="completedExpos"
        :autoplay="false"
        :circular="true"
        :indicator="true"
        :previousMargin="80"
        :nextMargin="80"
        :duration="500"
        :radius="10"
        height="410"
        bgColor="transparent"
      >
        <template #default="{ item }">
          <view class="card-item" @click="navToDetailhistory(item.id)">
            <image
              :src="item.cover_image"
              mode="aspectFill"
              class="card-image"
              lazy-load
            />
            <view class="card-info">
              <view class="card-host">
                <view class="card-host-info">
                  <view class="card-host-name">{{ item.name }}</view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </up-swiper>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getExpoList } from "@/api/expo";
import type { WeddingExpo } from "@/types/expo";
import { reactive } from "vue";

// 婚博会
const expos = ref<WeddingExpo[]>([]);
const ongoingExpos = ref<WeddingExpo[]>([]); // 进行中的活动
const completedExpos = ref<WeddingExpo[]>([]); // 已完成的活动
const loading = ref(true);
const banners = ref([
  { image_url: "/static/images/banner1.png" },
  { image_url: "/static/images/banner.png" },
]);

// 导航到分类
function navigateToCategory(category: any) {
  uni.navigateTo({ url: category.path });
}

// 导航到商家列表
function navigateToDetail(expoId: number) {
  uni.navigateTo({ url: `/pages/expo/expodetail?id=${expoId}` });
}

//
function navToDetailhistory(expoId: number) {
  uni.navigateTo({ url: `/pages/expo/history?id=${expoId}` });
}

function navToDetail(event: any) {
  console.log("点击了", event);
  if (event.id) {
    navigateToDetail(event.id);
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
    // expos.value = response || [];
    banners.value = response.banners || [];
    ongoingExpos.value = response.featured_activities || [];
    completedExpos.value = response.history_activities || [];
    console.log("所有活动:", expos.value);
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

// 页面显示时重新加载数据（tabbar 切换时触发）
onShow(() => {
  fetchExpoList();
});
</script>

<style lang="scss" scoped>
.expo-container {
  .banner {
    margin-bottom: $spacing-md;
    .banner-swiper {
      height: 520rpx;
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
    .ad-image {
      width: 100%;
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
  .cardBanner {
    margin: $spacing-md 0;

    padding: $spacing-md;

    .card-item {
      border-radius: $radius-lg;
      overflow: hidden;
      box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
      height: 700rpx;
      margin: 0 10rpx;
      background-color: #fff;
    }

    .card-image {
      width: 100%;
      height: 560rpx;
      display: block;
    }

    .card-info {
      padding: $spacing-md $spacing-sm;
      .card-host {
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
  }
}
</style>
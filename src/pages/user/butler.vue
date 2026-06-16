<template>
  <view class="butler-container">
    <!-- 轮播图 -->
    <view class="nav">
      <up-navbar-mini
        @leftClick="leftClick"
        :autoBack="true"
        homeUrl="/pages/index/index"
      >
      </up-navbar-mini>
    </view>
    <view class="banner">
      <swiper
        class="banner-swiper"
        autoplay
        circular
        indicator-dots
        indicator-active-color="#fff"
        interval="3000"
        duration="500"
      >
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image_url" mode="aspectFill" class="banner-image" />
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
          height="400"
          bgColor="transparent"
        >
          <template #default="{ item }">
            <view class="card-item">
              <image
                :src="item.cover_image"
                mode="aspectFill"
                class="card-image"
                @click="navToDetail(item)"
              />
              <view class="card-info">
                <view class="card-host" @click="navToDetail(item)">
                  <image
                    :src="item.avatar"
                    mode="aspectFill"
                    class="user-pic"
                  ></image>
                  <view class="card-host-info">
                    <view class="card-host-name">{{ item.name }}</view>
                    <view class="rate">
                      <text class="icon-star">{{ item.rating }}</text>
                      <text class="year">
                        {{ item.experience_years }}年经验
                      </text>
                    </view>
                  </view>
                </view>
                <view class="card-footer">
                  <text
                    class="card-price"
                    v-if="item.price_packages && item.price_packages.length"
                    >¥

                    {{ item.price_packages[0].price }}

                    <text class="samll">起</text>
                  </text>

                  <up-icon
                    name="star"
                    size="24"
                    :color="item.is_favorited ? '#FFD700' : '#E5E5E5'"
                    @click.stop="toggleFavorite(item)"
                  ></up-icon>
                </view>
              </view>
            </view>
          </template>
        </up-swiper>
      </view>

      <view class="moments-grid">
        <template v-for="(moment, index) in momentsList" :key="index">
          <view class="moment-item">
            <image
              :src="moment.cover_image"
              class="moment-image"
              mode="aspectFill"
              @click="navToDetail(moment)"
            ></image>
            <view class="card-info">
              <view class="card-host" @click="navToDetail(moment)">
                <image
                  :src="moment.avatar"
                  mode="aspectFill"
                  class="user-pic"
                ></image>
                <view class="card-host-info">
                  <view class="card-host-name">{{ moment.name }}</view>
                  <view class="rate">
                    <text class="icon-star">{{ moment.rating }}</text>
                    <text class="year">
                      {{ moment.experience_years }}年经验
                    </text>
                  </view>
                </view>
              </view>
              <view class="card-footer">
                <text
                  class="card-price"
                  v-if="moment.price_packages && moment.price_packages.length"
                  >¥

                  {{ moment.price_packages[0].price }}

                  <text class="samll">起</text>
                </text>
                <up-icon
                  name="star"
                  size="24"
                  :color="moment.is_favorited ? '#FFD700' : '#E5E5E5'"
                  @click.stop="toggleFavorite(moment)"
                ></up-icon>
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
import { onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";

import {
  getGoldServiceBanner,
  getRecommendedGold,
  getGoldServiceProviders,
} from "@/api/user";

import { favoriteProduct, unfavoriteProduct } from "@/api/product";
import { useUserStore } from "@/store/modules/user";
// 获取用户store
const userStore = useUserStore();

// 轮播图数据
const banners = ref<any[]>([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);

// 导航到商家列表
function navigateToPlanItem() {
  uni.navigateTo({ url: "/pages/merchant/planItem" });
}

const cardList = ref<any[]>([
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

const momentsList = ref<any[]>([]);

// 分页相关参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const hasMore = ref(true);
const isLoading = ref(false);

const handleCardChange = () => {
  console.log(11);
};

// 获取推荐服务商列表（cardList）
async function fetchRecommendedProviders() {
  try {
    const response = await getRecommendedGold();
    console.log("推荐服务商:", response);
    cardList.value = response || [];
  } catch (error) {
    console.error("获取推荐服务商失败:", error);
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  }
}

// 获取 banner
async function fetchBanner() {
  try {
    const response = await getGoldServiceBanner();
    console.log("banner:", response);
    banners.value = response || [];
  } catch (error) {
    console.error("获取banner失败:", error);
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  }
}

// 获取列表数据
async function fetchServiceProviders(isLoadMore = false) {
  if (isLoading.value) return;

  // 如果是加载更多，但没有更多数据了，则返回
  if (isLoadMore && !hasMore.value) {
    uni.showToast({
      title: "没有更多数据了",
      icon: "none",
    });
    return;
  }

  try {
    isLoading.value = true;

    const page = isLoadMore ? currentPage.value + 1 : 1;
    // 假设 API 接受参数顺序为: status, keyword, page, pageSize
    // 根据实际情况调整参数
    const response = await getGoldServiceProviders(
      "",
      "",
      page,
      pageSize.value
    );

    console.log("金牌服务人列表:", response);

    // 根据实际 API 返回结构调整
    const newList = response?.data || response || [];
    total.value = response?.total || 0;

    if (isLoadMore) {
      momentsList.value = [...momentsList.value, ...newList];
    } else {
      momentsList.value = newList;
    }

    currentPage.value = page;
    hasMore.value = momentsList.value.length < total.value;
  } catch (error) {
    console.error("获取金牌服务人列表失败:", error);
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
}

// 上拉加载更多
function loadMore() {
  if (!isLoading.value && hasMore.value) {
    fetchServiceProviders(true);
  }
}

// 监听页面滚动到底部
onReachBottom(() => {
  loadMore();
});

// 下拉刷新
onPullDownRefresh(async () => {
  currentPage.value = 1;
  hasMore.value = true;
  await fetchServiceProviders(false);
  uni.stopPullDownRefresh();
});

// 切换收藏状态
async function toggleFavorite(item: any) {
  console.log("userStore:", userStore.userInfo);
  console.log("toggleFavorite:", item);
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
      title: "错误",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: item.is_favorited ? "取消收藏中..." : "收藏中...",
      mask: true,
    });

    // 根据当前收藏状态调用不同的接口
    if (item.is_favorited) {
      // 取消收藏：target_id为商品ID，type为product
      await unfavoriteProduct(item.id, "gold_service_provider");
    } else {
      // 收藏：target_id为商品ID，type为product
      await favoriteProduct(item.id, "gold_service_provider");
    }

    // 切换收藏状态
    item.is_favorited = !item.is_favorited;

    uni.hideLoading();
    uni.showToast({
      title: item.is_favorited ? "收藏成功" : "已取消收藏",
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

function navToDetail(event: any) {
  if (event.id) {
    uni.navigateTo({ url: `/pages/user/butlerDetail?id=${event.id}` });
  }
}

// 定义方法
const leftClick = () => {
  console.log("leftClick");
  // 返回上一页
  uni.navigateBack();
};
// 加载数据
onMounted(() => {
  fetchBanner();
  fetchRecommendedProviders(); // 获取推荐列表
  fetchServiceProviders(false); // 获取金牌服务人列表（分页）
  console.log("首页加载");
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.butler-container {
  .samll {
    font-size: 24rpx;
    color: #bf974a;
    font-weight: normal;
  }
  .banner {
    margin-bottom: $spacing-md;
    .banner-swiper {
      height: 540rpx;
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
    background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/10/6a28ee2074c45.png");
    background-size: cover;
    background-position: center;
    padding: $spacing-md;
  }

  .card-item {
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
    height: 640rpx;
    margin: 0 10rpx;
    background-color: #fff;
  }

  .card-image {
    width: 100%;
    height: 450rpx;
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
        border-radius: 50%;
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
            padding: 3rpx 10rpx;
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
    border-radius: 20rpx;
    padding: 0 20rpx;
    gap: 20rpx;
    padding-bottom: 30rpx;
    .moment-item {
      background-color: #fff;
      border-radius: $radius-md;
      overflow: hidden;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
      .moment-image {
        width: 100%;
        height: 450rpx;
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
            border-radius: 50%;
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
                padding: 3rpx 10rpx;
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
    }
  }
}
</style>
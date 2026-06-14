
<template>
  <view class="butler-detail-page">
    <up-navbar
      :title="butlerDetail?.name || '管家详情'"
      @rightClick="rightClick"
      :autoBack="true"
    >
    </up-navbar>
    <!-- 轮播图 -->
    <view class="banner">
      <swiper
        class="banner-swiper"
        autoplay
        circular
        indicator-dots
        v-if="butlerDetail.carousel_images.length > 0"
      >
        <swiper-item
          v-for="(item, index) in butlerDetail.carousel_images"
          :key="index"
        >
          <image :src="item" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
      <view v-else class="banner-placeholder">暂无图片</view>
    </view>
    <view class="hotel-info">
      <view class="host">
        <view class="card-host">
          <image
            :src="butlerDetail?.avatar || '/static/images/user.png'"
            mode="aspectFill"
            class="user-pic"
          ></image>
          <view class="card-host-info">
            <view class="card-host-name">{{
              butlerDetail?.name || "测试测试"
            }}</view>
            <view class="rate">
              <text class="icon-star">{{ butlerDetail?.rating || "4.4" }}</text>
              <text class="year">
                {{ butlerDetail?.experienceYears || 16 }}年经验
              </text>
            </view>
          </view>
        </view>

        <view
          class="card-price"
          v-if="
            butlerDetail?.price_packages &&
            butlerDetail.price_packages.length > 0
          "
          >{{ butlerDetail?.price_packages[0].price || 10000 }}</view
        >
      </view>

      <view class="hotel-address">{{
        butlerDetail?.service_description ||
        "1.建群有任何婚礼的问题可以随时问我 2.在婚礼前一个月左右我们约线下见面，我来找您，做全程婚礼策划，或者根据您的时间我们来做线上语音3全程迎亲和婚礼策划(两个小时)4彩排+迎亲+主持+Dj"
      }}</view>
    </view>
    <view class="concent">
      <view class="concent-name">服务内容</view>
      <view
        class="list"
        v-if="
          butlerDetail?.price_packages && butlerDetail.price_packages.length > 0
        "
      >
        <view
          class="listItem"
          v-for="(service, index) in butlerDetail.price_packages"
          :key="index"
        >
          <view class="listItem-name">
            <text class="point"></text>
            {{ service.name }}</view
          >
          <view class="listItem-price">¥{{ service.price }}</view>
          <view class="listItem-button" @click="buyNow(index, butlerDetail.id)"
            >立即预订</view
          >
        </view>
      </view>
      <view v-else class="empty-services">暂无服务内容</view>
    </view>

    <view
      class="detailImage"
      v-if="butlerDetail.detail_images && butlerDetail.detail_images.length > 0"
    >
      <image
        :src="item"
        mode="widthFix"
        class="detail-image"
        v-for="(item, index) in butlerDetail.detail_images"
        :key="index"
        style="width: 100%"
      />
    </view>

    <view class="hotel-footer">
      <view class="hotel-footer-item" @click="rightClick">
        <up-icon name="arrow-left" size="24" color="#E5E5E5"></up-icon>
        <text>返回</text>
      </view>
      <view class="hotel-footer-item" @click="toggleFavorite">
        <up-icon
          name="star"
          size="24"
          :color="isFavorited ? '#BF974A' : '#E5E5E5'"
        ></up-icon>
        <text :style="{ color: isFavorited ? '#BF974A' : '#999999' }">{{
          isFavorited ? "已收藏" : "收藏"
        }}</text>
      </view>
      <view class="hotel-footer-tel button" @click="openDetail()">
        电话咨询
      </view>
      <view class="hotel-footer-online button"> 在线管家 </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
const show = ref(false);
import { getGoldDetail, setOrders } from "@/api/user";
import { favoriteProduct, unfavoriteProduct } from "@/api/product";

// 轮播图数据
const banners = ref([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);

// 管家详情数据
const butlerDetail = ref(null);
const loading = ref(false);

// 收藏状态
const isFavorited = ref(false);

// 获取页面参数并加载详情
onLoad((options) => {
  const id = options.id;
  if (id) {
    loadButlerDetail(Number(id));
  }
});

// 加载管家详情
async function loadButlerDetail(id) {
  loading.value = true;
  try {
    const res = await getGoldDetail(id);
    if (res && res) {
      butlerDetail.value = res;
      isFavorited.value = res.is_favorited || false; //
    }
  } catch (error) {
    console.error("获取管家详情失败:", error);
    uni.showToast({
      title: "获取详情失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

// 切换收藏状态
async function toggleFavorite() {
  try {
    if (!hotelId.value) {
      uni.showToast({
        title: "缺少酒店ID",
        icon: "none",
      });
      return;
    }

    if (isFavorited.value) {
      // 取消收藏
      await unfavoriteProduct(butlerDetail.value.id, "gold_service_provider");
      isFavorited.value = false;
      uni.showToast({
        title: "已取消收藏",
        icon: "success",
      });
    } else {
      // 收藏
      await favoriteProduct(butlerDetail.value.id, "gold_service_provider");
      isFavorited.value = true;
      uni.showToast({
        title: "收藏成功",
        icon: "success",
      });
    }
  } catch (error) {
    console.error("收藏操作失败:", error);
    uni.showToast({
      title: "操作失败",
      icon: "none",
    });
  }
}

function buyNow(index, id) {
  // 调用setOrders接口
  setOrders(id, index).then((res) => {
    console.log("setOrders接口返回结果:", res);
    if (res.order) {
      uni.navigateTo({
        url: `/pages/user/order?id=${res.order.id}`,
      });
    }
  });
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.butler-detail-page {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    margin-bottom: $spacing-md;
    margin-top: 120rpx;
    .banner-swiper {
      height: 520rpx;
      border-radius: $radius-md;
      overflow: hidden;
    }

    .banner-image {
      width: 100%;
      height: 100%;
    }

    .banner-placeholder {
      height: 320rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #999;
      font-size: 28rpx;
    }
  }
  .hotel-info {
    margin: 0 $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: 30rpx;
    margin-bottom: $spacing-md;
    .host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40rpx;
      .card-host {
        display: flex;
        align-content: center;
        .user-pic {
          width: 100rpx;
          height: 100rpx;
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
      .card-price {
        color: #bf974a;
      }
    }
    .hotel-time {
      color: #808080;
      font-size: 28rpx;
      margin: 20rpx 0;
      font-weight: bold;
    }

    .hotel-address {
      font-size: 28rpx;
      color: #808080;
      margin-bottom: 10rpx;
      line-height: 1.5;
    }
    .hotel-intro {
      font-size: 26rpx;
      color: #a6a6a6;
      margin-bottom: 10rpx;
    }

    .hotel-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;
      .hotel-list-item {
        border-radius: 30rpx;
        width: 320rpx;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        margin-bottom: 20rpx;
        .image {
          width: 100%;
          height: 320rpx;
        }
        .hotel-list-item-info {
          padding: $spacing-sm;
          .hotel-list-item-title {
            font-size: 32rpx;
            color: #383838;
            margin-bottom: 10rpx;

            // 超过两行显示省略号
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .hotel-list-item-price {
            font-size: 26rpx;
            color: #808080;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .price {
              color: #bf974a;
              font-size: 32rpx;
            }
            .danwei {
              color: #bf974a;
              font-size: 24rpx;
            }
          }
          .hotel-list-item-intro {
            font-size: 24rpx;
            color: #808080;
            margin-bottom: 10rpx;
          }
        }
      }
    }
  }
  .concent {
    margin: 0 $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: 30rpx;
    .concent-name {
      font-size: 32rpx;
      color: #383838;
      margin-bottom: 20rpx;
    }
    .list {
      .listItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;
        .listItem-name {
          font-size: 28rpx;
          color: #383838;
          display: flex;
          align-items: center;
          .point {
            background: linear-gradient(
              135.57deg,
              #f1daa6 0%,
              #f9eccc 33.03%,
              #e9cc90 100%
            );
            width: 20rpx;
            height: 20rpx;
            border-radius: 50%;
            display: block;
            margin-right: 10rpx;
          }
        }
        .listItem-price {
          font-size: 36rpx;
          color: #bf974a;
        }
        .listItem-button {
          font-size: 28rpx;
          border-radius: 30rpx;
          color: #bf974a;
          border: 1px solid #f0cd8c;
          padding: 10rpx 30rpx;
        }
      }
    }
    .empty-services {
      text-align: center;
      color: #999;
      font-size: 28rpx;
      padding: 40rpx 0;
    }
  }
  .hotel-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120rpx;
    z-index: 99999;
    padding: 0 $spacing-sm 30rpx $spacing-sm;
    .hotel-footer-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999999;
      font-size: 26rpx;
    }
    .button {
      border-radius: 20rpx;
      font-size: 28rpx;
      height: 80rpx;
      width: 250rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10rpx;
    }
    .hotel-footer-tel {
      background: linear-gradient(
          0deg,
          rgba(229, 229, 229, 1),
          rgba(229, 229, 229, 1)
        ),
        linear-gradient(135deg, #f1daa6 0%, #f9eccc 33.03%, #e9cc90 100%);
      color: #808080;
    }
    .hotel-footer-online {
      background: linear-gradient(
        135deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
      color: #612500;
    }
  }
}
</style>

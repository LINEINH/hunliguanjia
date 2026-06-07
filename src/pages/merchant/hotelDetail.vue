
<template>
  <view class="hotel-detail-page">
    <up-navbar
      :title="hotelData.name || '酒店详情'"
      @rightClick="rightClick"
      :autoBack="true"
    >
    </up-navbar>

    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in hotelData.images" :key="index">
          <image :src="item" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="hotel-info">
      <view class="hotel-name">
        {{ hotelData.name }}
        <text class="price">¥{{ hotelData.starting_price }}起</text>
      </view>
      <view class="hotel-time">
        {{ hotelData.business_status }} {{ hotelData.business_hours }}
      </view>
      <view class="hotel-rate">
        <text class="rate">{{ hotelData.rating }}分</text> "{{
          hotelData.description
        }}"
      </view>
      <view
        class="hotel-highlights"
        v-if="hotelData.personnel_tags && hotelData.personnel_tags.length > 0"
      >
        <text
          v-for="(feature, index) in hotelData.personnel_tags"
          :key="index"
          class="highlight"
        >
          {{ feature }}
        </text>
      </view>
      <view class="hotel-address">{{ hotelData.address }}</view>
      <view class="hotel-intro">{{ hotelData.description }}</view>
      <view
        class="hotel-fuli"
        v-if="hotelData.products && hotelData.products.length > 0"
      >
        <view class="hotel-fuli-title">特惠福利</view>
        <view
          v-for="(product, index) in CouponsData"
          :key="index"
          class="hotel-fuli-item"
        >
          <text
            >{{ product.name }} ：满¥{{ product.min_amount }}立减¥{{
              product.value
            }}</text
          >
          <view class="recive" @click="receiveCoupon(product.id)">
            领取
            <up-icon name="arrow-right" size="16" color="#BF974A"></up-icon>
          </view>
        </view>
      </view>
      <view
        class="hotel-list"
        v-if="hotelData.products && hotelData.products.length > 0"
      >
        <view
          v-for="(caseItem, index) in hotelData.products"
          :key="index"
          class="hotel-list-item"
          @click="openDetail(caseItem)"
        >
          <image
            :src="caseItem.cover_image"
            mode="aspectFill"
            class="image"
          ></image>
          <view class="hotel-list-item-info">
            <view class="hotel-list-item-title">
              {{ caseItem.name }}
            </view>
            <view class="hotel-list-item-intro">
              {{ caseItem.description }}
            </view>
            <view class="hotel-list-item-price">
              <view class="price-wrap">
                <text class="price">参考价{{ caseItem.price }}起</text>
              </view>
              <up-icon name="star" size="24" color="#E5E5E5"></up-icon>
            </view>
          </view>
        </view>
      </view>
      <view
        class="detailImage"
        v-if="hotelData.detail_images && hotelData.detail_images.length > 0"
      >
        <image
          :src="item"
          mode="widthFix"
          class="detail-image"
          v-for="(item, index) in hotelData.detail_images"
          :key="index"
        />
      </view>
    </view>
    <view class="hotel-footer">
      <view class="hotel-footer-item">
        <up-icon name="arrow-left" size="24" color="#E5E5E5"></up-icon>
        <text>返回</text>
      </view>
      <view class="hotel-footer-item">
        <up-icon name="star" size="24" color="#E5E5E5"></up-icon>
        <text>收藏</text>
      </view>

      <view class="hotel-footer-tel button" @click="makePhoneCall()">
        电话咨询
      </view>
      <view class="hotel-footer-online button"> 在线管家 </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getHotelDetail, getCoupons, receiveCoupons } from "@/api/product";

// 基础URL
const baseUrl = ref<string>("");

// 酒店数据
const hotelData = ref<any>({});
const CouponsData = ref<any>({});

// 酒店ID
const hotelId = ref<number | null>(null);

// onLoad 参数接收器
const props = defineProps<{
  id?: string;
}>();

// 加载酒店详情
async function loadHotelDetail() {
  if (!hotelId.value) {
    uni.showToast({
      title: "缺少酒店ID",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: "加载中...",
    });

    const response = await getHotelDetail(hotelId.value);

    hotelData.value = response;
    console.log("酒店详情:", response);
  } catch (error) {
    console.error("获取酒店详情失败:", error);
    uni.showToast({
      title: "获取酒店详情失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
}

async function loadCoupons() {
  try {
    const id = Number(hotelId.value) || 0;
    const response = await getCoupons(id);
    console.log("优惠券列表:", response.data);
    CouponsData.value = response.data || [];
  } catch (error) {
    uni.showToast({
      title: "获取酒店产品列表失败",
      icon: "none",
    });
  }
}

function openDetail(caseItem: any) {
  if (caseItem && caseItem.id) {
    uni.navigateTo({
      url: `/pages/merchant/planItem?id=${caseItem.id}`,
    });
  }
}

// 页面加载时获取酒店详情
onMounted(() => {
  if (props.id) {
    hotelId.value = Number(props.id);
    loadHotelDetail();
    loadCoupons();
  } else {
    uni.showToast({
      title: "缺少酒店ID",
      icon: "none",
    });
  }
});

function rightClick() {
  console.log("right click");
}

function makePhoneCall() {
  // 这里可以添加电话咨询的功能
  uni.showModal({
    title: "电话咨询",
    content: "是否拨打酒店联系电话？",
    success: function (res) {
      if (res.confirm) {
        // 实际项目中这里应该替换成酒店的真实电话
        uni.makePhoneCall({
          phoneNumber: "13800138000", // 示例电话号码
        });
      }
    },
  });
}

async function receiveCoupon(couponId: number) {
  try {
    const response = await receiveCoupons(couponId);
    console.log("领取优惠券:", response);
    uni.showToast({
      title: "领取成功",
      icon: "success",
    });
  } catch (error) {
    console.error("领取优惠券失败:", error);
    uni.showToast({
      title: "领取失败",
      icon: "none",
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.hotel-detail-page {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    margin-top: 80rpx;
    margin-bottom: 40rpx;
    .banner-swiper {
      height: 1200rpx;
      overflow: hidden;
    }
    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
  .hotel-info {
    margin: 0 $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: 30rpx;
    padding-bottom: 50rpx;
    margin-bottom: 50rpx;
    .hotel-name {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price {
        font-size: 32rpx;
        color: #bf974a;
        margin-left: auto;
      }
    }
    .hotel-time {
      color: #808080;
      font-size: 28rpx;
      margin: 20rpx 0;
      font-weight: bold;
    }
    .hotel-rate {
      color: #808080;
      font-size: 26rpx;
      margin-top: 30rpx;
      .rate {
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
    }
    .hotel-highlights {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .highlight {
      font-size: 24rpx;
      color: #383838;
      background: #f0f0f0;
      padding: 10rpx 20rpx;
      border-radius: 24rpx;
      margin: 20rpx 0;
    }
    .hotel-address {
      font-size: 28rpx;
      color: #808080;
      margin-bottom: 10rpx;
    }
    .hotel-intro {
      font-size: 26rpx;
      color: #a6a6a6;
      margin-bottom: 10rpx;
    }
    .hotel-fuli {
      border: 1px solid #f0cd8c;
      margin: $spacing-lg 0;
      border-radius: 30rpx;
      overflow: hidden;
      .hotel-fuli-title {
        font-size: 28rpx;
        color: #383838;
        background: linear-gradient(180deg, #f1daa6 0%, #eac47b 100%);
        padding: $spacing-sm $spacing-md;
        text-shadow: 1px 1px 1px #805608;
        color: #ffffff;
        font-size: 34rpx;
        font-weight: bold;
      }
      .hotel-fuli-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-sm $spacing-md;
        color: #383838;
        .recive {
          color: #bf974a;
          display: flex;
          align-items: center;
        }
      }
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
            height: 30rpx;
          }
        }
      }
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
      width: 280rpx;
      display: flex;
      justify-content: center;
      align-items: center;
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
  .detail-image {
    width: 100%;
    display: block;
  }
}
</style>

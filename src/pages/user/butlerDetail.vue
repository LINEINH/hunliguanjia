
<template>
  <view class="butler-detail-page">
    <up-navbar
      title="盛唐宴礼宴中心(太华南路店)"
      @rightClick="rightClick"
      :autoBack="true"
    >
    </up-navbar>
    <!-- 轮播图 -->
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="hotel-info">
      <view class="host">
        <view class="card-host">
          <image
            src="/static/images/user.png"
            mode="aspectFill"
            class="user-pic"
          ></image>
          <view class="card-host-info">
            <view class="card-host-name">测试测试</view>
            <view class="rate">
              <text class="icon-star">4.4</text>
              <text class="year"> 16年经验 </text>
            </view>
          </view>
        </view>

        <view class="card-price">10000</view>
      </view>

      <view class="hotel-address"
        >1.建群有任何婚礼的问题可以随时问我
        2.在婚礼前一个月左右我们约线下见面，我来找您，做全程婚礼策划，或者根据您的时间我们来做线上语音3全程迎亲和婚礼策划(两个小时)4.彩排+迎亲+主持+Dj</view
      >
    </view>
    <view class="concent">
      <view class="concent-name">服务内容</view>
      <view class="list">
        <view class="listItem">
          <view class="listItem-name">
            <text class="point"></text>
            测试测试</view
          >
          <view class="listItem-price">¥58888</view>
          <view class="listItem-button">立即预订</view>
        </view>
        <view class="listItem">
          <view class="listItem-name">
            <text class="point"></text>
            测试测试</view
          >
          <view class="listItem-price">¥58888</view>
          <view class="listItem-button">立即预订</view>
        </view>
        <view class="listItem">
          <view class="listItem-name">
            <text class="point"></text>
            测试测试</view
          >
          <view class="listItem-price">¥58888</view>
          <view class="listItem-button">立即预订</view>
        </view>
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

      <view class="hotel-footer-tel button" @click="openDetail()">
        电话咨询
      </view>
      <view class="hotel-footer-online button"> 在线管家 </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
const show = ref(false);

// 轮播图数据
const banners = ref([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);
function openDetail(hotel) {
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotel-detail?id=${hotel.id}`,
    });
  }
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

    .banner-swiper {
      height: 320rpx;
      border-radius: $radius-md;
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
}
</style>

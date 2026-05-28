
<template>
  <view class="hotel-detail-page">
    <up-navbar
      title="盛唐宴礼宴中心(太华南路店)"
      @rightClick="rightClick"
      :autoBack="true"
    >
    </up-navbar>
    <view class="banner">
      <image
        src="/static/images/banner1.png"
        mode="aspectFill"
        class="banner"
      ></image>
    </view>
    <view class="hotel-info">
      <view class="hotel-name"
        >盛唐宴礼宴中心(太华南路店)
        <text class="price">¥1280/桌</text>
      </view>
      <view class="hotel-time"> 营业中 09:00-21:00 </view>
      <view class="hotel-rate"
        ><text class="rate">4.5分</text> “环境雍容华贵，菜品食材上乘”
      </view>
      <view class="hotel-highlights">
        <text class="highlight">大厅无柱</text>
        <text class="highlight">西式婚礼</text>
        <text class="highlight">西式婚礼</text>
      </view>
      <view class="hotel-address"
        >地址：西安市雁塔区太华南路与科技二路交叉口西北角</view
      >
      <view class="hotel-intro">距地铁4号线含元殿站D东北口步行230m</view>
      <view class="hotel-fuli">
        <view class="hotel-fuli-title">特惠福利</view>
        <view class="hotel-fuli-item">
          <text>新客专享·200元优惠券</text>
          <view class="recive"
            >领取
            <up-icon name="arrow-right" size="16" color="#BF974A"></up-icon
          ></view>
        </view>
      </view>
      <view class="hotel-list">
        <view class="hotel-list-item">
          <image
            src="/static/images/banner1.png"
            mode="aspectFill"
            class="image"
          ></image>
          <view class="hotel-list-item-info">
            <view class="hotel-list-item-title">
              盛唐宴礼宴中心(太华南路店)盛唐宴礼宴中心(太华南路店)
            </view>
            <view class="hotel-list-item-intro"> 可容纳20-25桌 无柱子 </view>
            <view class="hotel-list-item-price">
              <view class="price-wrap">
                参考价
                <text class="price">250000</text>
                <text class="danwei">起</text>
              </view>
              <up-icon name="star" size="24" color="#E5E5E5"></up-icon>
            </view>
          </view>
        </view>
        <view class="hotel-list-item">
          <image
            src="/static/images/banner1.png"
            mode="aspectFill"
            class="image"
          ></image>
          <view class="hotel-list-item-info">
            <view class="hotel-list-item-title">
              盛唐宴礼宴中心(太华南路店)盛唐宴礼宴中心(太华南路店)
            </view>
            <view class="hotel-list-item-intro"> 可容纳20-25桌 无柱子 </view>
            <view class="hotel-list-item-price">
              <view class="price-wrap">
                参考价
                <text class="price">250000</text>
                <text class="danwei">起</text>
              </view>
              <up-icon name="star" size="24" color="#E5E5E5"></up-icon>
            </view>
          </view>
        </view>
        <view class="hotel-list-item">
          <image
            src="/static/images/banner1.png"
            mode="aspectFill"
            class="image"
          ></image>
          <view class="hotel-list-item-info">
            <view class="hotel-list-item-title">
              盛唐宴礼宴中心(太华南路店)盛唐宴礼宴中心(太华南路店)
            </view>
            <view class="hotel-list-item-intro"> 可容纳20-25桌 无柱子 </view>
            <view class="hotel-list-item-price">
              <view class="price-wrap">
                参考价
                <text class="price">250000</text>
                <text class="danwei">起</text>
              </view>
              <up-icon name="star" size="24" color="#E5E5E5"></up-icon>
            </view>
          </view>
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
.hotel-detail-page {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    width: 100%;
    height: 600rpx;
    margin-bottom: 20px;
  }
  .hotel-info {
    margin: 0 $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: 30rpx;
    margin-top: -100rpx;
    position: absolute;
    z-index: 10;
    padding-bottom: 180rpx;
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
}
</style>

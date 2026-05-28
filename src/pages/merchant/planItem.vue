
<template>
  <view class="planItem">
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
      <view class="hotel-intro">
        <image
          src="/static/images/user.png"
          mode="aspectFill"
          class="user-icon"
        ></image>
        <view class="right">
          <text class="user-name">测试测试</text>
          <text class="id">ID:3821918</text>
        </view>
      </view>
      <view class="hotel-name">盛唐宴礼宴中心(太华南路店) </view>
      <view class="hotel-address">
        是谁婚礼结束两个月了还在为日照金山疯狂心动是专属于我俩的日照金山婚庆布置真的超级超级满意结婚可太好玩啦</view
      >
      <view class="hotel-highlights">
        <text class="highlight">大厅无柱</text>
        <text class="highlight">西式婚礼</text>
        <text class="highlight">西式婚礼</text>
      </view>
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

// 定义方法
const rightClick = () => {
  console.log("rightClick");
};
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
.planItem {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    width: 100%;
    height: 600rpx;
  }
  .hotel-info {
    background: #fff;
    padding: $spacing-md;

    border-radius: 0 0 30rpx 30rpx;

    .hotel-name {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hotel-highlights {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .highlight {
      font-size: 24rpx;
      color: #bf974a;
      border: 1px solid #bf974a;
      padding: 10rpx 20rpx;
      border-radius: 24rpx;
      margin-top: 20rpx;
    }
    .hotel-address {
      font-size: 28rpx;
      color: #808080;
    }

    .hotel-intro {
      display: flex;
      align-items: center;
      padding-top: $spacing-sm;
      margin-bottom: $spacing-md;
      .user-icon {
        width: 104rpx;
        height: 104rpx;
        border-radius: 50%;
        margin-right: $spacing-md;
      }
      .user-name {
        font-size: $font-md;
        color: #383838;
        margin-right: auto;
      }
      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .id {
        font-size: $font-xs;
        color: #383838;
      }
    }
    .hotel-fuli {
      border: 1px solid #f0cd8c;
      border-radius: 30rpx;
      overflow: hidden;
      margin-top: $spacing-md;
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

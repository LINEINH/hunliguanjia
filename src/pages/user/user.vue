<template>
  <view class="user-page">
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="user-info" @click="handleLogin">
        <image
          :src="userStore.avatar || '/static/images/user.png'"
          class="user-avatar"
        />
        <view class="user-detail">
          <view class="user-top">
            <text class="user-nickname">{{ userStore.nickname }}</text>
            <image
              src="/static/images/17.png"
              mode="aspectFill"
              class="user-icon"
            />
          </view>
          <text class="user-date">婚期：2027年10月2日</text>
          <text class="user-tip" v-if="!userStore.isLoggedIn">点击登录</text>
        </view>
      </view>
      <view class="user-intro">
        <view class="user-intro-title">
          <image
            src="/static/images/18.png"
            mode="aspectFill"
            class="user-icon"
          />
          <text class="user-intro-title-text">婚礼管家服务</text>
          <view class="user-primary">咨询</view>
        </view>
        <view class="user-intro-content">
          十年婚礼经验，专属顾问一对一，让完美婚礼触手可及花小钱办大事，婚礼管家帮您省心省力更省钱
        </view>
      </view>
    </view>

    <!-- 订单入口 -->
    <!-- <view class="card"> 
      <view class="menu-item" @click="navigateTo('/pages/my-order/my-order')">
        <text class="menu-icon">📋</text>
        <text class="menu-text">我的订单</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/my-coupon/my-coupon')">
        <text class="menu-icon">🎫</text>
        <text class="menu-text">我的优惠券</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view
        class="menu-item"
        @click="navigateTo('/pages/wedding-plan/wedding-plan')"
      >
        <text class="menu-icon">📅</text>
        <text class="menu-text">婚礼计划表</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
    </view> -->

    <!-- 其他功能 -->
    <view class="card menu-list">
      <view class="menu-item" @click="navigateTo('/pages/user/butler')">
        <image
          src="/static/images/11.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">婚礼品鉴官</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/coupon')">
        <image
          src="/static/images/12.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">我的优惠券</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/gift')">
        <image
          src="/static/images/13.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">我的礼品</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/collection')">
        <image
          src="/static/images/14.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">我的收藏</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="handleLogout">
        <image
          src="/static/images/15.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">商家投诉</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
    </view>

    <!-- 自定义 TabBar -->
    <!-- <custom-tabbar :current="3" /> -->
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

// 导航
function navigateTo(url: string) {
  uni.navigateTo({ url });
}

// 登录
async function handleLogin() {
  uni.navigateTo({ url: "/pages/login/login" });
  // if (userStore.isLoggedIn) return;

  // try {
  //   await wxLogin();
  //   uni.showToast({ title: "登录成功", icon: "success" });
  // } catch (error) {
  //   console.error("登录失败:", error);
  // }
}

// 登出
function handleLogout() {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗?",
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.showToast({ title: "已退出登录", icon: "success" });
      }
    },
  });
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-page {
  background-color: #f0f0f0;
  padding-bottom: 140rpx; // 为自定义 tabBar 留出空间
  .menu-list {
    margin: $spacing-sm;
    padding: 0 $spacing-md;
  }
}

.user-header {
  //引入背景图片
  background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/10/6a28ebbe51768.png");
  background-size: cover;
  background-position: center;
  padding: $spacing-md;
  padding-bottom: 0;
  .user-info {
    display: flex;
    align-items: center;
    padding-top: 140rpx;
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: $radius-round;
      margin-right: $spacing-md;
    }

    .user-detail {
      flex: 1;
      .user-nickname {
        display: block;
        font-size: $font-lg;
        font-weight: bold;
        color: #000;
        margin-bottom: $spacing-xs;
      }
      .user-top {
        display: flex;
        align-items: center;
      }
      .user-icon {
        width: 40rpx;
        height: 40rpx;
        margin-left: $spacing-sm;
      }
      .user-date {
        font-size: $font-md;
        color: #808080;
      }

      .user-tip {
        font-size: $font-sm;
        color: $text-secondary;
      }
    }
  }
  .user-intro {
    margin-top: $spacing-md;
    background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/10/6a28ec100de21.png");
    background-size: cover;
    background-position: center;
    border-radius: 20rpx;
    padding: 48rpx 32rpx;
    .user-intro-title {
      display: flex;
      align-items: center;
      margin-bottom: $spacing-md;
      .user-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: $spacing-sm;
      }
      .user-intro-title-text {
        font-size: $font-md;
        color: #e9cc90;
        margin-right: $spacing-sm;
      }
      .user-primary {
        border-radius: 40rpx;
        background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
        color: #612500;
        font-size: $font-sm;
        padding: 6rpx 24rpx;
      }
    }
    .user-intro-content {
      font-size: $font-sm;
      color: #fff;
      line-height: 1.5;
      /* 多行文本省略 */
    }
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1rpx solid $border-light;

  &:last-child {
    border-bottom: none;
  }

  .menu-icon {
    font-size: 40rpx;
    margin-right: $spacing-md;
  }
  .menu-image {
    width: 40rpx;
    height: 40rpx;
    margin-right: $spacing-md;
  }

  .menu-text {
    flex: 1;
    font-size: $font-md;
    color: $text-primary;
  }

  .menu-arrow {
    font-size: 40rpx;
    color: $text-secondary;
  }
}
</style>

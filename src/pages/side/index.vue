<template>
  <view class="side-page">
    <up-navbar-mini
      @leftClick="leftClick"
      :autoBack="true"
      homeUrl="/pages/index/index"
    >
    </up-navbar-mini>
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="user-info">
        <image src="/static/images/user.png" class="user-avatar" />
        <view class="user-detail">
          <view class="user-top">
            <text class="user-nickname">测试个</text>
          </view>
        </view>
      </view>
    </view>
    <view class="card menu-list">
      <view class="menu-item" @click="navigateTo('/pages/side/product ')">
        <image
          src="/static/images/11.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">服务商品库</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/side/coupon')">
        <image
          src="/static/images/40.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">优惠券管理</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/side/scancode')">
        <image
          src="/static/images/41.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">核销优惠券</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/side/scanproduct')">
        <image
          src="/static/images/42.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">核销商品</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
    </view>

    <view class="actions">
      <button class="btn-index btn-main">商家首页</button>

      <button class="btn-submit btn-main">在线咨询</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getMerchantInfo } from "@/api/user";

// 定义方法
const leftClick = () => {
  console.log("leftClick");
  // 返回上一页
  uni.navigateBack();
};

// 定义用户对象
const userProfile = ref<any>(null);
// 获取用户信息
async function loadUserInfo() {
  // 检查是否有 token

  try {
    const userInfo: any = await getMerchantInfo();
    // 更新 store 中的用户信息

    console.log("用户信息:", userInfo);
    // 更新用户信息对象
    userProfile.value = userInfo;
  } catch (error) {
    console.error("获取商家信息失败:", error);
  }
}

// 导航
function navigateTo(url: string) {
  uni.navigateTo({ url });
}

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<style lang="scss" scoped>
.side-page {
  .user-header {
    //引入背景图片
    background: linear-gradient(180deg, #f1daa6 0%, #eac47b 100%);
    padding: 70rpx 24rpx;
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
    padding: $spacing-md;
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
  .actions {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding-top: 40rpx;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-main {
      width: 340rpx;
      height: 84rpx;
      line-height: 84rpx;
      border: none;
      border-radius: 20rpx;
      font-size: 30rpx;
      border: none;
    }
    .btn-submit {
      background: linear-gradient(
        136.06deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
      color: #612500;
    }
    .btn-index {
      color: #808080;
      background: linear-gradient(
          0deg,
          rgba(229, 229, 229, 1),
          rgba(229, 229, 229, 1)
        ),
        linear-gradient(135deg, #f1daa6 0%, #f9eccc 33.03%, #e9cc90 100%);
    }
  }
}

.card {
  padding: 0;
  margin: 24rpx;
}
</style>

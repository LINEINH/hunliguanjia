<template>
  <view class="order-container">
    <!-- 订单状态头部 -->
    <view class="order-status-header">
      <view class="status-icon">
        <!-- 如果项目中没有 uView UI，可以使用普通 text 或 image 替代，这里暂时用 text 模拟图标或保留原意 -->
        <text class="icon-clock">⏰</text>
      </view>
      <text class="status-text">待付款</text>
      <!-- <text class="status-desc">请在23:59前完成支付</text> -->
    </view>

    <!-- 商家信息 -->
    <view class="merchant-section">
      <view class="merchant-info">
        <!-- <view class="merchant-avatar">
          <image
            src="/static/images/merchant-avatar.png"
            mode="aspectFill"
          ></image>
        </view> -->
        <text class="merchant-name"
          >{{ userInfo.nickname }} {{ userInfo.phone }}</text
        >
      </view>
    </view>

    <view class="goods-section">
      <view class="goods-item">
        <view class="goods-image">
          <image
            :src="butlerDetail.cover_image"
            mode="aspectFill"
            class="image"
          ></image>
        </view>
        <view class="goods-info">
          <view class="goods-info-name">
            <view class="name">{{ butlerDetail.package.name }}</view>
            <view class="price">￥{{ butlerDetail.package.price }}</view>
          </view>
          <view class="goods-info-desc">
            <text class="goods-info-desc-text">{{
              butlerDetail.package.description
            }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单详情 -->
    <view class="order-details">
      <!-- <view class="detail-item">
        <text class="detail-label">优惠券</text>
        <text class="detail-value">300</text>
      </view> -->
      <view class="detail-item">
        <text class="detail-label">应付金额合计</text>
        <text class="detail-value">￥{{ butlerDetail.package.price }}</text>
      </view>
    </view>

    <!-- 价格汇总 -->
    <view class="price-summary">
      <!-- <view class="summary-item">
        <text class="summary-label">下单时间</text>
        <text class="summary-value">2026.4.27 12:22:35</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">订单编号</text>
        <text class="summary-value">358283894949838</text>
      </view> -->
      <view class="summary-item total">
        <text class="summary-label">微信支付</text>
        <text class="summary-value total-price">¥{{ finalPrice }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-actions">
      <view class="footer-price">
        共1件，合计<text class="price"
          ><text class="small">¥</text>{{ finalPrice }}</text
        >
      </view>
      <view class="btn-pay" @click="payOrder">提交订单</view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
const show = ref(false);
import { getOrdersDetail, payOrder } from "@/api/user";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

// 管家详情数据
const butlerDetail = ref(null);
const loading = ref(false);

// 定义一个参数接收用户信息
const userInfo = ref(null);
userInfo.value = userStore.userInfo;

// 定义一个参数接口传过来的index值
const indexItem = ref(null);
const finalPrice = computed(() => {
  if (butlerDetail.value) {
    return butlerDetail.value.package.price;
  }
  return 0;
});

// 获取页面参数并加载详情
onLoad((options) => {
  console.log("页面参数:", options);
  const id = options.id || 24;
  const index = options.index;
  if (id) {
    loadButlerDetail(Number(id));
  }
});

// 加载管家详情
async function loadButlerDetail(id) {
  loading.value = true;
  try {
    const res = await getOrdersDetail(id);
    if (res && res) {
      butlerDetail.value = res;
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

function buyNow(index, id) {
  uni.navigateTo({
    url: `/pages/user/order?index=${index}&id=${id}`,
  });
}
</script>

<style lang="scss" scoped>
.order-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.order-status-header {
  background: linear-gradient(
    235.75deg,
    #bf974a 0%,
    #eac47b 46.23%,
    #f2dca7 100%
  );
  color: white;
  text-align: center;
  padding: 60rpx 40rpx 80rpx;

  .status-icon {
    margin-bottom: 20rpx;
    font-size: 80rpx;
  }

  .status-text {
    font-size: 40rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 20rpx;
  }

  .status-desc {
    font-size: 28rpx;
    opacity: 0.9;
  }
}

.merchant-section {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .merchant-info {
    display: flex;
    align-items: center;

    .merchant-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .merchant-name {
      font-size: 32rpx;
      font-weight: bold;
      flex: 1;
    }

    .merchant-service {
      font-size: 24rpx;
      color: #999;
    }
  }
}
.goods-section {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  .goods-item {
    display: flex;

    .goods-image {
      width: 140rpx;
      height: 140rpx;
      margin-right: 20rpx;

      .image {
        width: 140rpx;
        height: 140rpx;
        border-radius: 20rpx;
      }
    }
    .goods-info {
      flex: 1;
    }
    .goods-info-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.order-details {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;

    &:not(:last-child) {
      border-bottom: 1rpx solid #f0f0f0;
    }

    .detail-label {
      font-size: 28rpx;
      color: #666;
      width: 200rpx;
    }

    .detail-value {
      font-size: 28rpx;
      color: #f55726;
      flex: 1;
      text-align: right;
    }
  }
}

.service-details {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    color: #333;
  }

  .service-list {
    .service-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;

      &:not(:last-child) {
        border-bottom: 1rpx solid #f0f0f0;
      }

      .service-name {
        font-size: 28rpx;
        color: #333;
      }

      .service-price {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.price-summary {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 0;

    &.total {
      border-top: 1rpx solid #f0f0f0;
      padding-top: 20rpx;
      margin-top: 10rpx;

      .summary-label {
        font-weight: bold;
        font-size: 32rpx;
      }

      .total-price {
        font-weight: bold;
        font-size: 36rpx;
        color: #ff7e24;
      }
    }

    .summary-label {
      font-size: 28rpx;
      color: #666;
    }

    .summary-value {
      font-size: 28rpx;
      color: #333;

      &.text-red {
        color: #e63c3c;
      }
    }
  }
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx 30rpx 20rpx;
  background: white;
  border-top: 1rpx solid #ececec;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .footer-price {
    color: #333333;
    margin-right: 20rpx;
    .price {
      font-size: 32rpx;
      color: #f55726;
    }
    .small {
      font-size: 24rpx;
    }
  }
  .btn-pay {
    background: linear-gradient(
      131.82deg,
      #f1daa6 0%,
      #f9eccc 33.03%,
      #e9cc90 100%
    );
    color: #612500;

    border-radius: 50rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    padding: 0 40rpx;
  }
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
<template>
  <view class="order-container">
    <!-- 订单状态头部 -->
    <view class="order-status-header">
      <view class="status-icon">
        <!-- 如果项目中没有 uView UI，可以使用普通 text 或 image 替代，这里暂时用 text 模拟图标或保留原意 -->
        <text class="icon-clock">⏰</text>
      </view>
      <text class="status-text">待付款</text>
      <text class="status-desc">请在23:59前完成支付</text>
    </view>

    <!-- 商家信息 -->
    <view class="merchant-section">
      <view class="merchant-info">
        <view class="merchant-avatar">
          <image
            src="/static/images/merchant-avatar.png"
            mode="aspectFill"
          ></image>
        </view>
        <text class="merchant-name">李四 177****0000</text>
      </view>
    </view>

    <view class="goods-section">
      <view class="goods-item">
        <view class="goods-image">
          <image
            src="/static/images/test.png"
            mode="aspectFill"
            class="image"
          ></image>
        </view>
        <view class="goods-info">
          <view class="goods-info-name">
            <view class="name">全程陪同</view>
            <view class="price">￥100</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单详情 -->
    <view class="order-details">
      <view class="detail-item">
        <text class="detail-label">优惠券</text>
        <text class="detail-value">300</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">应付金额合计</text>
        <text class="detail-value">60000</text>
      </view>
    </view>

    <!-- 价格汇总 -->
    <view class="price-summary">
      <view class="summary-item">
        <text class="summary-label">下单时间</text>
        <text class="summary-value">2026.4.27 12:22:35</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">订单编号</text>
        <text class="summary-value">358283894949838</text>
      </view>
      <view class="summary-item total">
        <text class="summary-label">微信支付</text>
        <text class="summary-value total-price">¥{{ finalPrice }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-actions">
      <view class="footer-price">
        共1件，合计<text class="price"><text class="small">¥</text>1666</text>
      </view>
      <view class="btn-pay" @click="payOrder">提交订单</view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 服务项目列表
const services = ref([
  { name: "婚礼策划师服务", price: "800" },
  { name: "场地布置", price: "1200" },
  { name: "新娘化妆", price: "600" },
  { name: "婚礼摄影", price: "1000" },
  { name: "婚礼摄像", price: "800" },
]);

// 价格计算
const totalPrice = computed(() => {
  return services.value.reduce(
    (sum, service) => sum + Number(service.price),
    0
  );
});

const discount = ref(200); // 优惠金额

const finalPrice = computed(() => {
  return totalPrice.value - discount.value;
});

// 取消订单
const cancelOrder = () => {
  uni.showModal({
    title: "确认取消",
    content: "确定要取消此订单吗？",
    success: (res) => {
      if (res.confirm) {
        console.log("用户确认取消订单");
        // 这里可以添加取消订单的逻辑
        uni.navigateBack();
      }
    },
  });
};

// 支付订单
const payOrder = () => {
  console.log("用户点击支付");
  // 这里可以添加支付逻辑
  uni.showLoading({
    title: "支付中...",
  });

  // 模拟支付过程
  setTimeout(() => {
    uni.hideLoading();
    uni.showModal({
      title: "支付结果",
      content: "模拟支付成功！",
      showCancel: false,
      success: () => {
        // 支付成功后的逻辑
        console.log("支付成功");
        uni.navigateBack();
      },
    });
  }, 1500);
};
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
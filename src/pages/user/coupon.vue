<template>
  <view class="user-coupon-page">
    <view class="tabview">
      <up-tabs
        :list="list"
        @click="click"
        scrollable="false"
        lineWidth="20"
        lineColor="#333333"
        :activeStyle="{
          color: '#333333',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: '#999999',
          transform: 'scale(1)',
        }"
        itemStyle="width: 33.33%;text-align: center; height: 80rpx;"
      ></up-tabs>
    </view>
    <view class="couponList">
      <view v-if="coupons.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
      <view class="couponTtem" v-for="item in coupons" :key="item.id">
        <view class="iteminfo">
          <view class="coupon-title">
            <text class="coupon-name">{{ item.template.name }}</text>
            <text class="coupon-shop">{{ item.template.merchant.name }}</text>
            <text class="coupon-shop">{{ item.template.expired_at }}</text>
          </view>
          <view class="coupon-price">
            <text class="coupon-price"
              ><text class="coupon-get">￥</text>{{ item.template.value }}</text
            >
            <text class="coupon-get">满{{ item.template.min_amount }}使用</text>
          </view>
        </view>
        <view class="recipt">
          <view class="recipt-rule"> </view>
          <view class="recipt-get">
            <text class="recipt-get">二维码</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getMyCoupons } from "@/api/coupon";

// 创建响应式数据
const list = reactive([
  { name: "未使用" },
  { name: "已使用" },
  { name: "已过期" },
]);

// 当前选中的tab
const activeTab = ref(0);

// 优惠券列表
const coupons = ref([]);

// 当前状态的优惠券列表
const filteredCoupons = computed(() => {
  if (activeTab.value === 0) {
    return coupons.value.filter((coupon) => coupon.status === "未使用");
  } else if (activeTab.value === 1) {
    return coupons.value.filter((coupon) => coupon.status === "已使用");
  } else {
    return coupons.value.filter((coupon) => coupon.status === "已过期");
  }
});

// 空状态文本
const emptyText = computed(() => {
  const texts = [
    "暂无未使用的优惠券",
    "暂无已使用的优惠券",
    "暂无已过期的优惠券",
  ];
  return texts[activeTab.value];
});

// 定义方法
function click(index) {
  activeTab.value = index;
  loadCoupons(index.index);
}

// 获取优惠券列表
const loadCoupons = async (status) => {
  try {
    const response = await getMyCoupons(status);
    coupons.value = response.data || [];
  } catch (error) {
    console.error("获取优惠券列表失败:", error);
    uni.showToast({
      title: "获取优惠券失败",
      icon: "none",
    });
  }
};

// 使用优惠券
const useCoupon = () => {
  console.log("使用优惠券:", coupon);
  uni.navigateTo({
    url: `/pages/product-list?couponId=${coupon.id}`,
  });
};

// 复制核销码
const copyCode = () => {
  uni.setClipboardData({
    data: code,
    success: () => {
      uni.showToast({
        title: "核销码已复制",
        icon: "success",
      });
    },
  });
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

// 获取状态类名
const getStatusClass = (status) => {
  return `coupon-${status.toLowerCase()}`;
};

onMounted(() => {
  loadCoupons(0);
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-coupon-page {
  background: #f0f0f0;
  min-height: 100vh;

  .tabview {
    background: #fff;
    padding: 20rpx 0;
  }
  .couponList {
    padding: 20rpx;
    .couponTtem {
      background: #fff;
      padding: 20rpx 40rpx;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      .iteminfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px dashed #f1f1f1;
        .coupon-title {
          display: flex;
          flex-direction: column;
          .coupon-name {
            font-size: 30rpx;
            font-weight: bold;
            color: #3f3f3f;
            margin-bottom: 10rpx;
          }
          .coupon-shop {
            font-size: 24rpx;
            color: #999999;
            margin-bottom: 10rpx;
          }
        }
        .coupon-price {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .coupon-price {
            font-size: 60rpx;
            color: #bf974a;
            font-weight: bold;
          }
          .coupon-get {
            font-size: 28rpx;
            color: #bf974a;
          }
        }
      }
      .recipt {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20rpx;
        .recipt-rule {
          font-size: 28rpx;
          color: #999999;
        }
        .recipt-get {
          color: #612500;
          padding: 10rpx 20rpx;
          font-size: 28rpx;
          opacity: 1;
          border-radius: 30rpx;
          background: linear-gradient(
            135deg,
            #f1daa6 0%,
            #f9eccc 33.03%,
            #e9cc90 100%
          );
        }
      }
    }
  }
}
</style>
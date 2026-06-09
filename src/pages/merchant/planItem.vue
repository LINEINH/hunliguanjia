
<template>
  <view class="planItem">
    <up-navbar
      :title="productData.name || '产品详情'"
      @rightClick="rightClick"
      :autoBack="true"
    >
    </up-navbar>

    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in productData.images" :key="index">
          <image :src="item.image_url" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="hotel-info">
      <view class="hotel-intro">
        <image
          :src="productData.merchant.logo"
          mode="aspectFill"
          class="user-icon"
        ></image>
        <view class="right">
          <text class="user-name">{{ productData.merchant.name }}</text>
          <!-- <text class="id">ID:{{ productData.merchant.contact_name }}</text> -->
        </view>
      </view>
      <view class="hotel-name">{{ productData.name }} </view>
      <view class="hotel-address">
        {{ productData.description }}
      </view>
      <view
        class="hotel-highlights"
        v-if="productData.tags && productData.tags.length"
      >
        <text
          class="highlight"
          v-for="(tag, index) in productData.tags"
          :key="index"
          >{{ tag }}</text
        >
      </view>
      <view class="content" v-if="cleanedContent">
        <rich-text :nodes="cleanedContent"></rich-text>
      </view>
    </view>

    <view class="hotel-footer">
      <view class="hotel-footer-item">
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

      <view class="hotel-footer-tel button" @click="makePhoneCall">
        电话咨询
      </view>
      <view class="hotel-footer-online button"> 在线管家 </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  getProductDetail,
  favoriteProduct,
  unfavoriteProduct,
} from "@/api/product";

// 产品数据
const productData = ref<any>({});

// 产品ID
const hotelId = ref<number | null>(null);

// 收藏状态
const isFavorited = ref<boolean>(false);

// onLoad 参数接收器
const props = defineProps<{
  id?: string;
}>();

// 清理HTML中的图片内联样式并添加宽度控制
function cleanHtmlContent(html: string): string {
  if (!html) return html;

  // 移除img标签中的style属性
  let cleaned = html.replace(
    /<img([^>]*)\s+style\s*=\s*["'][^"']*["']/gi,
    "<img$1"
  );

  // 如果style是空的,也移除
  cleaned = cleaned.replace(
    /<img([^>]*)\s+style\s*=\s*["']\s*["']/gi,
    "<img$1"
  );

  // 为所有img标签添加width:100%的style属性
  cleaned = cleaned.replace(
    /<img([^>]*?)>/gi,
    '<img$1 style="width:100%;height:auto;display:block;">'
  );

  return cleaned;
}

// 计算属性:清理后的内容
const cleanedContent = computed(() => {
  return cleanHtmlContent(productData.value.content || "");
});

// 加载产品详情
async function loadProductDetail() {
  if (!hotelId.value) {
    uni.showToast({
      title: "缺少产品ID",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: "加载中...",
    });

    const response = await getProductDetail(hotelId.value);

    productData.value = response;
    isFavorited.value = response.is_favorited || false; // 假设接口返回了is_favorited字
    console.log("产品详情:", response);
  } catch (error) {
    console.error("获取产品详情失败:", error);
    uni.showToast({
      title: "获取产品详情失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
}

// 页面加载时获取产品详情
onMounted(() => {
  if (props.id) {
    hotelId.value = Number(props.id);
    loadProductDetail();
  } else {
    uni.showToast({
      title: "缺少产品ID",
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
    content: "是否拨打产品联系电话？",
    success: function (res) {
      if (res.confirm) {
        // 实际项目中这里应该替换成产品的真实电话
        uni.makePhoneCall({
          phoneNumber: productData.value.merchant?.phone || "13800138000", // 尝试获取真实电话，否则使用示例
        });
      }
    },
  });
}

function handleOnlineService() {
  uni.showToast({
    title: "在线管家功能开发中",
    icon: "none",
  });
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
      await unfavoriteProduct(hotelId.value, "merchant");
      isFavorited.value = false;
      uni.showToast({
        title: "已取消收藏",
        icon: "success",
      });
    } else {
      // 收藏
      await favoriteProduct(hotelId.value, "merchant");
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
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.planItem {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    margin-top: 80rpx;
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
    .content {
      margin-top: $spacing-md;
      background: #fff;
      border-radius: 20rpx;
      padding-bottom: $spacing-md;
      :deep(rich-text) {
        line-height: 1.8;
        font-size: 28rpx;
        color: #383838;

        // 强制所有图片元素宽度100%
        img,
        image,
        [class*="img"],
        [class*="image"] {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
          display: block !important;
          border-radius: 10rpx;
          object-fit: contain;
        }

        // 处理 div 容器中的图片
        div img,
        p img,
        span img {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
          display: block !important;
        }

        p {
          margin-bottom: $spacing-sm;
        }
      }
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


<template>
  <view class="tasting">
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in productData.images" :key="index">
          <image :src="item" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { useUserStore } from "@/store/modules/user";

// 获取用户store
const userStore = useUserStore();

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

// 计算属性:清理后的内容
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.tasting {
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
}
</style>


<template>
  <view class="tasting">
    <!-- <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in productData.images" :key="index">
          <image :src="item" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view> -->
    <view class="register-form">
      <view class="code">婚博会报名</view>
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input
          class="form-input"
          v-model="formData.user_name"
          placeholder="请输入姓名"
          type="text"
        />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input
          class="form-input"
          v-model="formData.user_phone"
          placeholder="请输入手机号"
          type="number"
          maxlength="11"
        />
      </view>
      <view class="button" @click="handleRegister"> 立即参与 </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { checkLogin, navigateToLogin } from "@/utils/auth";

import { enroll } from "@/api/user";

import { useUserStore } from "@/store/modules/user";

// 获取用户store
const userStore = useUserStore();

// 报名表单数据
const formData = ref({
  user_name: "",
  user_phone: "",
});

// 处理报名
async function handleRegister() {
  if (!checkLogin()) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再报名",
      confirmText: "去登录",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          navigateToLogin();
        }
      },
    });
    return;
  }

  // 表单验证
  if (!formData.value.user_name || !formData.value.user_name.trim()) {
    uni.showToast({
      title: "请输入姓名",
      icon: "none",
    });
    return;
  }

  if (!formData.value.user_phone || !formData.value.user_phone.trim()) {
    uni.showToast({
      title: "请输入手机号",
      icon: "none",
    });
    return;
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formData.value.user_phone)) {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: "报名中...",
    });

    const res = await enroll(
      formData.value.user_name,
      formData.value.user_phone
    );
    if (res.registration) {
      // 报名成功后可以更新状态或跳转到其他页面
      uni.showToast({
        title: "报名成功",
        icon: "success",
      });
    }

    // 清空表单
    formData.value = {
      user_name: "",
      user_phone: "",
    };
  } catch (error) {
    uni.hideLoading();
    console.error("报名失败:", error);
    uni.showToast({
      title: "报名失败，请重试",
      icon: "none",
    });
  }
}

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

  .register-form {
    background: #fff;
    padding: $spacing-lg;
    .form-item {
      margin-bottom: $spacing-md;

      .form-label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: $spacing-sm;
        font-weight: 500;
      }

      .form-input {
        height: 80rpx;
        padding: 0 $spacing-md;
        border: 1rpx solid #e0e0e0;
        border-radius: $radius-sm;
        font-size: 28rpx;
        color: #333;
        background-color: #f8f8f8;

        &:focus {
          border-color: #bf974a;
          background-color: #fff;
        }
      }
    }

    .button {
      border-radius: 40rpx;
      background: linear-gradient(
        161.33deg,
        #f1daa6 0%,
        #f9eccc 44.04%,
        #e9cc90 100%
      );
      height: 80rpx;
      text-align: center;
      font-size: 32rpx;
      color: #805608;
      line-height: 80rpx;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>

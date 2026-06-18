
<template>
  <view class="tasting">
    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image
            :src="item.image_url"
            mode="aspectFill"
            class="banner-image"
            @click="handleBannerClick()"
          />
        </swiper-item>
      </swiper>
    </view>
    <view class="register-form">
      <view class="code">管家带你实地体验备婚流程</view>
      <view class="form-item">
        <text class="form-label">是否参与直播</text>
        <view class="stream">
          <view
            class="stream-btn"
            :class="{ active: formData.is_live_stream }"
            @click="changeStream()"
          >
            是
          </view>
          <view
            class="stream-btn"
            :class="{ active: !formData.is_live_stream }"
            @click="changeStream()"
          >
            否
          </view>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input
          class="form-input"
          v-model="formData.name"
          placeholder="请输入姓名"
          type="text"
        />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input
          class="form-input"
          v-model="formData.phone"
          placeholder="请输入手机号"
          type="number"
          maxlength="11"
        />
      </view>
      <view class="button" @click="handleRegister"> 立即参与 </view>
    </view>

    <up-popup
      :show="show"
      mode="center"
      :round="10"
      @close="close"
      @open="open"
      closeable="true"
    >
      <view>
        <image :src="codeUrl" mode="aspectFill" class="codeimage"></image>
      </view>
    </up-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { checkLogin, navigateToLogin } from "@/utils/auth";

import { getBanner, registerTasting } from "@/api/user";

import { useUserStore } from "@/store/modules/user";

// 获取用户store
const userStore = useUserStore();

// 定义banner
const banners = ref<any>([]);

// 报名表单数据
const formData = ref({
  name: "",
  phone: "",
  is_live_stream: true,
});

// 写changeStream方法
// 改变is_live_stream状态
function changeStream() {
  formData.value.is_live_stream = !formData.value.is_live_stream;
}

async function handleBannerClick() {
  try {
    const response = await getBanner("wine_tasting_popup");
    if (response) {
      codeUrl.value = response[0].image_url;
      open();
    }
  } catch (error) {
    console.error("请求推荐商家数据出错:", error);
  }

  open();
}

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
  if (!formData.value.name || !formData.value.name.trim()) {
    uni.showToast({
      title: "请输入姓名",
      icon: "none",
    });
    return;
  }

  if (!formData.value.phone || !formData.value.phone.trim()) {
    uni.showToast({
      title: "请输入手机号",
      icon: "none",
    });
    return;
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formData.value.phone)) {
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

    const res = await registerTasting(
      formData.value.name,
      formData.value.phone,
      formData.value.is_live_stream
    );
    if (res) {
      // 报名成功后可以更新状态或跳转到其他页面
      uni.showToast({
        title: "参与成功",
        icon: "success",
      });
    }

    // 清空表单
    formData.value = {
      name: "",
      phone: "",
      is_live_stream: true,
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

// 获取banner
const loadGetBanner = async () => {
  try {
    const response = await getBanner("wine_tasting");
    banners.value = response || [];
    console.log("banner:", response);
  } catch (error) {
    console.error("请求推荐商家数据出错:", error);
  }
};

// 创建响应式数据
const show = ref(false);

const codeUrl = ref("");

function open() {
  show.value = true;
}
function close() {
  // 关闭逻辑，设置 show 为 false
  show.value = false;
  // console.log('close');
}
onMounted(() => {
  loadGetBanner();
});

// 计算属性:清理后的内容
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.tasting {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    .banner-swiper {
      height: 500rpx;
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
      .stream {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 30rpx $spacing-md;
        box-sizing: border-box;
        .stream-btn {
          color: #808080;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 310rpx;
          height: 80rpx;
          border-radius: 20rpx;
          background: linear-gradient(
              0deg,
              rgba(229, 229, 229, 1),
              rgba(229, 229, 229, 1)
            ),
            linear-gradient(
              135deg,
              rgba(241, 218, 166, 1) 0%,
              rgba(249, 236, 204, 1) 33.03%,
              rgba(233, 204, 144, 1) 100%
            );
        }
        .active {
          color: #612500;
          background: linear-gradient(
            135deg,
            rgba(241, 218, 166, 1) 0%,
            rgba(249, 236, 204, 1) 33.03%,
            rgba(233, 204, 144, 1) 100%
          );
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
  .codeimage {
    width: 600rpx;
    height: 600rpx;
    margin: 32rpx auto;
    display: block;
  }
}
</style>

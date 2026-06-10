<template>
  <view class="expodetail-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">加载中...</view>

    <!-- 详情内容 -->
    <view v-else-if="expoDetail" class="detail-content">
      <view class="banner">
        <image
          :src="expoDetail.cover_image || '/static/images/post.png'"
          mode="widthFix"
          class="banner-image"
        />
      </view>

      <view class="step">
        <view class="steptitle">
          <image
            src="/static/images/left.png"
            mode="aspectFill"
            class="titleimage" />
          01.活动流程
          <image
            src="/static/images/right.png"
            mode="aspectFill"
            class="titleimage"
        /></view>
        <view class="stepcon">
          <rich-text :nodes="expoDetail.introduction"></rich-text>
        </view>
      </view>

      <view class="step">
        <view class="steptitle">
          <image
            src="/static/images/left.png"
            mode="aspectFill"
            class="titleimage" />
          02.展会地址
          <image
            src="/static/images/right.png"
            mode="aspectFill"
            class="titleimage"
        /></view>
        <view class="map">
          <view class="stepcon">
            <view class="wrap">
              <up-icon name="map" size="14" color="#383838"> </up-icon>
              <text class="left">{{ expoDetail.venue }}：</text
              >{{ expoDetail.address_text }}
            </view>
            <view class="map">
              <image
                :src="expoDetail.address_image"
                mode="widthFix"
                class="map"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="step" v-if="expoDetail.status === 1">
        <view class="register-form" v-if="!expoDetail.qr_code">
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
          <view class="button" @click="handleRegister"> 立即报名 </view>
        </view>
        <view v-else>
          <view class="code">参会二维码</view>
          <image
            :src="expoDetail.qr_code || '/static/images/post.png'"
            mode="aspectFill"
            class="codeimage"
          />
          <view class="intro">*展会入场凭证，入场时向工作人员出示即可。</view>
        </view>
      </view>

      <view class="ad">
        <image
          src="/static/images/post1.png"
          mode="widthFix"
          class="ad-image"
          @click="navigateToDetail"
        />
      </view>

      <view class="step">
        <view class="steptitle">
          <image
            src="/static/images/left.png"
            mode="aspectFill"
            class="titleimage" />
          03.参会商家
          <image
            src="/static/images/right.png"
            mode="aspectFill"
            class="titleimage"
        /></view>
        <view class="logolist">
          <view
            class="logoItem"
            v-for="(item, index) in expoDetail.merchant_logos"
            :key="index"
          >
            <image :src="item" mode="aspectFill" class="logoItemImg" />
          </view>
        </view>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="error-state">
      <text>加载失败，请重试</text>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getExpoDetail, registerExpo } from "@/api/expo";

// 婚博会详情数据
const expoDetail = ref<any>(null);
const loading = ref(true);
const expoId = ref<number>(0);
const qrCode = ref<string>("");

// 报名表单数据
const formData = ref({
  user_name: "",
  user_phone: "",
});

// 页面加载时获取参数
onLoad((options: any) => {
  if (options.id) {
    expoId.value = Number(options.id);
    fetchExpoDetail();
  } else {
    uni.showToast({
      title: "参数错误",
      icon: "none",
    });
    loading.value = false;
  }
});

// 获取婚博会详情
async function fetchExpoDetail() {
  try {
    loading.value = true;
    const response = await getExpoDetail(expoId.value);
    expoDetail.value = response;
  } catch (error) {
    console.error("获取婚博会详情失败:", error);
    uni.showToast({
      title: "获取详情失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
}

// 处理报名
async function handleRegister() {
  if (!expoDetail.value) return;

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

    const res = await registerExpo(
      expoId.value.toString(),
      formData.value.user_name,
      formData.value.user_phone
    );
    if (res.registration) {
      // 报名成功后可以更新状态或跳转到其他页面
      qrCode.value = res.registration.qrcode;
      uni.hideLoading();
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

// 导航到商家列表
function navigateToDetail() {
  uni.navigateTo({ url: "/pages/expo/exchange" });
}
</script>
<style lang="scss" scoped>
.expodetail-container {
  background: #f0f0f0;
  padding: $spacing-md;
  padding-top: 0;

  .loading-state,
  .error-state {
    text-align: center;
    padding: 100rpx 0;
    font-size: 28rpx;
    color: #999;
  }

  .banner {
    margin: $spacing-md 0;

    .banner-image {
      width: 100%;
      border-radius: 0 0 $radius-md $radius-md;
    }
  }
  .step {
    margin-bottom: $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: $radius-md;

    .register-form {
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
          width: 100%;
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
        margin-top: $spacing-lg;
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
    .steptitle {
      color: #bf974a;
      font-size: 40rpx;
      font-weight: bold;
      text-align: center;
      margin: 16rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .titleimage {
        width: 16rpx;
        height: 30rpx;
        margin: 0 10rpx;
      }
    }
    .code {
      font-size: 32rpx;
      color: #000000;
      text-align: center;
      font-weight: bold;
    }
    .codeimage {
      width: 400rpx;
      height: 400rpx;
      margin: 32rpx auto;
      display: block;
    }
    .intro {
      font-size: 24rpx;
      color: #727272;
      text-align: center;
    }
    .stepcon {
      display: flex;
      flex-direction: column;
      .wrap {
        font-size: 28rpx;
        color: #727272;
        margin-bottom: 20rpx;
        line-height: 1.5;
        display: flex;
        align-items: center;
        .left {
          color: #383838;
        }
      }
      .map {
        width: 100%;
      }
    }
  }

  .ad {
    margin-bottom: $spacing-md;
    .ad-image {
      width: 100%;
      border-radius: $radius-md;
    }
  }
  .logolist {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;

    .logoItem {
      width: 100rpx;
      margin: 0 20rpx;
      margin-top: 20rpx;
      .logoItemImg {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }
    }
  }
}
</style>
<template>
  <view class="expodetail-1container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">加载中...</view>

    <!-- 详情内容 -->
    <view v-else-if="expoDetail" class="detail-content">
      <view class="banner">
        <image
          :src="item || '/static/images/post.png'"
          mode="widthFix"
          class="banner-image"
          v-for="(item, index) in expoDetail.history_media"
          :key="index"
        />
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
import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { getExpoDetail, registerExpo } from "@/api/expo";
import { checkLogin, navigateToLogin } from "@/utils/auth";

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

// 注册报名
const submitForm = async () => {
  if (!formData.value.user_name.trim()) {
    uni.showToast({
      title: "请输入姓名",
      icon: "none",
    });
    return;
  }

  if (!formData.value.user_phone.trim()) {
    uni.showToast({
      title: "请输入联系电话",
      icon: "none",
    });
    return;
  }

  if (!expoId.value) {
    uni.showToast({
      title: "活动ID不能为空",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: "提交中...",
      mask: true,
    });

    // 修正函数参数，根据API定义，registerExpo需要4个参数
    // 修正函数参数，根据API定义，registerExpo需要4个参数
    // registerExpo(activity_id: string, user_name: string, user_phone: string, merchant_id: string)
    const res = await registerExpo(
      expoId.value.toString(), // activity_id
      formData.value.user_name, // user_name
      formData.value.user_phone, // user_phone
      "0" // merchant_id (对于普通报名，使用默认值)
    );

    uni.hideLoading();

    if (res) {
      uni.showToast({
        title: "报名成功",
        icon: "success",
      });

      // 清空表单
      formData.value = {
        user_name: "",
        user_phone: "",
      };

      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  } catch (error) {
    uni.hideLoading();
    console.error("报名失败:", error);
    uni.showToast({
      title: "报名失败，请重试",
      icon: "none",
    });
  }
};

// 导航到商家列表
function navigateToDetail() {
  uni.navigateTo({ url: `/pages/expo/exchange?id=${expoDetail.value.id}` });
}

// 打开地图
function openMap() {
  if (!expoDetail.value) return;

  const { longitude, latitude, venue, address_text } = expoDetail.value;

  // 验证经纬度是否存在
  if (!longitude || !latitude) {
    uni.showToast({
      title: "位置信息不完整",
      icon: "none",
    });
    return;
  }

  // 调用微信小程序地图 API
  uni.openLocation({
    longitude: Number(longitude),
    latitude: Number(latitude),
    name: venue || "婚博会地点",
    address: address_text || "",
    success: () => {
      console.log("打开地图成功");
    },
    fail: (err) => {
      console.error("打开地图失败:", err);
      uni.showToast({
        title: "打开地图失败",
        icon: "none",
      });
    },
  });
}

// 页面分享
onShareAppMessage(() => {
  return {
    title: "精彩回顾 - 壹嫁婚选",
    path: "/pages/expo/history",
    imageUrl: expoDetail.value.history_media[0],
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "婚博会精彩回顾 - 壹嫁婚选",
    path: "/pages/expo/history",
    imageUrl: expoDetail.value.history_media[0],
  };
});
</script>
<style lang="scss" scoped>
.expodetail-1container {
  background: #f0f0f0;

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
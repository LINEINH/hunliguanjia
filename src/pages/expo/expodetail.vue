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
          <image
            :src="expoDetail.gift_exchange_image"
            mode="aspectFill"
            style="width: 100%"
          />
          <!-- <rich-text :nodes="expoDetail.content"></rich-text> -->
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
          <view class="stepcon" @click="openMap">
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
        <view
          v-if="expoDetail.registration_status === 'checked_in'"
          class="checked_in"
        >
          <image
            src="/static/images/44.png"
            mode="widthFix"
            class="okImg"
            v-if="expoDetail.gift && expoDetail.gift.status === 1"
          />
          <view class="code">婚博会礼品</view>
          <view class="gift_name">{{ expoDetail.gift.gift_name }}</view>
          <image
            :src="expoDetail.gift.qr_code_image_url"
            mode="widthFix"
            class="codeimage"
          />
          <view class="pickup_location"
            >{{ expoDetail.gift.merchant_name }}
            {{ expoDetail.gift.pickup_location }}</view
          >
        </view>
        <template v-else>
          <view class="register-form" v-if="!expoDetail.qr_code">
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
            <view class="renew"
              ><up-icon
                name="reload"
                size="38"
                color="#EAC47B"
                class="icon"
                @click="fetchExpoDetail()"
              ></up-icon
            ></view>
          </view>
        </template>
      </view>
      <!-- 
      <view class="ad">
        <image
          src="/static/images/post1.png"
          mode="widthFix"
          class="ad-image"
          @click="navigateToDetail"
        />
      </view> -->

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
import { checkLogin, navigateToLogin } from "@/utils/auth";

// 婚博会详情数据
const expoDetail = ref<any>(null);
const loading = ref(true);
const expoId = ref<number>(0);
const qrCode = ref<string>("");
const merchantIdRouter = ref<string>("");

// 报名表单数据
const formData = ref({
  user_name: "",
  user_phone: "",
});

// 页面加载时获取参数
onLoad((options: any) => {
  console.log("=== expodetail 页面加载 ===");
  console.log("原始参数:", options);

  let expoIdValue = 0;
  let merchantId = "";

  // 方式1: 直接从 id 参数获取
  if (options.id) {
    expoIdValue = Number(options.id);
    console.log("从 id 参数获取:", expoIdValue);
  }
  // 方式2: 从 scene 参数获取（小程序码扫码）
  else if (options.scene) {
    console.log("检测到 scene 参数:", options.scene);

    try {
      // URL 解码 scene 参数
      const decodedScene = decodeURIComponent(options.scene);
      console.log("scene 解码后:", decodedScene);

      // 解析 scene 中的参数 (格式: id=1&m_id=8)
      const sceneParams: any = {};
      const pairs = decodedScene.split("&");

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        const key = pair[0].trim();
        const value = pair[1] ? pair[1].trim() : "";
        sceneParams[key] = value;
      }

      console.log("解析后的 scene 参数:", sceneParams);

      // 获取 id 和 m_id
      expoIdValue = Number(sceneParams.id || 0);
      merchantId = sceneParams.m_id || "";
      merchantIdRouter.value = sceneParams.m_id || "";

      console.log("解析结果 - expoId:", expoIdValue, "merchantId:", merchantId);

      if (!expoIdValue) {
        uni.showToast({
          title: "参数错误",
          icon: "none",
        });
        loading.value = false;
        return;
      }
    } catch (error) {
      console.error("解析 scene 参数失败:", error);
      uni.showToast({
        title: "参数解析失败",
        icon: "none",
      });
      loading.value = false;
      return;
    }
  }
  // 方式3: 都没有
  else {
    console.error("缺少必要参数");
    uni.showToast({
      title: "参数错误",
      icon: "none",
    });
    loading.value = false;
    return;
  }

  // 设置 expoId 并获取详情
  expoId.value = expoIdValue;
  console.log("准备获取婚博会详情，ID:", expoId.value);
  fetchExpoDetail();
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
      formData.value.user_phone,
      merchantIdRouter.value || ""
    );
    if (res.registration) {
      // 报名成功后可以更新状态或跳转到其他页面
      uni.showToast({
        title: "报名成功",
        icon: "success",
      });
      setTimeout(() => {
        uni.hideLoading();
        qrCode.value = res.registration.qr_code;
        fetchExpoDetail();
      }, 1500);
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
    .checked_in {
      position: relative;
      .pickup_location {
        text-align: center;
      }
      .okImg {
        width: 200rpx;
        position: absolute;
        right: 120rpx;
        top: 120rpx;
        background: #fff;
      }
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
  .renew {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
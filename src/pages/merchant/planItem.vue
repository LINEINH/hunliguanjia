
<template>
  <view class="planItem">
    <up-navbar
      :title="productData.name || '产品详情'"
      @rightClick="rightClick"
      :autoBack="true"
      placeholder
    >
      <template #left>
        <view class="u-nav-slot">
          <up-icon name="arrow-left" size="20"></up-icon>
          <up-line
            direction="column"
            :hairline="false"
            length="16"
            margin="0 8px"
            v-if="share"
          ></up-line>
          <up-icon
            name="home"
            size="24"
            v-if="share"
            homeUrl="/pages/index/index"
          ></up-icon>
        </view>
      </template>
    </up-navbar>

    <view class="banner">
      <swiper
        class="banner-swiper"
        autoplay
        circular
        indicator-dots
        indicator-active-color="#fff"
        interval="3000"
        duration="500"
      >
        <swiper-item v-for="(item, index) in productData.images" :key="index">
          <image
            :src="item.image_url"
            mode="widthFix"
            class="banner-image"
            lazy-load
          />
        </swiper-item>
      </swiper>
    </view>
    <view class="hotel-info">
      <view class="hotel-intro" @click="openDetail(productData.merchant)">
        <image
          :src="productData.merchant.logo"
          mode="aspectFill"
          class="user-icon"
          v-if="productData.merchant && productData.merchant.logo"
          lazy-load
        ></image>
        <view class="right">
          <view class="user-name">{{ productData.merchant.name }}</view>

          <!-- <text class="id">ID:{{ productData.merchant.contact_name }}</text> -->
        </view>
      </view>
      <view class="hotel-name">{{ productData.name }} </view>
      <view class="hotel-price">
        <template v-if="productData.is_negotiable">面议</template>
        <template v-else>
          <text class="small">¥</text
          >{{ productData.min_price || productData.price
          }}<text class="small">起</text>
        </template>
      </view>
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

      <!-- <view class="content" v-if="cleanedContent">
        <rich-text :nodes="cleanedContent"></rich-text>
      </view> -->

      <view class="content" v-if="cleanedContent">
        <!-- 再渲染其他富文本内容（不含视频） -->
        <rich-text :nodes="textOnlyContent"></rich-text>
        <view
          v-for="(video, index) in videoList"
          :key="index"
          class="video-container"
        >
          <video
            :src="video.src"
            :poster="video.poster || ''"
            controls
            show-center-play-btn
            class="video-player"
          ></video>
        </view>
      </view>
      <view
        class="viedoList"
        v-if="productData.videos && productData.videos.length"
      >
        <view
          class="video-item"
          v-for="(item, index) in productData.videos"
          :key="index"
        >
          <video :src="item" controls="true" width="100%"></video>
        </view>
      </view>
    </view>

    <view class="hotel-footer">
      <view class="hotel-footer-item" @click="goback">
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
        商家咨询
      </view>
      <button class="hotel-footer-online button" open-type="contact">
        在线管家
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { checkLogin, navigateToLogin } from "@/utils/auth";
import {
  getProductDetail,
  favoriteProduct,
  unfavoriteProduct,
  bind,
  unbind,
} from "@/api/product";
import { getMerchantList, getMerchantDetail } from "@/api/merchant";

// 产品数据
const productData = ref<any>({});

// 产品ID
const hotelId = ref<number | null>(null);

// 收藏状态
const isFavorited = ref<boolean>(false);

// onLoad 参数接收器
const props = defineProps<{
  id?: string;
  share?: boolean;
}>();

// 定义方法
const leftClick = () => {
  console.log("leftClick");
  // 跳转回首页
  uni.switchTab({ url: "/pages/index/index" });
};

// 从富文本中提取视频列表
const videoList = computed(() => {
  const description = productData.value.content || "";
  if (!description) return [];

  const videos: Array<{ src: string; poster: string }> = [];

  // 匹配 <video> 标签中的 <source src="...">
  const videoRegex = /<video[^>]*>([\s\S]*?)<\/video>/gi;
  let match;

  while ((match = videoRegex.exec(description)) !== null) {
    const videoTag = match[0];

    // 提取 poster 属性
    const posterMatch = videoTag.match(/poster\s*=\s*["']([^"']*)["']/i);
    const poster = posterMatch ? posterMatch[1] : "";

    // 提取 source src
    const sourceMatch = videoTag.match(
      /<source[^>]*src\s*=\s*["']([^"']*)["'][^>]*>/i
    );
    if (sourceMatch && sourceMatch[1]) {
      videos.push({
        src: sourceMatch[1],
        poster: poster,
      });
    }
  }

  console.log("提取到的视频列表:", videos);
  return videos;
});

// 移除视频标签后的纯文本内容
const textOnlyContent = computed(() => {
  let content = productData.value.content || "";
  if (!content) return "";

  // 移除所有 <video>...</video> 标签及其内容
  content = content.replace(
    /<div[^>]*data-w-e-type=["']video["'][^>]*>[\s\S]*?<\/div>/gi,
    ""
  );
  content = content.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, "");

  return cleanHtmlContent(content);
});
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
    // uni.showLoading({
    //   title: "加载中...",
    // });

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

function openDetail(hotel: any) {
  console.log("打开酒店详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotelDetail?id=${hotel.id}`,
    });
  }
}

function rightClick() {
  console.log("right click");
}
const goback = () => {
  // 返回上级页面
  uni.navigateBack();
};

function makePhoneCall() {
  // 这里可以添加商家咨询的功能
  uni.showModal({
    title: "商家咨询",
    content: "是否拨打商家电话？请使用授权手机号拨出，以免拨打失败！",
    success: function (res) {
      if (res.confirm) {
        // 调用bind获取绑定的手机号
        bind(productData.value.merchant_id, "product", productData.value.id)
          .then((bindRes) => {
            if (bindRes && bindRes.middle_number) {
              // 获取成功
              console.log("获取绑定手机号成功:", bindRes);

              // 拨打电话
              uni.makePhoneCall({
                phoneNumber: bindRes.middle_number,
                success: () => {
                  console.log("电话拨打成功");
                  // 拨打成功后解绑
                  unbind(productData.value.id)
                    .then((unbindRes) => {
                      if (unbindRes) {
                        console.log("解绑成功:", unbindRes);
                      } else {
                        console.log("解绑失败:", unbindRes?.message);
                      }
                    })
                    .catch((error) => {
                      console.error("解绑异常:", error);
                    });
                },
                fail: (err) => {
                  console.log("电话拨打失败或取消:", err.errMsg);

                  // 如果是因为用户取消拨打，也需要解绑
                  if (err.errMsg && err.errMsg.includes("cancel")) {
                    console.log("用户取消拨打，执行解绑");
                    unbind(
                      productData.value.merchant_id,
                      "product",
                      productData.value.id
                    )
                      .then((unbindRes) => {
                        if (unbindRes) {
                          console.log("解绑成功:", unbindRes);
                        } else {
                          console.log("解绑失败:", unbindRes?.message);
                        }
                      })
                      .catch((error) => {
                        console.error("解绑异常:", error);
                      });
                  } else {
                    // 其他错误也解绑
                    unbind(productData.value.id).catch((error) => {
                      console.error("解绑异常:", error);
                    });
                  }
                },
              });
            } else {
              // 获取失败
              console.log("获取绑定手机号失败:", bindRes?.message);
              uni.showToast({
                title: bindRes?.message || "获取手机号失败",
                icon: "none",
              });
            }
          })
          .catch((error) => {
            console.error("绑定异常:", error);
            uni.showToast({
              title: "绑定失败，请重试",
              icon: "none",
            });
          });
      } else {
        // 用户取消拨打电话，不需要解绑（因为还没有绑定）
        console.log("用户取消拨打电话");
      }
    },
  });
}

function handleOnlineService() {
  console.log("点击在线管家按钮");

  // #ifdef MP-WEIXIN
  console.log("当前环境：微信小程序");

  // 检查是否配置了客服功能
  if (!uni.openCustomerServiceChat) {
    console.error("当前环境不支持 openCustomerServiceChat API");
    uni.showToast({
      title: "当前版本不支持客服功能",
      icon: "none",
    });
    return;
  }

  // 微信小程序环境下打开客服会话
  uni.showLoading({
    title: "正在打开客服...",
  });

  uni.openCustomerServiceChat({
    extInfo: {
      url: "", // 如果需要跳转到特定客服页面，可以在这里配置URL
    },
    corpId: "", // 企业微信的corpId，如果是企业微信客服需要填写
    success: (res) => {
      console.log("打开客服成功", res);
      uni.hideLoading();
    },
    fail: (err) => {
      console.error("打开客服失败", err);
      uni.hideLoading();

      // 显示详细错误信息
      let errorMsg = "客服功能暂不可用";
      if (err.errMsg) {
        console.error("错误详情:", err.errMsg);
        errorMsg = err.errMsg.includes("auth")
          ? "请先在小程序后台配置客服功能"
          : "客服功能暂不可用";
      }

      uni.showModal({
        title: "提示",
        content: errorMsg,
        showCancel: false,
      });
    },
  });
  // #endif

  // #ifndef MP-WEIXIN
  console.log("当前环境：非微信小程序");
  uni.showToast({
    title: "请在微信小程序中使用此功能",
    icon: "none",
  });
  // #endif
}

// 切换收藏状态
async function toggleFavorite() {
  try {
    if (!checkLogin()) {
      uni.showModal({
        title: "提示",
        content: "请先登录后再使用收藏功能",
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

// 页面分享
onShareAppMessage(() => {
  return {
    title: productData.value.name || "壹嫁婚选",
    path: `/pages/merchant/planItem?id=${productData.value.id}&share=true`,
    imageUrl: productData.value.cover_image || "",
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: productData.value.name || "壹嫁婚选",
    path: `/pages/merchant/planItem?id=${productData.value.id}&share=true`,
    imageUrl: productData.value.cover_image || "",
  };
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.planItem {
  background: #f0f0f0;
  min-height: 100vh;
  padding-bottom: 100rpx;

  .banner {
    .banner-swiper {
      height: 1000rpx;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
    }
    .hotel-price {
      font-size: 32rpx;
      color: #bf974a;
      font-weight: bold;
      margin-bottom: 20rpx;
      .small {
        font-size: $font-xs;
        font-weight: 400;
      }
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
    .viedoList {
      margin-top: $spacing-md;
      .video-item {
        margin-bottom: $spacing-md;
        video {
          width: 100%;
        }
      }
    }
    .content {
      margin-top: $spacing-md;
      background: #fff;
      border-radius: 20rpx;
      padding-bottom: $spacing-md;
      // 视频容器样式
      .video-container {
        margin: $spacing-md 0;

        .video-player {
          width: 100%;
          height: 400rpx;
          border-radius: 10rpx;
        }
      }
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
      margin-right: 20rpx;
    }
    .button {
      border-radius: 20rpx;
      font-size: 28rpx;
      height: 80rpx;
      width: 250rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10rpx;
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


<template>
  <view class="planItem">
    <up-navbar
      title="案例详情"
      @rightClick="rightClick"
      :autoBack="true"
      placeholder
    >
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
          <image :src="item" mode="widthFix" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>
    <view class="hotel-info">
      <view class="hotel-intro" @click="openDetail()">
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
      <view class="hotel-name">{{ productData.title }} </view>
      <view
        class="hotel-highlights"
        v-if="productData.style_tags && productData.style_tags.length"
      >
        <text
          class="highlight"
          v-for="(tag, index) in productData.style_tags"
          :key="index"
          >{{ tag }}</text
        >
      </view>
      <view class="content" v-if="cleanedContent">
        <!-- {{ productData.description }} -->
        <rich-text :nodes="cleanedContent"></rich-text>
      </view>

      <view
        class="viedoList"
        v-if="productData.top_media && productData.top_media.length"
      >
        <view
          class="video-item"
          v-for="(item, index) in productData.top_media"
          :key="index"
        >
          <video :src="item" controls="true" width="100%"></video>
        </view>
      </view>

      <view
        class="content"
        v-if="productData.bottom_images && productData.bottom_images.length"
      >
        <image
          :src="item"
          mode="widthFix"
          class="detail-image"
          v-for="(item, index) in productData.bottom_images"
          :key="index"
        />
      </view>
    </view>

    <view class="hotel-footer">
      <view class="hotel-footer-item" @click="openDetail()">
        <up-icon name="arrow-left" size="24" color="#E5E5E5"></up-icon>
        <text>前往商家</text>
      </view>
      <view class="right-button">
        <view class="hotel-footer-tel button" @click="makePhoneCall">
          商家咨询
        </view>
        <button class="hotel-footer-online button" open-type="contact">
          在线管家
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getCasesDetail } from "@/api/index";
import { bind, unbind } from "@/api/product";
import { useUserStore } from "@/store/modules/user";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
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
  return cleanHtmlContent(productData.value.description || "");
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

    const response = await getCasesDetail(hotelId.value);

    productData.value = response;
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

function openDetail() {
  uni.navigateTo({
    url: `/pages/merchant/hotelDetail?id=${productData.value.merchant.id}`,
  });
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
  // 这里可以添加商家咨询的功能
  uni.showModal({
    title: "商家咨询",
    content: "是否拨打商家电话？\n请使用授权手机号拨出，以免拨打失败！",
    success: function (res) {
      if (res.confirm) {
        // 调用bind获取绑定的手机号
        bind(productData.value.id)
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
  uni.showToast({
    title: "在线管家功能开发中",
    icon: "none",
  });
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value;
  // 这里可以添加收藏/取消收藏的逻辑
  if (isFavorited.value) {
    uni.showToast({
      title: "已收藏",
      icon: "success",
    });
  } else {
    uni.showToast({
      title: "已取消收藏",
      icon: "none",
    });
  }
}

// 页面分享
onShareAppMessage(() => {
  return {
    title: "美好瞬间 - 壹嫁婚选",
    path: "/pages/index/case",
    imageUrl: productData.value.images[0],
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "美好瞬间 - 壹嫁婚选",
    path: "/pages/index/case",
    imageUrl: productData.value.images[0],
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
      margin-left: 20rpx;
    }
    .right-button {
      display: flex;
      align-items: center;
      margin-left: auto;
    }
    .button {
      border-radius: 20rpx;
      font-size: 28rpx;
      height: 80rpx;
      width: 250rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
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
  .detail-image {
    width: 100%;
    display: block;
  }
  .content {
    margin-top: $spacing-md;
    background: #fff;
    border-radius: 20rpx;
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
  .viedoList {
    margin-top: $spacing-md;
    .video-item {
      margin-bottom: $spacing-md;
      video {
        width: 100%;
      }
    }
  }
}
</style>


<template>
  <view class="planDetail">
    <up-navbar
      :title="productData.name || '产品详情'"
      @rightClick="rightClick"
      :autoBack="true"
      placeholder
    >
      <template #left>
        <view class="u-nav-slot">
          <up-icon name="arrow-left" size="20" v-if="!share"></up-icon>
          <up-icon name="home" size="24" v-if="share" @click="goHome"></up-icon>
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
      <view>
        <view class="hotel-intro">
          <image
            :src="productData.cover_image"
            mode="aspectFill"
            class="user-icon"
            v-if="productData.cover_image"
            lazy-load
          ></image>
          <view class="right">
            <view class="user-name">
              <view> {{ productData.name }}</view>
              <text class="price"
                ><text class="small">¥</text
                >{{ productData.min_price || productData.price
                }}<text class="small">起</text></text
              >
            </view>
            <view class="hotel-rate">
              <text class="rate">{{ productData.rating }}分</text>
              {{ productData.experience_years }}年经验
              <text class="gender">{{ showGender(productData.gender) }}</text>
            </view>
            <text class="user-intro">{{ productData.subtitle }}</text>
          </view>
        </view>
        <view class="user-description">{{ productData.description }}</view>
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
      </view>
    </view>

    <!-- 详情 -->
    <view class="richText">
      <up-tabs
        :list="list"
        @click="click"
        scrollable="false"
        lineWidth="80"
        lineColor="#F0CD8C"
        :activeStyle="{
          color: '#000000',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: '#808080',
          transform: 'scale(1)',
        }"
        itemStyle="width:50%;text-align: center; height: 80rpx;"
      ></up-tabs>

      <view class="content" v-if="cleanedContent && activeTab === 0">
        <rich-text :nodes="cleanedContent"></rich-text>
      </view>
      <view
        class="viedoList"
        v-if="
          productData.videos && productData.videos.length && activeTab === 1
        "
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
      <view
        class="hotel-footer-item"
        @click="gobackMerchant(productData.merchant_id)"
      >
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
import { ref, reactive, computed, onMounted } from "vue";
import {
  onLoad,
  onUnload,
  onShareAppMessage,
  onShareTimeline,
} from "@dcloudio/uni-app";
import { getProductDetail } from "@/api/product";
import { bind, unbind } from "@/api/product";
import { checkLogin, navigateToLogin } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";
import { favoriteProduct, unfavoriteProduct } from "@/api/product";

const activeTab = ref(0);
// 创建响应式数据
const list = reactive([{ name: "图文案例" }, { name: "视频案例" }]);

// 定义方法
function click(index: any) {
  console.log("点击了标签:", index);
  activeTab.value = index.index;
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
  share?: boolean;
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

// 定义方法
const goHome = () => {
  console.log("leftClick");
  // 跳转回首页
  uni.switchTab({ url: "/pages/index/index" });
};

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

function openDetail(hotel: any) {
  console.log("打开酒店详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotelDetail?id=${hotel.id}`,
    });
  }
}

// 根本male famle 显示男女
function showGender(gender: string) {
  if (gender == "male") {
    return "男";
  } else if (gender == "female") {
    return "女";
  } else {
    return "未知";
  }
}

function gobackMerchant(merchantId: number) {
  uni.navigateTo({
    url: `/pages/merchant/hotelDetail?id=${merchantId}`,
  });
}
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
  uni.showToast({
    title: "在线管家功能开发中",
    icon: "none",
  });
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
    path: `/pages/merchant/planDetail?id=${productData.value.id}&share=true`,
    imageUrl: productData.value.cover_image || "",
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: productData.value.name || "壹嫁婚选",
    path: `/pages/merchant/planDetail?id=${productData.value.id}&share=true`,
    imageUrl: productData.value.cover_image || "",
  };
});
// 离开页面清空当前页面数据
onUnload(() => {
  productData.value = {};
  isFavorited.value = false;
  hotelId.value = null;
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.planDetail {
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

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        .user-name {
          font-size: 32rpx;
          color: #383838;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          .price {
            font-size: 32rpx;
            color: #bf974a;
            font-weight: bold;
          }
          .small {
            font-size: $font-xs;
            font-weight: 400;
          }
        }
        .hotel-rate {
          color: #808080;
          font-size: 26rpx;
          margin-top: 10rpx;
          .gender {
            margin-left: 20rpx;
          }
          .rate {
            border-radius: 20rpx;
            background: linear-gradient(
              180deg,
              #f1daa6 0%,
              #f9eccc 33.03%,
              #e9cc90 100%
            );
            padding: 3rpx 10rpx;
            color: #ab7e2b;
          }
        }
        .user-intro {
          font-size: 26rpx;
          color: #a6a6a6;
          margin-top: 10rpx;
        }
      }
      .id {
        font-size: $font-xs;
        color: #383838;
      }
    }
    .user-description {
      color: #808080;
      margin: 20rpx 0;
      font-size: 28rpx;
      line-height: 40rpx;
    }
  }
  .richText {
    background: #fff;
    margin: 20rpx;
    padding: $spacing-md;
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

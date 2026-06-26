
<template>
  <view class="hotel-detail-page">
    <up-navbar
      :title="hotelData.name || '酒店详情'"
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
          <up-icon name="home" size="24" v-if="share"></up-icon>
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
        <swiper-item v-for="(item, index) in hotelData.images" :key="index">
          <image :src="item" mode="widthFix" class="banner-image" lazy-load />
        </swiper-item>
      </swiper>
    </view>
    <view class="hotel-info">
      <view class="hotel-name">
        <view class="ratezu">
          {{ hotelData.name
          }}<text class="rate"
            >{{ hotelData.rating }}<text class="fen">分</text></text
          ></view
        >
        <view class="price">¥{{ hotelData.starting_price }}起</view>
      </view>
      <view
        class="hotel-highlights"
        v-if="hotelData.personnel_tags && hotelData.personnel_tags.length > 0"
      >
        <text
          v-for="(feature, index) in hotelData.personnel_tags"
          :key="index"
          class="highlight"
        >
          {{ feature }}
        </text>
      </view>
      <view class="hotel-address" @click="openMap">
        <up-icon name="map" size="20" color="#AB7E2B"> </up-icon>
        {{ hotelData.address }}</view
      >
      <!-- <view class="hotel-rate">
        {{ hotelData.description }}
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
      <view class="hotel-intro">{{ hotelData.landmark }}</view>

      <view class="hotel-fuli" v-if="CouponsData && CouponsData.length > 0">
        <view class="hotel-fuli-title">特惠福利</view>
        <view
          v-for="(product, index) in CouponsData"
          :key="index"
          class="hotel-fuli-item"
        >
          <text>满¥{{ product.min_amount }}立减¥{{ product.value }}</text>
          <view class="recive" @click="receiveCoupon(product.id)">
            领取
            <up-icon name="arrow-right" size="16" color="#BF974A"></up-icon>
          </view>
        </view>
      </view>
      <view
        class="hotel-list"
        v-if="hotelData.products && hotelData.products.length > 0"
      >
        <view
          v-for="(caseItem, index) in hotelData.products"
          :key="index"
          class="hotel-list-item"
        >
          <image
            :src="caseItem.cover_image"
            mode="aspectFill"
            class="image"
            @click="openDetail(caseItem)"
            lazy-load
          ></image>
          <view class="hotel-list-item-info">
            <view class="hotel-list-item-title" @click="openDetail(caseItem)">
              {{ caseItem.name }}
            </view>
            <view class="hotel-list-item-intro" @click="openDetail(caseItem)">
              {{ caseItem.subtitle }}
            </view>
            <view class="hotel-list-item-price">
              <view class="price-wrap">
                <text class="price">
                  <template v-if="caseItem.is_negotiable">
                    <text class="danwei">参考价</text> 面议
                  </template>
                  <template v-else>
                    <text class="danwei">参考价</text>
                    {{ caseItem.price }}<text class="danwei">起</text>
                  </template>
                </text>
              </view>
              <up-icon name="star" size="24" color="#E5E5E5"></up-icon>
            </view>
          </view>
        </view>
      </view>
      <view
        class="detailImage"
        v-if="hotelData.detail_images && hotelData.detail_images.length > 0"
      >
        <image
          :src="item"
          mode="widthFix"
          class="detail-image"
          v-for="(item, index) in hotelData.detail_images"
          :key="index"
          lazy-load
        />
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

      <view class="hotel-footer-tel button" @click="makePhoneCall()">
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
import { checkLogin, navigateToLogin } from "@/utils/auth";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import {
  getHotelDetail,
  getCoupons,
  receiveCoupons,
  favoriteProduct,
  unfavoriteProduct,
  bind,
  unbind,
} from "@/api/product";

// 基础URL
const baseUrl = ref<string>("");

// 酒店数据
const hotelData = ref<any>({});
const CouponsData = ref<any>({});

// 收藏状态
const isFavorited = ref<boolean>(false);

// 酒店ID
const hotelId = ref<number | null>(null);

// onLoad 参数接收器
const props = defineProps<{
  id?: string;
  share?: boolean;
}>();

// 加载酒店详情
async function loadHotelDetail() {
  if (!hotelId.value) {
    uni.showToast({
      title: "缺少酒店ID",
      icon: "none",
    });
    return;
  }

  try {
    // uni.showLoading({
    //   title: "加载中...",
    // });

    const response = await getHotelDetail(hotelId.value);

    hotelData.value = response;
    isFavorited.value = response.is_favorited || false; // 假设接口返回了is_favorited字段
    console.log("酒店详情:", response);
  } catch (error) {
    console.error("获取酒店详情失败:", error);
    uni.showToast({
      title: "获取酒店详情失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
}

async function loadCoupons() {
  try {
    const id = Number(hotelId.value) || 0;
    const response = await getCoupons(id);
    console.log("优惠券列表:", response.data);
    CouponsData.value = response.data || [];
  } catch (error) {
    uni.showToast({
      title: "获取酒店产品列表失败",
      icon: "none",
    });
  }
}

function openDetail(caseItem: any) {
  if (caseItem && caseItem.id) {
    uni.navigateTo({
      url: `/pages/merchant/planItem?id=${caseItem.id}`,
    });
  }
}

// 页面加载时获取酒店详情
onMounted(() => {
  if (props.id) {
    hotelId.value = Number(props.id);
    loadHotelDetail();
    loadCoupons();
  } else {
    uni.showToast({
      title: "缺少酒店ID",
      icon: "none",
    });
  }
});

function rightClick() {
  console.log("right click");
  // 返回上级页面
  uni.navigateBack();
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
        bind(hotelData.value.id)
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
                  unbind(hotelData.value.id)
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
                    unbind(hotelData.value.id)
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
                    unbind(hotelData.value.id).catch((error) => {
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

async function receiveCoupon(couponId: number) {
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
    const response = await receiveCoupons(couponId);
    console.log("领取优惠券:", response);
    uni.showToast({
      title: "领取成功",
      icon: "success",
    });
  } catch (error) {
    console.error("领取优惠券失败:", error);
  }
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

// 打开地图
function openMap() {
  if (!hotelData.value) return;

  const { longitude, latitude, name, address_text } = hotelData.value;

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
    name: name || "婚博会地点",
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

// 富文本
// 计算属性:清理后的内容
const cleanedContent = computed(() => {
  return cleanHtmlContent(hotelData.value.description || "");
});

// 从富文本中提取视频列表
const videoList = computed(() => {
  const description = hotelData.value.description || "";
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
  let content = hotelData.value.description || "";
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

// 页面分享
onShareAppMessage(() => {
  return {
    title: hotelData.value.name || "壹嫁婚选",
    path: `/pages/merchant/hotelDetail?id=${hotelData.value.id}&share=true`,
    imageUrl: hotelData.value.cover_image || "",
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: hotelData.value.name || "壹嫁婚选",
    path: `/pages/merchant/hotelDetail?id=${hotelData.value.id}&share=true`,
    imageUrl: hotelData.value.cover_image || "",
  };
});
// 定义方法
const leftClick = () => {
  console.log("leftClick");
  // 跳转回首页
  uni.switchTab({ url: "/pages/index/index" });
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.hotel-detail-page {
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
    margin: 0 $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: 30rpx;
    padding-bottom: 50rpx;
    margin-bottom: 50rpx;
    .hotel-name {
      font-size: 32rpx;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      .ratezu {
        line-height: 50rpx;
      }
      .price {
        font-size: 32rpx;
        color: #bf974a;
        margin-left: auto;
        width: 230rpx;
        text-align: right;
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
        margin-right: 10rpx;
        font-weight: 400;
        margin-left: 10rpx;
        font-size: 24rpx;
      }
      .fen {
        font-size: 24rpx;
        color: #ab7e2b;
      }
    }
    .hotel-highlights {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .highlight {
      font-size: 24rpx;
      color: #383838;
      background: #f0f0f0;
      padding: 10rpx 20rpx;
      border-radius: 24rpx;
      margin: 20rpx 0;
    }
    .hotel-address {
      font-size: 30rpx;
      color: #333;
      margin: 10rpx 0;
      display: flex;
      align-items: baseline;
    }
    .hotel-intro {
      font-size: 26rpx;
      color: #a6a6a6;
      margin-bottom: 10rpx;
    }
    .hotel-fuli {
      border: 1px solid #f0cd8c;
      margin: $spacing-lg 0;
      border-radius: 30rpx;
      overflow: hidden;
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
    .hotel-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;
      .hotel-list-item {
        border-radius: 30rpx;
        width: 320rpx;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        margin-bottom: 20rpx;
        .image {
          width: 100%;
          height: 420rpx;
        }
        .hotel-list-item-info {
          padding: $spacing-sm;
          .hotel-list-item-title {
            font-size: 32rpx;
            color: #383838;
            margin-bottom: 10rpx;

            // 超过两行显示省略号
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .hotel-list-item-price {
            font-size: 26rpx;
            color: #808080;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .price {
              color: #bf974a;
              font-size: 32rpx;
            }
            .danwei {
              color: #bf974a;
              font-size: 24rpx;
            }
          }
          .hotel-list-item-intro {
            font-size: 24rpx;
            color: #808080;
            margin-bottom: 10rpx;
            height: 30rpx;
            // 超过一行显示省略号
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            display: -webkit-box;
          }
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
  .detail-image {
    width: 100%;
    display: block;
  }
  .content {
    background: #fff;
    border-radius: 20rpx;

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
}
</style>
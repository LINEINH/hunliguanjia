<template>
  <view class="exchange-container">
    <view class="planItem">
      <view class="ad">
        <image
          src="/static/images/post1.png"
          mode="aspectFill"
          class="ad-image"
        />
      </view>
      <view class="moments-grid">
        <template v-for="(moment, index) in momentsList" :key="index">
          <view class="moment-item">
            <image
              :src="moment.gift_image"
              class="moment-image"
              mode="aspectFill"
            ></image>
            <view class="moment-info">
              <text class="moment-title">{{ moment.gift_name }}</text>

              <text class="moment-subtitle">{{ moment.gift_description }}</text>
              <view class="moment-intro">
                <view class="change" @click="exchange(moment)">兑换</view>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getGift, checkinClaim } from "@/api/expo";

const momentsList = ref<any>([]);

// 导航到商家列表
function navigateToPlanItem() {
  uni.navigateTo({ url: "/pages/merchant/planItem" });
}

// 加载伴手礼列表数据
async function loadGiftList() {
  // 获取 URL 中的 id 参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  const id = currentPage.options?.id;

  if (!id) {
    console.warn("缺少活动ID参数");
    uni.showToast({
      title: "缺少活动ID",
      icon: "none",
    });
    return;
  }

  try {
    const res = await getGift(Number(id));
    console.log("伴手礼列表:", res);
    // TODO: 根据实际返回数据结构调整
    momentsList.value = res || [];
  } catch (err) {
    console.error("获取伴手礼列表失败:", err);
    uni.showToast({
      title: "加载失败",
      icon: "none",
    });
  }
}

// 兑换
async function exchange(moment: any) {
  if (!moment.id) {
    uni.showToast({
      title: "缺少产品ID",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({
      title: "加载中...",
    });

    const response = await checkinClaim(moment.id);
    if (response) {
      uni.showToast({
        title: "兑换成功",
        icon: "success",
      });
    }
    console.log("产品详情:", response);
  } catch (err) {
    // uni.showToast({
    //   title: "'请先签到后再领取伴手礼'",
    //   icon: "none",
    // });
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadGiftList();
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.exchange-container {
  .planItem {
    margin: $spacing-md;
    padding-bottom: 30rpx;
    .ad {
      margin-bottom: $spacing-md;
      .ad-image {
        width: 100%;
        height: 300rpx;
        border-radius: $radius-md;
      }
    }
  }

  .moments-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
    border-radius: 20rpx;
    .moment-item {
      background-color: #fff;
      border-radius: $radius-md;
      overflow: hidden;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

      .moment-image {
        width: 100%;
        height: 320rpx;
        display: block;
      }

      .moment-info {
        padding: $spacing-md;

        .moment-title {
          display: block;
          font-size: 28rpx;
          font-weight: bold;
          color: $text-primary;
          // 两行显示省略号
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          height: 74rpx;
        }
        .moment-subtitle {
          font-size: $font-xs;
          color: #808080;
          margin-top: 10rpx;
          // 一行显示隐藏
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .moment-intro {
          display: flex;
          align-items: center;
          padding-top: $spacing-sm;
          .user-icon {
            width: 30rpx;
            height: 30rpx;
            border-radius: 50%;
            margin-right: $spacing-sm;
          }
          .user-name {
            font-size: $font-xs;
            color: #383838;
            margin-right: auto;
          }
          .change {
            color: #bf974a;
            font-size: $font-xs;
            border: 1px solid #f0cd8c;
            padding: 10rpx 20rpx;
            border-radius: 30rpx;
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
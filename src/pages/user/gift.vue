<template>
  <view class="user-gift-page">
    <view class="giftlist">
      <view class="giftitem" v-for="item in gifts" :key="item.id">
        <view class="giftimg">
          <image
            :src="item.gift.gift_image"
            mode="aspectFill"
            class="image"
          ></image>
        </view>
        <view class="giftinfo">
          <view class="giftname"> {{ item.gift.gift_name }} </view>
          <view class="gifttime"> {{ item.gift.pickup_location }}</view>
          <view class="recipt-get" @click="openCode(item.qr_code_image_url)">
            <text class="recipt-get">二维码</text>
          </view>
        </view>
      </view>
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

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getGifts } from "@/api/user";

const gifts = ref([]);
// 创建响应式数据
const show = ref(false);

const codeUrl = ref("");

function open() {
  // 打开逻辑，比如设置 show 为 true
  show.value = true;
  // console.log('open');
}

function openCode(url) {
  codeUrl.value = url;
  open();
}

function close() {
  // 关闭逻辑，设置 show 为 false
  show.value = false;
  // console.log('close');
}

onMounted(() => {
  getGifts().then((res) => {
    console.log(res);
    gifts.value = res || [];
  });
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-gift-page {
  background: #f0f0f0;
  min-height: 100vh;
  .giftlist {
    margin: 20rpx;
    .giftitem {
      padding: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      background: #fff;
      border-radius: 20rpx;
      align-items: center;
      .giftimg {
        width: 150rpx;
        height: 150rpx;
        margin-right: 30rpx;
        .image {
          width: 152rpx;
          height: 152rpx;
        }
      }
      .giftinfo {
        .giftname {
          font-size: 28rpx;
          color: #333333;
          margin-bottom: 10rpx;
        }
        .gifttime {
          font-size: 24rpx;
          color: #999999;
        }
      }
      .recipt-get {
        color: #612500;
        padding: 10rpx 20rpx;
        font-size: 28rpx;
        opacity: 1;
        border-radius: 30rpx;
        margin-top: 10rpx;
        background: linear-gradient(
          135deg,
          #f1daa6 0%,
          #f9eccc 33.03%,
          #e9cc90 100%
        );
      }
    }
  }
  .codeimage {
    width: 500rpx;
    height: 500rpx;
    margin: 20rpx;
    display: block;
  }
}
</style>
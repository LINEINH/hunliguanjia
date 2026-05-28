<template>
  <view class="custom-tabbar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-item"
      :class="{ 'tab-active': currentIndex === index }"
      @click="switchTab(index)"
    >
      <image
        :src="currentIndex === index ? item.selectedIconPath : item.iconPath"
        class="tab-icon"
      ></image>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";

interface TabItem {
  pagePath: string;
  text: string;
  iconPath: string;
  selectedIconPath: string;
}

const props = defineProps<{
  current: number;
}>();

const emit = defineEmits(["change"]);

const currentIndex = ref(props.current);

// tabBar 配置
const tabList = ref<TabItem[]>([
  {
    pagePath: "/pages/index/index",
    text: "首页",
    iconPath: "/static/images/1.png",
    selectedIconPath: "/static/images/5.png",
  },
  {
    pagePath: "/pages/merchant-list/merchant-list",
    text: "婚礼服务",
    iconPath: "/static/images/2.png",
    selectedIconPath: "/static/images/6.png",
  },
  {
    pagePath: "/pages/expo/expo",
    text: "婚博会",
    iconPath: "/static/images/3.png",
    selectedIconPath: "/static/images/7.png",
  },
  {
    pagePath: "/pages/user/user",
    text: "我的",
    iconPath: "/static/images/4.png",
    selectedIconPath: "/static/images/8.png",
  },
]);

// 同步当前选中状态
function syncCurrentIndex() {
  const pages = getCurrentPages();
  if (pages.length === 0) return;

  const currentPage = pages[pages.length - 1];
  const route = "/" + currentPage.route;

  const index = tabList.value.findIndex((item) => item.pagePath === route);
  if (index !== -1 && index !== currentIndex.value) {
    currentIndex.value = index;
  }
}

// 切换 tab
function switchTab(index: number) {
  if (currentIndex.value === index) return;

  currentIndex.value = index;
  const item = tabList.value[index];

  // 使用 switchTab 切换到 tabBar 页面
  uni.switchTab({
    url: item.pagePath,
  });

  emit("change", index);
}

onMounted(() => {
  // 初始化时同步状态
  syncCurrentIndex();
});

onShow(() => {
  // 每次页面显示时同步状态
  syncCurrentIndex();
});
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .tab-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 4rpx;
    }

    .tab-text {
      font-size: 24rpx;
      color: rgba(128, 128, 128, 1);
      transition: all 0.3s;
    }

    &.tab-active {
      .tab-text {
        color: rgba(191, 151, 74, 1);
      }
    }
  }
}
</style>

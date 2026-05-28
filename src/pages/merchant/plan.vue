
<template>
  <view class="page">
    <up-navbar title="婚礼策划" @rightClick="rightClick" :autoBack="true">
    </up-navbar>
    <view class="search-bar">
      <view class="search-box">
        <view class="search-box-left">
          <up-icon name="search" size="20" color="#BCBCBC"></up-icon>
          <input
            class="uni-input"
            confirm-type="search"
            placeholder="搜索商家/服务"
          />
        </view>
        <view class="search-box-btn" @click="onSearch">搜索</view>
      </view>
    </view>
    <view class="filters">
      <template v-for="filter in filtersList" :key="filter.id">
        <view
          class="filter-item"
          @click="showOptions(filter)"
          :class="{ active: tempSelectedfilters === filter.id }"
        >
          <up-icon
            name="map"
            size="14"
            :color="tempSelectedfilters === filter.id ? '#AB7E2B' : '#383838'"
            v-if="filter.id === 1"
          >
          </up-icon>
          {{ filter.name }}
          <up-icon
            name="arrow-down"
            size="14"
            :color="tempSelectedfilters === filter.id ? '#AB7E2B' : '#383838'"
          >
          </up-icon
        ></view>
      </template>
    </view>

    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>

    <up-overlay :show="show" @click="show = false">
      <view class="filter-dialog" @tap.stop>
        <view class="filter-content">
          <view
            v-for="(area, index) in showOptionsList"
            :key="index"
            class="area-item"
            :class="{ active: tempSelectedAreas.includes(index) }"
            @click="toggleArea(index)"
          >
            {{ area }}
          </view>
        </view>
        <view class="filter-footer">
          <view class="cancle-btn" @click="confirmAreaSelection">重置</view>
          <view class="confirm-btn" @click="confirmAreaSelection">确定</view>
        </view>
      </view>
    </up-overlay>
    <!-- 酒店列表 -->
    <scroll-view class="list" scroll-y="true">
      <view v-if="filteredHotels.length === 0" class="empty"
        >暂无匹配的酒店</view
      >
      <view
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        class="hotel-card"
        @click="openDetail(hotel)"
      >
        <image class="hotel-img" :src="hotel.image" mode="aspectFill" />
        <view class="hotel-info">
          <view class="hotel-row">
            <text class="hotel-name"
              >南洋风·明艳热烈的南洋风新中式婚礼南洋风·明艳热烈的南洋风新中式婚礼</text
            >
          </view>
          <view class="hotel-time"
            ><text class="rate">4.5分</text> 营业中 09:00-21:00
          </view>
          <view class="hotel-desc"
            ><up-icon name="map" size="14" color="#AB7E2B"> </up-icon>
            <text class="text">
              “布景十分漂亮，婚礼宴会好选择”布景十分漂亮，婚礼宴会好选择布景十分漂亮，婚礼宴会好选择</text
            >
          </view>

          <view class="hotel-intro">
            <image
              src="/static/images/user.png"
              mode="aspectFill"
              class="user-icon"
            ></image>
            <text class="user-name">LEVEL婚礼工作室</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
const show = ref(false);
const showOptionsList = ref([]);
const tempSelectedfilters = ref([0]); // 临时存储选中的筛选项
const filtersList = ref([
  {
    id: 1,
    name: "区域",
    options: ["全部", "市中心", "近郊", "机场周边", "高铁站附近"],
  },
  {
    id: 2,
    name: "预算区间",
    options: ["全部", "10桌以下", "10-20桌", "20-50桌", "50桌以上"],
  },
  {
    id: 3,
    name: "从业时长",
    options: ["全部", "经济餐标", "标准餐标", "高档餐标"],
  },
  {
    id: 4,
    name: "场地类型",
    options: ["全部", "宴会厅", "会议室", "多功能厅", "户外场地"],
  },
]);

const showOptions = (filter) => {
  console.log("显示选项：", filter);
  tempSelectedfilters.value = filter.id;
  showOptionsList.value = filter.options;
  show.value = true;
};

// 新增区域筛选相关的状态
const showAreaPopup = ref(false);
const selectedAreas = ref([0]); // 默认选中"全部"
const tempSelectedAreas = ref([0]); // 临时存储选中的区域

const filters = reactive({
  keyword: "",
  areaIndex: 0,
  tableIndex: 0,
  mealIndex: 0,
  typeIndex: 0,
});

const hotels = ref([
  {
    id: 1,
    name: "海悦大酒店",
    address: "市中心·人民路88号",
    image: "/static/images/banner1.png",
    highlights: ["靠铁", "婚宴门", "含位"],
    area: "市中心",
    maxTables: 50,
    meal: "标准餐标",
    type: "宴会厅",
    price: 1280,
  },
  {
    id: 2,
    name: "丽景会议中心",
    address: "高铁站旁·商圈街12号",
    image: "/static/images/banner.png",
    highlights: ["多功能厅", "音响设备齐全"],
    area: "高铁站附近",
    maxTables: 20,
    meal: "经济餐标",
    type: "会议室",
    price: 680,
  },
  {
    id: 3,
    name: "阳光度假酒店",
    address: "近郊·海滨路5号",
    image: "/static/images/banner1.png ",
    highlights: ["海景", "户外婚礼"],
    area: "近郊",
    maxTables: 120,
    meal: "高档餐标",
    type: "户外场地",
    price: 2200,
  },
]);

// 轮播图数据
const banners = ref([
  { image: "/static/images/banner1.png" },
  { image: "/static/images/banner.png" },
]);

const areaLabel = computed(
  () => areaOptions.value[filters.areaIndex] || "全部"
);
const tableLabel = computed(
  () => tableOptions.value[filters.tableIndex] || "全部"
);
const mealLabel = computed(
  () => mealOptions.value[filters.mealIndex] || "全部"
);
const typeLabel = computed(
  () => typeOptions.value[filters.typeIndex] || "全部"
);

const filteredHotels = computed(() => {
  const kw = (filters.keyword || "").trim().toLowerCase();
  return hotels.value.filter((h) => {
    if (
      kw &&
      !(
        (h.name && h.name.toLowerCase().includes(kw)) ||
        (h.address && h.address.toLowerCase().includes(kw)) ||
        (h.highlights && h.highlights.join(" ").toLowerCase().includes(kw))
      )
    ) {
      return false;
    }

    // 修改区域筛选逻辑，支持多选
    if (selectedAreas.value.length > 0) {
      // 如果选中了"全部"，则不过滤
      if (selectedAreas.value.includes(0)) {
        // 什么都不做，继续显示所有酒店
      } else {
        // 检查酒店是否属于选中的区域
        const areaIndex = areaOptions.value.findIndex(
          (option) => option === h.area
        );
        if (!selectedAreas.value.includes(areaIndex)) {
          return false;
        }
      }
    }

    if (filters.tableIndex > 0) {
      const sel = tableOptions.value[filters.tableIndex];
      if (sel === "10桌以下" && !(h.maxTables <= 10)) return false;
      if (sel === "10-20桌" && !(h.maxTables > 10 && h.maxTables <= 20))
        return false;
      if (sel === "20-50桌" && !(h.maxTables > 20 && h.maxTables <= 50))
        return false;
      if (sel === "50桌以上" && !(h.maxTables > 50)) return false;
    }

    if (
      filters.mealIndex > 0 &&
      h.meal !== mealOptions.value[filters.mealIndex]
    )
      return false;
    if (
      filters.typeIndex > 0 &&
      h.type !== typeOptions.value[filters.typeIndex]
    )
      return false;

    return true;
  });
});

// 切换区域选中状态
function toggleArea(index) {
  if (index === 0) {
    // 如果点击"全部"，则清除其他选项
    tempSelectedAreas.value = [0];
  } else {
    // 如果之前选中了"全部"，则移除它
    if (tempSelectedAreas.value.includes(0)) {
      tempSelectedAreas.value = tempSelectedAreas.value.filter(
        (item) => item !== 0
      );
    }

    // 切换当前选项
    if (tempSelectedAreas.value.includes(index)) {
      tempSelectedAreas.value = tempSelectedAreas.value.filter(
        (item) => item !== index
      );
      // 如果没有选中任何选项，则默认选中"全部"
      if (tempSelectedAreas.value.length === 0) {
        tempSelectedAreas.value.push(0);
      }
    } else {
      tempSelectedAreas.value.push(index);
    }
  }
}

// 重置选择
function resetAreaSelection() {
  tempSelectedAreas.value = [0];
}

// 确认选择
function confirmAreaSelection() {
  selectedAreas.value = [...tempSelectedAreas.value];
  showAreaPopup.value = false;
}

// 关闭弹窗（不保存更改）
function closeAreaPopup() {
  // 重置临时选择
  tempSelectedAreas.value = [...selectedAreas.value];
  showAreaPopup.value = false;
}

function onSearch() {
  // 直接依赖 computed，搜索仅触发日志或埋点
  console.log("搜索：", filters.keyword);
}
function onTableChange(e) {
  filters.tableIndex = Number(e?.detail?.value ?? 0);
}
function onMealChange(e) {
  filters.mealIndex = Number(e?.detail?.value ?? 0);
}
function onTypeChange(e) {
  filters.typeIndex = Number(e?.detail?.value ?? 0);
}
// 定义方法
const rightClick = () => {
  console.log("rightClick");
};

function clearFilters() {
  filters.keyword = "";
  filters.areaIndex = 0;
  filters.tableIndex = 0;
  filters.mealIndex = 0;
  filters.typeIndex = 0;
  selectedAreas.value = [0]; // 重置区域选择
  tempSelectedAreas.value = [0];
}

function openDetail(hotel) {
  console.log("打开酒店详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotelDetail?id=${hotel.id}`,
    });
  }
}

// 搜索框点击事件
function onSearchClick() {
  uni.navigateTo({
    url: "/pages/merchant/search",
  });
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.page {
  background: #f0f0f0;
  min-height: 100vh;
}

.banner {
  margin-bottom: $spacing-md;

  .banner-swiper {
    height: 320rpx;
    border-radius: $radius-md;
    overflow: hidden;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
}
.search-bar {
  display: flex;
  padding: 20rpx;
  background: #fff;
  margin-top: 150rpx;
  .search-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-radius: 40rpx;
    border: 1px solid #eac47b;
    background: #fff;
    padding-left: 20rpx;
    .search-box-left {
      display: flex;
      align-items: center;
    }
    .uni-input {
      font-size: 28rpx;
      margin-left: 10rpx;
    }
    .search-box-btn {
      border-radius: 40rpx;
      background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
      color: #fff;
      height: 60rpx;
      color: #612500;
      padding: 0 28rpx;
      font-size: 26rpx;
      line-height: 60rpx;
    }
  }
}
.search-input {
  flex: 1;
  height: 36px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
.search-btn {
  margin-left: 8px;
  padding: 0 12px;
  border-radius: 6px;
  background: #2979ff;
  color: #fff;
  height: 36px;
}
.filters {
  display: flex;
  margin-bottom: 20rpx;
  background: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
}
.filter-item {
  width: 23%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #383838;
  height: 60rpx;
  border-radius: 20rpx;
  color: #383838;
  font-size: 28rpx;
}
.filter-item.active {
  background: linear-gradient(135deg, #f1daa6 0%, #f9eccc 33.03%, #e9cc90 100%);
  border: 1px solid #f0cd8c;

  color: #ab7e2b;
}
.clear-btn {
  padding: 8px 10px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #f0a;
  color: #f00;
  min-width: 80px;
}
.list {
  min-height: 400rpx;
}
.hotel-card {
  display: flex;
  background: #fff;
  border-radius: 20rpx 0 0 20rpx;
  margin: 20rpx;

  padding-right: 20rpx;
}
.hotel-img {
  width: 240rpx;
  height: 360rpx;
  border-radius: 6px;
  margin-right: 10px;
}
.hotel-info {
  flex: 1;
}
.hotel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.hotel-name {
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 30rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.hotel-time {
  color: #808080;
  font-size: 26rpx;
  font-weight: 500;
  margin-top: 30rpx;
  .rate {
    border-radius: 20rpx;
    background: linear-gradient(
      180deg,
      #f1daa6 0%,
      #f9eccc 33.03%,
      #e9cc90 100%
    );
    padding: 6rpx 20rpx;
    color: #d43030;
  }
}
.hotel-desc {
  font-size: 24rpx;
  color: #808080;
  margin: 15rpx 0;
  display: flex;
  align-items: center;

  .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.hotel-price {
  font-size: 26rpx;
  color: #ff6b00;
}
.hotel-intro {
  display: flex;
  align-items: center;
  margin-top: $spacing-sm;
  border-top: 1px solid #e5e5e5;
  padding-top: $spacing-sm;
  .user-icon {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    margin-right: $spacing-sm;
  }
  .user-name {
    font-size: $font-xs;
    color: $text-secondary;
    margin-right: auto;
  }
}

.highlight {
  font-size: 24rpx;
  color: #ab7e2b;
  border: 1px solid #ab7e2b;
  padding: 4rpx 12rpx;
  border-radius: 24rpx;
}
.empty {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

// 弹窗样式
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f0f0f0;

  .popup-title {
    font-size: 32rpx;
    font-weight: bold;
  }

  .popup-btn {
    font-size: 28rpx;
    color: #999;
    padding: 10rpx 20rpx;
  }
}
.filter-dialog {
  background: #fff;
  padding-right: 0;
  border-radius: 0 0 20rpx 20rpx;
  position: fixed;
  top: 296rpx;
  width: 100%;
  .filter-content {
    border-top: 1px solid #e5e5e5;
    display: flex;
    flex-wrap: wrap;
    padding-top: 20rpx;
    padding: 20rpx;
    .area-item {
      width: 28%;
      margin: 10rpx 0;
      padding: 10rpx;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      text-align: center;
      margin-right: 10rpx;
      color: #383838;
      font-size: 28rpx;
    }
    .area-item.active {
      background: linear-gradient(
        135deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
    }
  }
  .filter-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
    .cancle-btn {
      background: #f0f0f0;
      color: #808080;
      width: 50%;
      padding: 20rpx 0;
      text-align: center;
    }
    .confirm-btn {
      background: #f0cd8c;
      color: #612500;
      padding: 20rpx 0;
      width: 50%;
      text-align: center;
    }
  }
}
</style>

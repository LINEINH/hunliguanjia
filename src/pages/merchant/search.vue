
<template>
  <view class="search-page">
    <view class="fixedcon">
      <up-navbar title="搜索页" @rightClick="rightClick" :autoBack="true">
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
      <view class="hotsearch">
        <view class="hotsearch-title">热门搜索：</view>
        <view class="hotsearch-list">
          <view class="hotsearch-item">海悦大酒店</view>
          <view class="hotsearch-item">丽议中心</view>
          <view class="hotsearch-item">阳假酒店</view>
          <view class="hotsearch-item">丽议中心</view>
          <view class="hotsearch-item">阳光酒店</view>
        </view>
      </view>
      <view class="hotsearch">
        <view class="hotsearch-title">历史搜索：</view>
        <view class="hotsearch-list">
          <view class="hotsearch-item">海悦大酒店</view>
          <view class="hotsearch-item">丽议中心</view>
          <view class="hotsearch-item">阳假酒店</view>
          <view class="hotsearch-item">丽议中心</view>
          <view class="hotsearch-item">阳光酒店</view>
        </view>
      </view>
    </view>
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
    name: "桌数",
    options: ["全部", "10桌以下", "10-20桌", "20-50桌", "50桌以上"],
  },
  {
    id: 3,
    name: "餐标",
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
    highlights: ["靠近地铁", "婚宴热门", "含停车位"],
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
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotel-detail?id=${hotel.id}`,
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.search-page {
  background: #fff;
  min-height: 100vh;
}
.fixedcon {
  position: fixed;
  left: 0;
  right: 0;
  top: 150rpx;
  z-index: 99999;
}
.search-bar {
  display: flex;
  padding: $spacing-sm;
  background: #fff;
  .search-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-radius: 40rpx;
    border: 1px solid #eac47b;
    background: #fff;
    padding-left: $spacing-sm;
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
.hotsearch {
  margin: 30rpx 0;
  padding: 0 $spacing-sm;
  .hotsearch-title {
    font-size: 28rpx;
    color: #383838;
    margin-bottom: $spacing-md;
  }
  .hotsearch-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    .hotsearch-item {
      border-radius: $spacing-sm;
      background: linear-gradient(90deg, #ededed 0%, #fafafa 100%);
      color: #383838;
      font-size: 24rpx;
      width: calc((100% - 60rpx) / 4);
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>


<template>
  <view class="page">
    <view class="fixedcon">
      <up-navbar :title="pageTitle" @rightClick="rightClick" :autoBack="true">
      </up-navbar>
      <view class="search-bar">
        <view class="search-box">
          <view class="search-box-left">
            <up-icon name="search" size="20" color="#BCBCBC"></up-icon>
            <input
              class="uni-input"
              confirm-type="search"
              placeholder="搜索商家/服务"
              v-model="searchKeyword"
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
            :class="{
              active: activeFilterId === filter.id || activeFilters[filter.id],
            }"
          >
            <up-icon
              name="map"
              size="14"
              :color="
                activeFilterId === filter.id || activeFilters[filter.id]
                  ? '#AB7E2B'
                  : '#383838'
              "
              v-if="filter.id === 1"
            >
            </up-icon>
            {{ filter.name }}
            <up-icon
              name="arrow-down"
              size="14"
              :color="
                activeFilterId === filter.id || activeFilters[filter.id]
                  ? '#AB7E2B'
                  : '#383838'
              "
            >
            </up-icon>
          </view>
        </template>
      </view>
    </view>

    <view class="banner">
      <swiper class="banner-swiper" autoplay circular indicator-dots>
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image_url" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>
    </view>

    <up-overlay :show="show" @click="show = false">
      <view class="filter-dialog" @tap.stop>
        <view class="filter-content">
          <view
            v-for="(option, index) in showOptionsList"
            :key="index"
            class="area-item"
            :class="{
              active:
                (typeof option === 'object' &&
                  tempSelectedValue &&
                  typeof tempSelectedValue === 'object' &&
                  option.id === tempSelectedValue.id) ||
                (typeof option === 'string' && tempSelectedValue === option),
            }"
            @click="selectOption(option)"
          >
            {{ typeof option === "object" ? option.name : option }}
          </view>
        </view>
        <view class="filter-footer">
          <view class="cancle-btn" @click="resetAreaSelection">重置</view>
          <view class="confirm-btn" @click="confirmAreaSelection">确定</view>
        </view>
      </view>
    </up-overlay>
    <!-- 酒店列表 -->
    <scroll-view class="list" scroll-y="true" @scrolltolower="loadMore">
      <view v-if="merchantList.length === 0" class="empty">暂无匹配的商家</view>
      <view
        v-for="merchant in merchantList"
        :key="merchant.id"
        class="hotel-card"
        @click="openDetail(merchant)"
      >
        <image
          class="hotel-img"
          :src="
            merchant.cover_image ||
            (merchant.images && merchant.images.length > 0
              ? merchant.images[0]
              : '')
          "
          mode="aspectFill"
        />
        <view class="hotel-info">
          <view class="hotel-row">
            <text class="hotel-name">{{
              merchant.name || merchant.title
            }}</text>
          </view>
          <view class="hotel-time">
            <text class="rate">{{ merchant.rating }}分</text>
          </view>
          <view class="description">{{
            merchant.description || "暂无描述"
          }}</view>
          <view class="hotel-desc">
            <up-icon name="map" size="14" color="#AB7E2B"> </up-icon>
            <text class="text">{{ merchant.address || "暂无地址" }}</text>
          </view>

          <view class="hotel-intro">
            <image
              :src="merchant.merchant.logo"
              mode="aspectFill"
              class="user-icon"
            ></image>
            <text class="user-name">{{ merchant.merchant.name }}</text>
          </view>
        </view>
      </view>
      <view v-if="loading" class="loading">加载中...</view>
      <view v-if="!hasMore && merchantList.length > 0" class="no-more"
        >没有更多数据了</view
      >
    </scroll-view>
  </view>
</template>

<script setup >
import { ref, reactive, onMounted, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getBanners, getProducts, getDictionary } from "@/api/product";

// 页面标题
const pageTitle = ref("婚礼策划");

// 接收页面参数
onLoad((options) => {
  console.log("页面参数:", options);
  if (options && options.title) {
    pageTitle.value = options.title;
  }
});

const show = ref(false);
const showOptionsList = ref([]);
const currentFilterType = ref(null); // 当前正在操作的筛选类型
// 轮播图数据
const banners = ref([]);
const activeFilterId = ref(null); // 当前展开的筛选项ID，用于UI高亮
const filtersList = ref([]); // 动态筛选项列表

// 商家列表数据
const merchantList = ref([]);
const currentPage = ref(1);
const totalPage = ref(1);
const loading = ref(false);
const hasMore = ref(true);

// 存储用户选择的筛选结果: { filterId: value }
// value 可以是 id (如果是对象数组) 或 name/string (如果是字符串数组)
const activeFilters = reactive({});

const showOptions = (filter) => {
  console.log("显示选项：", filter);
  currentFilterType.value = filter.type;
  activeFilterId.value = filter.id;

  // 准备弹窗显示的选项列表
  // 根据参考方案优化选项处理，确保显示名称一致
  if (filter.options && Array.isArray(filter.options)) {
    // 如果选项是对象数组，通常我们希望在弹窗中显示 name，但内部保留对象以便获取 id
    // 这里的 showOptionsList 直接用于 v-for，模板中已经做了 typeof 判断
    showOptionsList.value = filter.options;
  } else {
    showOptionsList.value = [];
  }

  show.value = true;
};

// 弹窗中选择某一项
function selectOption(item) {
  if (currentFilterType.value) {
    tempSelectedValue.value = item;
  }
}

// 临时存储弹窗内选中的值
const tempSelectedValue = ref(null);

// 处理预算区间筛选
const handleBudgetFilter = (value, params) => {
  if (typeof value !== "string") return;

  // 解析预算区间字符串
  if (value === "1000以下") {
    params.meal_standard_max = 1000;
  } else if (value === "5000以上") {
    params.meal_standard_min = 5000;
  } else if (value.includes("-")) {
    // 去除非数字和横杠的字符后再转换数字
    const cleanValue = value.replace(/[^\d-]/g, "");
    const [min, max] = cleanValue.split("-").map(Number);
    params.meal_standard_min = min;
    params.meal_standard_max = max;
  }
};

// 处理从业时长筛选
const handleExperienceFilter = (value, params) => {
  if (typeof value !== "string") return;

  // 解析从业时长字符串
  if (value === "10年以上") {
    params.experience_years_min = 10;
  } else if (value.includes("-")) {
    // 去除中文字符后再转换数字
    const cleanValue = value.replace(/[^\d-]/g, "");
    const [min, max] = cleanValue.split("-").map(Number);
    params.experience_years_min = min;
    params.experience_years_max = max;
  }
};

// 处理综合排序筛选
const handleSortFilter = (value, params) => {
  if (typeof value !== "string") return;

  // 高分优先使用desc排序
  if (value === "高分优先") {
    params.sort_order = "desc";
  }
};

// 当打开弹窗时，初始化临时选中值为当前已选中的值
watch(show, (newVal) => {
  if (newVal && activeFilterId.value) {
    tempSelectedValue.value = activeFilters[activeFilterId.value] || null;
  }
});

// 重置选择
function resetAreaSelection() {
  tempSelectedValue.value = null;
  // 清除当前筛选条件
  if (activeFilterId.value !== null) {
    delete activeFilters[activeFilterId.value];
  }
  // 清除高亮状态
  activeFilterId.value = null;
  // 关闭弹窗
  show.value = false;
  // 重置页码并重新加载数据
  currentPage.value = 1;
  loadMerchants(1);
}

// 确认选择
function confirmAreaSelection() {
  if (activeFilterId.value !== null) {
    if (
      tempSelectedValue.value !== null &&
      tempSelectedValue.value !== undefined
    ) {
      activeFilters[activeFilterId.value] = tempSelectedValue.value;
    } else {
      delete activeFilters[activeFilterId.value];
    }
  }
  show.value = false;
  activeFilterId.value = null;
  // 重新加载数据或触发过滤
  currentPage.value = 1;
  loadMerchants(1);
}

// 搜索关键词状态
const searchKeyword = ref("");

// 从接口获取商家列表
const loadMerchants = async (page = 1) => {
  if (loading.value || (!hasMore.value && page > 1)) return;

  loading.value = true;

  try {
    // 构建筛选参数
    const params = {
      page: page,
      per_page: 10,
    };
    // 添加关键词搜索
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value;
    }

    // 处理筛选条件
    for (const filterId in activeFilters) {
      const selectedValue = activeFilters[filterId];
      if (selectedValue === null || selectedValue === undefined) continue;

      const filterDef = filtersList.value.find((f) => f.id == filterId);
      if (!filterDef) continue;

      // 根据筛选类型处理不同的参数
      if (filterDef.type === "meal_standard") {
        // 预算区间处理
        handleBudgetFilter(selectedValue, params);
      } else if (filterDef.type === "experience") {
        // 从业时长处理
        handleExperienceFilter(selectedValue, params);
      } else if (filterDef.type === "sort_order") {
        // 综合排序处理
        handleSortFilter(selectedValue, params);
      } else if (
        filterDef.type === "district" &&
        typeof selectedValue === "object"
      ) {
        // 区域筛选(对象类型，取id)
        params.district = selectedValue.name;
      } else if (typeof selectedValue === "string") {
        // 其他字符串类型直接传值
        params[filterDef.type] = selectedValue;
      }
    }
    params.category_id = 6;
    const response = await getProducts(page, 10, params);

    // 根据API实际返回的数据结构进行处理
    // API返回格式: {"code":200,"message":"success","data":[...]}
    let merchantsData = [];
    let paginationInfo = {};

    if (response) {
      // 正确提取商家数据
      merchantsData = response || [];
      // 提取分页信息
      paginationInfo = response.pagination || {}; // 如果response.data不是数组而是包含分页信息的对象
    } else {
      merchantsData = [];
    }

    console.log("获取商家列表成功:", merchantsData);

    // 更新分页信息，如果API返回了分页数据
    if (paginationInfo.current_page !== undefined) {
      currentPage.value = paginationInfo.current_page;
    }
    if (paginationInfo.last_page !== undefined) {
      totalPage.value = paginationInfo.last_page;
    }
    if (
      paginationInfo.per_page !== undefined &&
      paginationInfo.total !== undefined
    ) {
      hasMore.value = paginationInfo.current_page < paginationInfo.last_page;
    }

    if (page === 1) {
      merchantList.value = merchantsData;
    } else {
      merchantList.value = [...merchantList.value, ...merchantsData];
    }

    // 如果没有更多数据，更新hasMore状态
    hasMore.value = currentPage.value < totalPage.value;
  } catch (error) {
    console.error("获取商家列表失败:", error);
    // 出错时也要停止加载状态
    merchantList.value = [];
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
};

// 加载更多数据
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    loadMerchants(currentPage.value + 1);
  }
};

function onSearch() {
  // 触发搜索，重置到第一页并重新加载数据
  console.log("搜索：", searchKeyword.value);
  currentPage.value = 1;
  loadMerchants(1);
}

// 定义方法
const rightClick = () => {
  console.log("rightClick");
};

function clearFilters() {
  searchKeyword.value = "";
  // 清空所有动态筛选
  Object.keys(activeFilters).forEach((key) => {
    delete activeFilters[key];
  });
  currentPage.value = 1;
  loadMerchants(1);
}

function openDetail(hotel) {
  console.log("打开详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/planDetail?id=${hotel.id}`,
    });
  }
}
// 获取banner
const loadGetBanner = async () => {
  try {
    const response = await getBanners(1);
    banners.value = response || [];
    console.log("banner:", response);
  } catch (error) {
    console.error("请求推荐商家数据出错:", error);
  }
};

// 获取筛选条件
const loadGetDictionary = async () => {
  try {
    const response = await getDictionary();
    // 处理接口返回的数据，构建筛选列表
    const { district } = response;
    // 构建筛选项列表
    const newFiltersList = [];

    if (district && district.length > 0) {
      newFiltersList.push({
        id: 1,
        name: "区域",
        type: "district",
        options: district, // 直接使用API返回的district数组，不再添加"全部"
      });
    }

    newFiltersList.push({
      id: 2,
      name: "预算区间",
      type: "meal_standard",
      options: [
        "1000以下",
        "1000-2000",
        "2000-3000",
        "3000-4000",
        "4000-5000",
        "5000以上",
      ], // 直接使用API返回的venue_type数组
    });

    newFiltersList.push({
      id: 3,
      name: "从业时长",
      type: "experience",
      options: ["1-3年", "3-5年", "5-10年", "10年以上"], // 直接使用API返回的feature数组
    });

    newFiltersList.push({
      id: 4,
      name: "综合排序",
      type: "sort_order",
      options: ["高分优先"], // 直接使用API返回的service_category数组
    });

    filtersList.value = newFiltersList;

    console.log("筛选条件:", response);
  } catch (error) {
    console.error("请求筛选条件数据出错:", error);
  }
};

// 搜索框点击事件
function onSearchClick() {
  uni.navigateTo({
    url: "/pages/merchant/search",
  });
}

onMounted(() => {
  loadGetBanner();
  loadGetDictionary();
  // 加载商家列表数据
  loadMerchants(1);
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.page {
  background: #f0f0f0;
  min-height: 100vh;
}

.fixedcon {
  position: fixed;
  left: 0;
  right: 0;
  top: 170rpx;
  z-index: 99999;
}

.banner {
  margin-bottom: $spacing-md;
  margin-top: 380rpx;
  .banner-swiper {
    height: 460rpx;
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
  margin-bottom: 6px;
  height: 80rpx;
  margin-top: 20rpx;
}
.hotel-name {
  font-size: 32rpx;
  font-weight: 600;
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
  display: flex;
  align-items: center;
  .rate {
    border-radius: 20rpx;
    background: linear-gradient(
      180deg,
      #f1daa6 0%,
      #f9eccc 33.03%,
      #e9cc90 100%
    );
    padding: 3rpx 10rpx;
    color: #d43030;
  }
}
.description {
  // 一行省略
  font-weight: 400;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #808080;
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
  top: 346rpx;
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
.no-more,
.loading {
  text-align: center;
  font-size: 26rpx;
  color: #999;
  margin-top: 40rpx;
}
</style>

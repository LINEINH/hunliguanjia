
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
              placeholder="搜索商家"
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

    <view class="category-grid" v-if="Number(category) >= 10">
      <view
        v-for="item in categories"
        :key="item.id"
        class="category-item"
        :class="{ 'category-active': Number(category) === Number(item.id) }"
        @click="handleCategoryClick(item)"
      >
        <image :src="item.icon" class="category-icon" lazy-load />
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>
    <!-- 酒店列表 -->
    <scroll-view
      class="list"
      scroll-y="true"
      @scrolltolower="loadMore"
      :lower-threshold="100"
    >
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
          <swiper-item v-for="(item, index) in banners" :key="index">
            <image
              :src="item.image_url"
              mode="aspectFill"
              class="banner-image"
              lazy-load
            />
          </swiper-item>
        </swiper>
      </view>
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
          lazy-load
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
            merchant.short_description || "暂无描述"
          }}</view>
          <view class="hotel-desc">
            <up-icon name="map" size="14" color="#AB7E2B"> </up-icon>
            <text class="text">{{ merchant.address || "暂无地址" }}</text>
          </view>
          <view class="hotel-highlights">
            <text
              v-for="(h, idx) in merchant.personnel_tags"
              :key="idx"
              class="highlight"
              >{{ h }}</text
            >
          </view>

          <view class="hotel-intro">
            <image
              :src="merchant.logo"
              mode="aspectFill"
              class="user-icon"
              lazy-load
            ></image>
            <text class="user-name">{{ merchant.name }}</text>
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
import { getBanners, merchants, getDictionary } from "@/api/product";

// 页面标题
const pageTitle = ref("婚礼策划");
const category = ref(null);

// 接收页面参数
onLoad((options) => {
  console.log("页面参数:", options);
  if (options && options.title) {
    pageTitle.value = options.title;
    category.value = options.category || "1";
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

const categories = ref([
  {
    id: 11,
    name: "婚礼车队",
    icon: "/static/images/30.png",
  },
  {
    id: 12,
    name: "婚礼伴手礼",
    icon: "/static/images/31.png",
  },
  {
    id: 13,
    name: "photobooth",
    icon: "/static/images/32.png",
  },
  {
    id: 14,
    name: "茶歇甜品",
    icon: "/static/images/33.png",
  },
  {
    id: 15,
    name: "宴会酒水",
    icon: "/static/images/34.png",
  },
  {
    id: 16,
    name: "互动演绎",
    icon: "/static/images/35.png",
  },
  {
    id: 17,
    name: "婚礼床品",
    icon: "/static/images/36.png",
  },
  {
    id: 18,
    name: "婚礼用品",
    icon: "/static/images/37.png",
  },
  {
    id: 19,
    name: "妇产医院",
    icon: "/static/images/38.png",
  },
  {
    id: 20,
    name: "月子中心",
    icon: "/static/images/39.png",
  },
]);
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
    params.budget_max = 1000;
  } else if (value === "5000以上") {
    params.budget_min = 5000;
  } else if (value.includes("-")) {
    // 去除非数字和横杠的字符后再转换数字
    const cleanValue = value.replace(/[^\d-]/g, "");
    const [min, max] = cleanValue.split("-").map(Number);
    params.budget_min = min;
    params.budget_max = max;
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
    params.sort_by = "rating";
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
  // 关闭弹窗
  show.value = false;
  // 清除高亮状态
  activeFilterId.value = null;
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
    if (category.value) {
      params.service_category_id = category.value;
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
      } else if (filterDef.type === "sort_by") {
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

    const response = await merchants(page, 10, params);

    // 根据API实际返回的数据结构进行处理
    // API返回格式: {"code":200,"message":"success","data":[...]}
    let merchantsData = [];
    let paginationInfo = {};

    if (response) {
      // 正确提取商家数据
      merchantsData = response.list || [];
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
      url: `/pages/merchant/hotelDetail?id=${hotel.id}`,
    });
  }
}
// 获取banner
const loadGetBanner = async () => {
  try {
    const response = await getBanners(category.value || 1);
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
    const { district, venue_type, feature, service_category } = response;
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
    console.log("获取筛选条件成功:", category.value, "ssssss");
    // 根据 category.value 的值 显示不同的 预算区间
    if (Number(category.value) === 7) {
      newFiltersList.push({
        id: 2,
        name: "预算区间",
        type: "meal_standard",
        options: [
          "1680以下",
          "1680-2980",
          "2980-3980",
          "3980-4980",
          "4980-6980",
          "6980-12800",
          "12800以上",
        ],
      });
    } else if (Number(category.value) === 8 || Number(category.value) === 9) {
      newFiltersList.push({
        id: 2,
        name: "预算区间",
        type: "meal_standard",
        options: [
          "3500以下",
          "3500-4500",
          "4500-6000",
          "6000-7000",
          "7000-9000",
          "9000-12000",
          "12000以上",
        ],
      });
    } else if (Number(category.value) === 4) {
      newFiltersList.push({
        id: 2,
        name: "预算区间",
        type: "meal_standard",
        options: [
          "2000以下",
          "2000-4000",
          "4000-6000",
          "6000-8000",
          "8000-10000",
          "10000-120000",
          "120000以上",
        ],
      });
    } else if (Number(category.value) === 3) {
      newFiltersList.push({
        id: 2,
        name: "预算区间",
        type: "meal_standard",
        options: [
          "10000以下",
          "10000-20000",
          "20000-30000",
          "30000-50000",
          "50000-80000",
          "80000-100000",
          "100000以上",
        ],
      });
    } else {
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
    }

    newFiltersList.push({
      id: 3,
      name: "从业时长",
      type: "experience",
      options: ["1-3年", "3-5年", "5-10年", "10年以上"], // 直接使用API返回的feature数组
    });

    newFiltersList.push({
      id: 4,
      name: "综合排序",
      type: "sort_by",
      options: ["高分优先"], // 直接使用API返回的service_category数组
    });

    filtersList.value = newFiltersList;

    console.log("筛选条件:", response);
  } catch (error) {
    console.error("请求筛选条件数据出错:", error);
    // 如果接口失败，使用默认数据
    filtersList.value = [
      {
        id: 1,
        name: "区域",
        type: "district",
        options: [
          { id: 1, name: "新城區" },
          { id: 2, name: "碑林區" },
          { id: 3, name: "蓮湖區" },
        ],
      },
      {
        id: 2,
        name: "场地类型",
        type: "venue_type",
        options: [
          "宴会厅",
          "户外草坪",
          "中式园林",
          "西式教堂",
          "酒店宴会厅",
          "特色场地",
        ],
      },
      {
        id: 3,
        name: "特色服务",
        type: "feature",
        options: [
          "可停车",
          "可住宿",
          "有化妆间",
          "可布置现场",
          "可带酒水",
          "有投影仪",
          "有音响设备",
          "有灯光设备",
        ],
      },
      {
        id: 4,
        name: "服务分类",
        type: "service_category",
        options: [
          { id: 1, name: "婚宴酒店" },
          { id: 2, name: "婚礼策划" },
          { id: 3, name: "婚礼主持" },
        ],
      },
    ];
  }
};

// 搜索框点击事件
function onSearchClick() {
  uni.navigateTo({
    url: "/pages/merchant/search",
  });
}

// 处理分类点击
function handleCategoryClick(item) {
  console.log("点击分类:", item);
  // 设置当前选中的分类ID
  category.value = String(item.id);
  // 重置页码并重新加载数据
  currentPage.value = 1;
  merchantList.value = [];
  hasMore.value = true;
  loadMerchants(1);
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
  height: calc(100vh - 50rpx);
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
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
  flex-shrink: 0;
}
.hotel-info {
  flex: 1;
}
.hotel-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  height: 40rpx;
  margin-top: 20rpx;
}
.hotel-name {
  font-size: 32rpx;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
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
  font-size: 24rpx;
  color: #808080;
  margin-top: 15rpx;
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
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
.hotel-highlights {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  height: 48rpx;
}
.highlight {
  font-size: 24rpx;
  color: #ab7e2b;
  border: 1px solid #ab7e2b;
  padding: 4rpx 12rpx;
  border-radius: 24rpx;
  height: 32rpx;
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

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $spacing-md;
  padding: $spacing-md;

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .category-icon {
      width: 60rpx;
      height: 60rpx;
      margin-bottom: $spacing-sm;
    }

    .category-name {
      font-size: $font-xs;
      color: $text-primary;
    }
  }
}
.category-active {
  .category-name {
    color: #ab7e2b !important;
  }
}
</style>

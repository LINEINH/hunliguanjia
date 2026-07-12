<template>
  <view class="hotel-page">
    <view class="fixedcon">
      <view class="search-bar">
        <view class="search-box">
          <view class="search-box-left">
            <up-icon name="search" size="20" color="#BCBCBC"></up-icon>
            <input
              class="uni-input"
              confirm-type="search"
              placeholder="搜索商家"
              v-model="searchKeyword"
              @confirm="onSearch"
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
            </up-icon>
          </view>
        </template>
      </view>
    </view>

    <up-overlay :show="show" @click="closeOverlay">
      <view class="filter-dialog" @tap.stop>
        <view class="filter-content">
          <view
            v-for="(area, index) in showOptionsList"
            :key="index"
            class="area-item"
            :class="{ active: getActiveState(index) }"
            @click="selectOption(index)"
          >
            {{ area }}
          </view>
        </view>
        <view class="filter-footer">
          <view class="cancle-btn" @click="resetAreaSelection">重置</view>
          <view class="confirm-btn" @click="confirmAreaSelection">确定</view>
        </view>
      </view>
    </up-overlay>
    <!-- 酒店列表 -->
    <scroll-view
      class="list"
      scroll-y="true"
      @scrolltolower="loadMoreMerchants"
      :lower-threshold="100"
    >
      <view class="banner" v-if="banners && banners.length">
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
            <image :src="item.image_url" mode="widthFix" class="banner-image" />
          </swiper-item>
        </swiper>
      </view>
      <view v-if="filteredHotels.length === 0" class="empty"
        >暂无匹配的酒店</view
      >
      <view
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        class="hotel-card"
        @click="openDetail(hotel)"
      >
        <image
          src="https://web.1love.com.cn/coupon.png"
          class="couponImg"
          mode="widthFix"
          v-if="hotel.has_available_coupon"
        />
        <image class="hotel-img" :src="hotel.cover_image" mode="aspectFill" />
        <view class="hotel-info">
          <view class="hotel-row">
            <text class="hotel-name">{{ hotel.name }}</text>
          </view>
          <view class="hotel-time"
            ><text class="rate">{{ hotel.rating }}分</text>
            {{ hotel.business_status }} {{ hotel.business_hours }}
          </view>
          <view class="hotel-desc"> {{ hotel.short_description }} </view>
          <view class="hotel-highlights">
            <text
              v-for="(h, idx) in hotel.personnel_tags"
              :key="idx"
              class="highlight"
              >{{ h }}</text
            >
          </view>
          <view class="hotel-address">
            <up-icon name="map" size="14" color="# AB7E2B"> </up-icon>
            <text class="text"> {{ hotel.address }}</text></view
          >
        </view>
      </view>

      <!-- 加载更多提示 -->
      <view class="loading-more" v-if="loadingMore">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="noMore">
        <text>没有更多数据了</text>
      </view>

      <view
        class="recommond"
        v-if="recommendMerchants && recommendMerchants.length"
      >
        <view class="title"> 推荐商户 </view>
        <view
          v-for="hotel in recommendMerchants"
          :key="hotel.id"
          class="hotel-card"
          @click="openDetail(hotel)"
        >
          <image class="hotel-img" :src="hotel.cover_image" mode="aspectFill" />
          <view class="hotel-info">
            <view class="hotel-row">
              <text class="hotel-name">{{ hotel.name }}</text>
            </view>
            <view class="hotel-time"
              ><text class="rate">{{ hotel.rating }}分</text>
              {{ hotel.business_status }} {{ hotel.business_hours }}
            </view>
            <view class="hotel-desc"> {{ hotel.short_description }} </view>
            <view class="hotel-highlights">
              <text
                v-for="(h, idx) in hotel.personnel_tags"
                :key="idx"
                class="highlight"
                >{{ h }}</text
              >
            </view>
            <view class="hotel-address">
              <up-icon name="map" size="14" color="# AB7E2B"> </up-icon>
              <text class="text"> {{ hotel.address }}</text></view
            >
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import {
  getHotelFilter,
  getBanners,
  merchants,
  getMRecommend,
} from "@/api/product";

// 搜索关键词
const searchKeyword = ref("");
const banners = ref([]);

// 添加筛选条件数据的响应式变量
const filterData = ref(null);

// 添加加载状态
const loading = ref(false);

// 定义响应式数据
const merchantList = ref([]);
const currentPage = ref(1); // 当前页码
const pageSize = ref(999); // 每页数量
const total = ref(0); // 总数据量
const loadingMore = ref(false); // 是否正在加载更多
const noMore = ref(false); // 是否还有更多数据

const show = ref(false);
const showOptionsList = ref([]);
const tempSelectedfilters = ref(null); // 临时存储选中的筛选项ID

const filtersList = ref([]);

// 添加筛选参数
const selectedDistrict = ref(""); // 选中的区域
const selectedTableCapacity = ref(null); // 选中的桌数范围
const selectedMealStandard = ref(null); // 选中的餐标范围
const selectedVenueType = ref(""); // 选中的场地类型

// 临时筛选参数
const tempSelectedArea = ref(-1); // 临时选中的区域索引
const tempSelectedTableCapacity = ref(-1); // 临时选中的桌数范围
const tempSelectedMealStandard = ref(-1); // 临时选中的餐标范围
const tempSelectedVenueType = ref(-1); // 临时选中的场地类型索引

// 推荐商户
const recommendMerchants = ref([]);
// 获取筛选条件
async function loadFilterConditions() {
  try {
    loading.value = true;
    const response = await getHotelFilter();
    loading.value = false;
    filtersList.value = [
      {
        id: 1,
        name: "区域",
        options: response.districts,
      },
      {
        id: 2,
        name: "桌数",
        options: response.table_capacities,
      },
      {
        id: 3,
        name: "餐标",
        options: response.meal_standards,
      },
      {
        id: 4,
        name: "场地类型",
        options: response.venue_types,
      },
    ];
    console.log("筛选条件数据:", response);
  } catch (error) {
    console.error("获取筛选条件失败:", error);
    uni.showToast({
      title: "获取筛选条件失败",
      icon: "none",
    });

    // 失败时使用默认数据
    filtersList.value = [
      {
        id: 1,
        name: "区域",
        options: ["全部", "市中心", "近郊", "机场周边", "高铁站附近"],
      },
      {
        id: 2,
        name: "桌数",
        options: [
          { min: 0, max: 10, label: "10桌以下" },
          { min: 11, max: 20, label: "10-20桌" },
          { min: 21, max: 50, label: "20-50桌" },
          { min: 51, max: 999, label: "50桌以上" },
        ],
      },
      {
        id: 3,
        name: "餐标",
        options: [
          { min: 0, max: 800, label: "经济餐标" },
          { min: 801, max: 1500, label: "标准餐标" },
          { min: 1501, max: 9999, label: "高档餐标" },
        ],
      },
      {
        id: 4,
        name: "场地类型",
        options: ["全部", "宴会厅", "会议室", "多功能厅", "户外场地"],
      },
    ];
  } finally {
    loading.value = false;
  }
}

// 获取banner
const loadGetBanner = async () => {
  try {
    const response = await getBanners(2);
    banners.value = response || [];
    console.log("banner:", response);
  } catch (error) {
    console.error("请求推荐商家数据出错:", error);
  }
};

function shuffle(arr) {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// 调用接口获取商家列表
async function loadMerchants(params = {}, resetPage = true) {
  console.log("接口调用参数:", params);
  try {
    if (resetPage) {
      // 重置分页参数
      currentPage.value = 1;
      merchantList.value = [];
      noMore.value = false;
      loading.value = true;
    } else {
      // 加载更多时显示加载状态
      loadingMore.value = true;
    }
    params.service_category_id = 2;

    // 调用 merchants 接口，获取指定页码和数量的数据
    const response = await merchants(currentPage.value, pageSize.value, params);
    console.log(response, "response");
    if (response) {
      if (resetPage) {
        // 重置数据
        merchantList.value = shuffle(response.list) || [];
        total.value =
          response.pagination.total ||
          (response.list && response.list.length ? response.list.length : 0);
      } else {
        // 追加数据
        const newData = response.list || [];
        merchantList.value = [...merchantList.value, ...newData];

        // 判断是否还有更多数据
        if (
          response.pagination.total &&
          merchantList.value.length >= response.pagination.total
        ) {
          noMore.value = true;
        }
      }

      console.log("商家列表:", merchantList.value);
    }
  } catch (error) {
    console.error("获取商家列表失败:", error);
    uni.showToast({
      title: "获取商家列表失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

// 加载更多商家
async function loadMoreMerchants() {
  if (loading.value || loadingMore.value || noMore.value) {
    return; // 正在加载或没有更多数据时，不执行
  }

  currentPage.value++;
  await loadMerchants(getCurrentParams(), false);
}

// 获取当前筛选参数
function getCurrentParams() {
  const params = {};
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value;
  }
  if (selectedDistrict.value && selectedDistrict.value !== "全部") {
    params.district = selectedDistrict.value;
  }
  if (selectedTableCapacity.value) {
    params.table_capacity_min = selectedTableCapacity.value.min;
    params.table_capacity_max = selectedTableCapacity.value.max;
  }
  if (selectedMealStandard.value) {
    params.meal_standard_min = selectedMealStandard.value.min;
    params.meal_standard_max = selectedMealStandard.value.max;
  }
  if (selectedVenueType.value && selectedVenueType.value !== "全部") {
    params.venue_type = selectedVenueType.value;
  }
  return params;
}

// 显示筛选选项
const showOptions = (filter) => {
  console.log("显示选项：", filter);
  tempSelectedfilters.value = filter.id;

  // 根据筛选项ID处理选项显示
  if (filter.id === 2 || filter.id === 3) {
    // 对于桌数和餐标，只显示label
    const formattedOptions = filter.options.map((option) => option.label);
    console.log("处理后的选项：", formattedOptions);
    showOptionsList.value = formattedOptions;

    // 设置临时选中值
    if (filter.id === 2) {
      // 查找当前选中值的索引
      const currentIndex = filter.options.findIndex(
        (option) =>
          selectedTableCapacity.value &&
          option.min === selectedTableCapacity.value.min &&
          option.max === selectedTableCapacity.value.max
      );
      tempSelectedTableCapacity.value = currentIndex > -1 ? currentIndex : -1;
    } else if (filter.id === 3) {
      // 查找当前选中值的索引
      const currentIndex = filter.options.findIndex(
        (option) =>
          selectedMealStandard.value &&
          option.min === selectedMealStandard.value.min &&
          option.max === selectedMealStandard.value.max
      );
      tempSelectedMealStandard.value = currentIndex > -1 ? currentIndex : -1;
    }
  } else {
    showOptionsList.value = filter.options;

    // 设置临时选中值
    if (filter.id === 1) {
      // 查找当前选中区域的索引
      const currentIndex = filter.options.indexOf(selectedDistrict.value);
      tempSelectedArea.value = currentIndex > -1 ? currentIndex : -1;
    } else if (filter.id === 4) {
      // 查找当前选中场地类型的索引
      const currentIndex = filter.options.indexOf(selectedVenueType.value);
      tempSelectedVenueType.value = currentIndex > -1 ? currentIndex : -1;
    }
  }

  show.value = true;
};

// 根据当前筛选类型获取激活状态
function getActiveState(index) {
  if (tempSelectedfilters.value === 1) {
    return tempSelectedArea.value === index;
  } else if (tempSelectedfilters.value === 2) {
    return tempSelectedTableCapacity.value === index;
  } else if (tempSelectedfilters.value === 3) {
    return tempSelectedMealStandard.value === index;
  } else if (tempSelectedfilters.value === 4) {
    return tempSelectedVenueType.value === index;
  }
  return false;
}

// 选择选项（根据当前筛选类型）
function selectOption(index) {
  console.log(index, "index");
  if (tempSelectedfilters.value === 1) {
    tempSelectedArea.value = index;
  } else if (tempSelectedfilters.value === 2) {
    tempSelectedTableCapacity.value = index;
  } else if (tempSelectedfilters.value === 3) {
    tempSelectedMealStandard.value = index;
  } else if (tempSelectedfilters.value === 4) {
    tempSelectedVenueType.value = index;
  }
}

// 重置选择
function resetAreaSelection() {
  if (tempSelectedfilters.value === 1) {
    tempSelectedArea.value = -1; // 重置区域选择
    selectedDistrict.value = ""; // 清空已选区域
  } else if (tempSelectedfilters.value === 2) {
    tempSelectedTableCapacity.value = -1; // 重置桌数选择
    selectedTableCapacity.value = null; // 清空已选桌数范围
  } else if (tempSelectedfilters.value === 3) {
    tempSelectedMealStandard.value = -1; // 重置餐标选择
    selectedMealStandard.value = null; // 清空已选餐标范围
  } else if (tempSelectedfilters.value === 4) {
    tempSelectedVenueType.value = -1; // 重置场地类型选择
    selectedVenueType.value = ""; // 清空已选场地类型
  }
  // 清除高亮状态
  tempSelectedfilters.value = null;
  // 重置后调用接口更新数据
  const params = getCurrentParams();
  show.value = false;
  loadMerchants(params, true);
}

// 确认选择
function confirmAreaSelection() {
  if (tempSelectedfilters.value === 1) {
    // 更新选中的区域
    if (tempSelectedArea.value >= 0) {
      selectedDistrict.value = showOptionsList.value[tempSelectedArea.value];
    } else {
      selectedDistrict.value = ""; // 清空选择
    }
  } else if (tempSelectedfilters.value === 2) {
    // 更新选中的桌数范围
    if (tempSelectedTableCapacity.value >= 0) {
      const selectedOption = filtersList.value.find((f) => f.id === 2)?.options[
        tempSelectedTableCapacity.value
      ];
      selectedTableCapacity.value = selectedOption;
    } else {
      selectedTableCapacity.value = null; // 清空选择
    }
  } else if (tempSelectedfilters.value === 3) {
    // 更新选中的餐标范围
    if (tempSelectedMealStandard.value >= 0) {
      const selectedOption = filtersList.value.find((f) => f.id === 3)?.options[
        tempSelectedMealStandard.value
      ];
      selectedMealStandard.value = selectedOption;
    } else {
      selectedMealStandard.value = null; // 清空选择
    }
  } else if (tempSelectedfilters.value === 4) {
    // 更新选中的场地类型
    if (tempSelectedVenueType.value >= 0) {
      selectedVenueType.value =
        showOptionsList.value[tempSelectedVenueType.value];
    } else {
      selectedVenueType.value = ""; // 清空选择
    }
  }

  show.value = false;

  // 构造筛选参数并调用接口
  const params = getCurrentParams();

  // 重新加载数据（重置分页）
  loadMerchants(params, true);
}
function loadGetMRecommend() {
  getMRecommend().then((res) => {
    if (res) {
      recommendMerchants.value = res;
      console.log(res, "lkdjflsd");
      // recommend.value = res.data.data;
    }
  });
}

// 加载筛选条件数据

onMounted(() => {
  loadFilterConditions();
  loadMerchants({}, true);
  loadGetBanner();
  loadGetMRecommend();
});

const filteredHotels = computed(() => {
  // 这里我们不再使用本地过滤，而是直接显示从API获取的商家数据
  // 因为我们现在通过API调用获取筛选后的结果
  return merchantList.value;
});

// 定义方法
const rightClick = () => {
  console.log("rightClick");
};

function onSearch() {
  // 搜索逻辑可以通过重新调用 loadMerchants 并传递关键字来实现
  console.log("搜索触发", searchKeyword.value);
  loadMerchants(getCurrentParams(), true);
}

function closeOverlay() {
  tempSelectedfilters.value = null;
  show.value = false;
}

function openDetail(hotel) {
  console.log("打开酒店详情：", hotel);
  if (hotel && hotel.id) {
    uni.navigateTo({
      url: `/pages/merchant/hotelDetail?id=${hotel.id}`,
    });
  }
}

// 页面分享
onShareAppMessage(() => {
  return {
    title: "婚礼酒店 - 壹嫁婚选",
    path: "/pages/merchant/hotel",
    imageUrl: "",
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "婚礼酒店预订 - 壹嫁婚选",
    path: "/pages/merchant/hotel",
    imageUrl: "",
  };
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.hotel-page {
  .page {
    background: #f0f0f0;
    min-height: 100vh;
  }
  .banner {
    margin-bottom: $spacing-md;
    margin-top: 20rpx;
    .banner-swiper {
      height: 420rpx;
      border-radius: $radius-md;
      overflow: hidden;
    }

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }
  .fixedcon {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 99999;
    height: 190rpx;
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
        flex: 1;
      }
      .uni-input {
        font-size: 28rpx;
        margin-left: 10rpx;
        flex: 1;
      }
      .search-box-btn {
        border-radius: 40rpx;
        background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
        color: #fff;
        height: 60rpx;
        color: #612500;
        padding: 0 50rpx;
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
    background: #fff;
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    padding-top: 10rpx;
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
    background: linear-gradient(
      135deg,
      #f1daa6 0%,
      #f9eccc 33.03%,
      #e9cc90 100%
    );
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
    height: calc(100vh - 100rpx);
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    margin-top: 200rpx;
  }
  .hotel-card {
    display: flex;
    background: #fff;
    border-radius: 20rpx 0 0 20rpx;
    margin: 20rpx;
    padding-right: 20rpx;
    margin-top: 10rpx;
    position: relative;
    .couponImg {
      position: absolute;
      top: 0;
      right: 0;
      width: 200rpx;
      z-index: 1;
    }
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
    width: 430rpx;
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
    // 只可以显示一行
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
      padding: 3rpx 10rpx;
      color: #ab7e2b;
    }
  }
  .hotel-desc {
    font-size: 24rpx;
    color: #808080;
    margin: 15rpx 0;
  }
  .hotel-price {
    font-size: 26rpx;
    color: #ff6b00;
  }
  .hotel-address {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1px solid #bcbcbc;
    display: flex;
    align-items: center;
    color: #808080;
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 24rpx;
    }
  }
  .hotel-highlights {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
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

  .loading-more,
  .no-more {
    text-align: center;
    padding: 20rpx 0;
    color: #999;
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
    top: 190rpx;
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
  .recommond {
    padding-bottom: 100rpx;
    .title {
      margin: 20rpx;
      color: #ab7e2b;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}
</style>
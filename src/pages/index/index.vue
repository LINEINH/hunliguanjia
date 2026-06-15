<template>
  <view class="index-container">
    <!-- 轮播图 -->
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
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image
            :src="banner.image_url"
            mode="aspectFill"
            class="banner-image"
            @click="navigateToLink(banner.link)"
          />
        </swiper-item>
      </swiper>
    </view>

    <!-- 选择婚期和预算 / 日历组件 -->
    <view class="date-budget">
      <!-- 未选择时显示选择器 -->
      <view class="data-selector" v-if="!weddingDate || !selectedBudget">
        <view class="date-selector" @click="handleDateClick">
          <text class="budget-title">WEDDING DAY</text>
          <text class="budget-data">婚期</text>
          <text class="budget-text">{{ weddingDate || "选择婚礼时间" }}</text>
        </view>
        <view class="line"></view>
        <view class="budget-selector" @click="handleBudgetClick">
          <text class="budget-title">WEDDING BUDGET</text>
          <text class="budget-data">预算范围</text>
          <text class="budget-text">{{
            selectedBudget || "选择婚礼预算"
          }}</text>
        </view>
      </view>

      <!-- 已选择时显示日历组件 -->
      <template v-else>
        <view class="calendar-container">
          <view class="calendar-header">
            <view class="calendar-nav" @click.stop="prevMonth">
              <!-- <text class="nav-icon">‹</text> -->
              <up-icon name="arrow-left" size="18" color="#9CB2CD"></up-icon>
            </view>
            <text class="calendar-title"
              >{{ calendarYear }}年{{ calendarMonth }}月</text
            >
            <view class="calendar-nav" @click.stop="nextMonth">
              <!-- <text class="nav-icon">›</text> -->
              <up-icon name="arrow-right" size="18" color="#9CB2CD"></up-icon>
            </view>
          </view>

          <!-- 周视图（默认显示） -->
          <view v-if="!isCalendarExpanded" class="week-view">
            <view class="week-days">
              <view
                v-for="(day, index) in currentWeekDays"
                :key="index"
                class="week-day-item"
                :class="{
                  'day-other-month': day.isOtherMonth,
                  'day-today': day.isToday,
                  'day-wedding': day.isWeddingDay,
                }"
              >
                <text class="week-day-weekday">{{ day.weekday }}</text>
                <text class="week-day-number">{{ day.date }}</text>
                <text v-if="day.isWeddingDay" class="week-day-label">婚期</text>
              </view>
            </view>
            <view class="expand-hint" @click="toggleCalendarExpand">
              <!-- <text class="hint-icon"> </text> -->
              <up-icon name="arrow-down" size="16" color="#9CB2CD"></up-icon>
            </view>
          </view>

          <!-- 月视图（展开后显示） -->
          <view v-else class="month-view">
            <view class="calendar-weekdays">
              <text class="weekday">日</text>
              <text class="weekday">一</text>
              <text class="weekday">二</text>
              <text class="weekday">三</text>
              <text class="weekday">四</text>
              <text class="weekday">五</text>
              <text class="weekday">六</text>
            </view>
            <view class="calendar-days">
              <view
                v-for="(day, index) in calendarDays"
                :key="index"
                class="calendar-day"
                :class="{
                  'day-other-month': day.isOtherMonth,
                  'day-today': day.isToday,
                  'day-wedding': day.isWeddingDay,
                }"
              >
                <text class="day-number">{{ day.date }}</text>
                <text v-if="day.isWeddingDay" class="day-label">婚期</text>
              </view>
            </view>
            <view class="collapse-hint" @click.stop="toggleCalendarExpand">
              <view class="expand-hint"
                ><up-icon name="arrow-up" size="16" color="#9CB2CD"></up-icon
              ></view>
              <view class="hint-content" v-if="currentMonthTasks.length > 0">
                <view class="hit-title">
                  <text class="title">本月需完成事项</text>
                  <view class="choice">重新选择</view>
                </view>
                <view
                  v-for="(task, index) in currentMonthTasks"
                  :key="index"
                  class="hint-item"
                >
                  <view class="hint-left">
                    <image
                      src="/static/images/9.png"
                      mode="aspectFill"
                      class="hint-image"
                    />
                    <text class="price">{{ task.task }}</text>
                  </view>
                  <view class="hint-right">
                    <text class="price">{{ task.budget }}</text>
                    <up-icon
                      name="arrow-right"
                      size="16"
                      color="#BF974A"
                    ></up-icon>
                  </view>
                </view>
              </view>
              <view class="hint-content" v-else>
                <view class="hint-empty">
                  <text class="empty-text">本月暂无任务安排</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 美好瞬间 - 两列商品展示 -->
    <view class="planItem">
      <view class="section-header">
        <text class="section-title">美好瞬间</text>
      </view>
      <view class="moments-grid">
        <template v-for="(moment, index) in momentsList" :key="index">
          <view class="moment-item" @click="navigateToPlanItem(moment)">
            <image
              :src="moment.cover_image"
              class="moment-image"
              mode="aspectFill"
            ></image>
            <view class="moment-info">
              <text class="moment-title">{{ moment.title }}</text>

              <view class="moment-intro">
                <image
                  :src="moment.merchant.logo"
                  mode="aspectFill"
                  class="user-icon"
                ></image>
                <text class="user-name">{{ moment.merchant.name }}</text>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>

    <!-- 自定义日期选择器弹窗 -->
    <view
      v-if="showDatePicker"
      class="date-picker-mask"
      @click="showDatePicker = false"
    >
      <view class="date-picker-container" @click.stop>
        <view class="date-picker-header">
          <text class="date-picker-title">选择婚期</text>
          <text class="date-picker-close" @click="showDatePicker = false"
            >×</text
          >
        </view>
        <picker-view
          :value="pickerValue"
          @change="onPickerChange"
          class="date-picker-view"
        >
          <picker-view-column>
            <view v-for="year in years" :key="year" class="picker-item">
              {{ year }}年
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="month in months" :key="month" class="picker-item">
              {{ month }}月
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="day in days" :key="day" class="picker-item">
              {{ day }}日
            </view>
          </picker-view-column>
        </picker-view>
        <view class="date-picker-footer">
          <button class="date-picker-btn confirm-btn" @click="confirmDate">
            确定
          </button>
        </view>
      </view>
    </view>

    <!-- 自定义预算选择器弹窗 -->
    <view
      v-if="showBudgetPicker"
      class="budget-picker-mask"
      @click="showBudgetPicker = false"
    >
      <view class="budget-picker-container" @click.stop>
        <view class="budget-picker-header">
          <text class="budget-picker-title">填写桌数</text>
          <text class="budget-picker-close" @click="showBudgetPicker = false"
            >×</text
          >
        </view>
        <view class="budget-picker-content">
          <view class="budget-input-section">
            <view class="input-label">填写桌数</view>
            <input
              type="number"
              class="budget-input"
              placeholder="桌数"
              v-model="tableCount"
            />
          </view>
          <view class="budget-input-section">
            <view class="input-label">填写总预算</view>
            <input
              type="text"
              class="budget-input"
              placeholder="总预算（单位：元）"
              v-model="totalBudget"
            />
          </view>
        </view>
        <view class="budget-picker-footer">
          <button
            class="budget-picker-btn confirm-btn"
            @click="confirmBudgetInput"
          >
            确定
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getHomeInfo, weddingPlan, getWeddingPlan } from "@/api/index";
import { checkLogin, navigateToLogin } from "@/utils/auth";

// 婚期日期
const weddingDate = ref<string>("");

// 日期选择器显示状态
const showDatePicker = ref<boolean>(false);

// 预算选择器显示状态
const showBudgetPicker = ref<boolean>(false);

// 已选预算
const selectedBudget = ref<string>("");

// 桌数和总预算输入
const tableCount = ref<string>("");
const totalBudget = ref<string>("");

// 预算选项
const budgetOptions = [
  "5万以内",
  "5万-10万",
  "10万-20万",
  "20万-30万",
  "30万-50万",
  "50万以上",
];

// 临时选中的预算索引
const tempBudgetIndex = ref<number>(-1);

// 临时存储的桌数和预算
const tempTableCount = ref<string>("");
const tempTotalBudget = ref<string>("");

// 日期选择器的值 [年索引, 月索引, 日索引]
const pickerValue = ref<number[]>([0, 0, 0]);

// 临时存储选择的日期
const tempDate = ref<string>("");

// 日历相关变量
const calendarYear = ref<number>(new Date().getFullYear());
const calendarMonth = ref<number>(new Date().getMonth() + 1);
const calendarDays = ref<any[]>([]);

// 日历展开状态
const isCalendarExpanded = ref<boolean>(false);

// 当前周的天数（7天）
const currentWeekDays = ref<any[]>([]);

// 解析婚期日期
const weddingDateObj = ref<Date | null>(null);

// 首页数据
const homeData = ref<any>(null);

// 轮播图数据
const banners = ref<any[]>([]);

// 美好瞬间数据
interface Moment {
  cover_image: string;
  id: number;
  title: string;
  merchant: {
    logo: string;
    name: string;
  };
}

const momentsList = ref<Moment[]>([]);

// 婚礼规划数据
interface PlanningPhase {
  phase: string;
  date_range: string;
  days_remaining: string;
  tasks: string[];
  priority: string;
}

const planningPhases = ref<PlanningPhase[]>([]);
const currentMonthTasks = ref<any[]>([]);

// 获取首页数据
async function loadHomeInfo() {
  try {
    const response = await getHomeInfo();
    homeData.value = response;
    console.log(response);
    if (response.banners) {
      banners.value = response.banners;
    }

    // 解析推荐商家数据

    if (response.featured_cases) {
      momentsList.value = response.featured_cases;
    }

    console.log("首页数据:", response);
  } catch (error) {
    console.error("获取首页数据失败:", error);
    uni.showToast({
      title: "获取首页数据失败",
      icon: "none",
    });
  }
}

// 获取婚期规划数据
async function loadWeddingPlan() {
  // 检查是否登录
  if (!checkLogin()) {
    return;
  }

  try {
    const response = await getWeddingPlan();

    // 处理返回的规划数据
    if (response && response.planning_phases) {
      planningPhases.value = response.planning_phases;

      // 如果已有婚期日期，更新日历和任务
      if (response.wedding_date) {
        weddingDate.value = response.wedding_date;

        // 解析桌数和预算
        if (response.table_count) {
          tableCount.value = String(response.table_count);
        }
        if (response.total_budget) {
          // 将预算转换为万元显示
          const budgetInWan = (Number(response.total_budget) / 10000).toFixed(
            0
          );
          totalBudget.value = budgetInWan;
          selectedBudget.value = `${tableCount.value}桌，${budgetInWan}`;
        }

        // 初始化日历
        initCalendar();
      }

      console.log("婚期规划数据:", response);
    }
  } catch (error) {
    console.error("获取婚期规划失败:", error);
    // 不显示错误提示，避免影响用户体验
  }
}

// 获取当前周的7天数据（基于指定日期）
function getCurrentWeekDays(baseDate?: Date) {
  const today = baseDate || new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  const dayOfWeek = today.getDay(); // 0-6，0是星期日

  // 获取本周的第一天（星期日）
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);

  // 生成7天的数据
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    // 判断是否是今天
    const realToday = new Date();
    realToday.setHours(0, 0, 0, 0);
    const isToday = currentDate.getTime() === realToday.getTime();

    // 判断是否是婚期
    let isWeddingDay = false;
    if (weddingDate.value) {
      const [wYear, wMonth, wDay] = weddingDate.value.split("-").map(Number);
      isWeddingDay = year === wYear && month === wMonth && date === wDay;
    }

    // 判断是否是其他月份
    const isOtherMonth =
      year !== calendarYear.value || month !== calendarMonth.value;

    // 星期几的中文显示
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

    days.push({
      date: date,
      weekday: weekdays[currentDate.getDay()],
      isOtherMonth: isOtherMonth,
      isToday: isToday,
      isWeddingDay: isWeddingDay,
      fullDate: currentDate,
    });
  }

  currentWeekDays.value = days;
}

// 切换日历展开/收起状态
function toggleCalendarExpand() {
  isCalendarExpanded.value = !isCalendarExpanded.value;
}

// 生成日历数据
function generateCalendar(year: number, month: number) {
  const days = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay(); // 0-6，0是星期日

  // 获取婚期日期
  let weddingDay = -1;
  if (weddingDate.value) {
    const [wYear, wMonth, wDay] = weddingDate.value.split("-").map(Number);
    if (wYear === year && wMonth === month) {
      weddingDay = wDay;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 添加上个月的日期
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i;
    const dateObj = new Date(year, month - 2, date);
    days.push({
      date: date,
      isOtherMonth: true,
      isToday: false,
      isWeddingDay: false,
    });
  }

  // 添加当月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month - 1, i);
    dateObj.setHours(0, 0, 0, 0);
    const isToday = dateObj.getTime() === today.getTime();
    const isWeddingDay = i === weddingDay;

    days.push({
      date: i,
      isOtherMonth: false,
      isToday: isToday,
      isWeddingDay: isWeddingDay,
    });
  }

  // 添加下个月的日期（补齐6行）
  const remainingDays = 42 - days.length; // 6行 × 7天 = 42个格子
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isOtherMonth: true,
      isToday: false,
      isWeddingDay: false,
    });
  }

  calendarDays.value = days;
}

// 上一月
function prevMonth() {
  if (calendarMonth.value === 1) {
    calendarMonth.value = 12;
    calendarYear.value--;
  } else {
    calendarMonth.value--;
  }
  generateCalendar(calendarYear.value, calendarMonth.value);
  // 基于当前显示的月份第一天生成周视图
  const baseDate = new Date(calendarYear.value, calendarMonth.value - 1, 1);
  getCurrentWeekDays(baseDate);
  updateCurrentMonthTasks();
}

// 下一月
function nextMonth() {
  if (calendarMonth.value === 12) {
    calendarMonth.value = 1;
    calendarYear.value++;
  } else {
    calendarMonth.value++;
  }
  generateCalendar(calendarYear.value, calendarMonth.value);
  // 基于当前显示的月份第一天生成周视图
  const baseDate = new Date(calendarYear.value, calendarMonth.value - 1, 1);
  getCurrentWeekDays(baseDate);
  updateCurrentMonthTasks();
}

// 获取今天的日期
const today = new Date();
today.setHours(0, 0, 0, 0); // 设置为当天零点

// 年份范围（从当前年份开始往后5年）
const currentYear = today.getFullYear();
const years = ref<number[]>([]);
for (let i = currentYear; i <= currentYear + 5; i++) {
  years.value.push(i);
}

// 月份
const months = ref<number[]>([]);
for (let i = 1; i <= 12; i++) {
  months.value.push(i);
}

// 日期（根据年月动态计算）
const days = ref<number[]>([]);

// 初始化天数，过滤掉今天之前的日期
function updateDays(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  days.value = [];

  // 如果是当前年月，只显示今天及之后的日期
  if (year === today.getFullYear() && month === today.getMonth() + 1) {
    for (let i = today.getDate(); i <= daysInMonth; i++) {
      days.value.push(i);
    }
  } else {
    // 其他月份显示全部日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.value.push(i);
    }
  }
}

// 初始化默认值为今天
updateDays(today.getFullYear(), today.getMonth() + 1);
pickerValue.value = [
  0, // 第一个年份（今年）
  today.getMonth(), // 当前月份索引
  0, // 第一天（今天是第一个可选日期）
];

// 导航到链接
function navigateToLink(link: string) {
  if (link) {
    uni.navigateTo({ url: link });
  }
}

// 导航到分类
function navigateToCategory(category: any) {
  uni.navigateTo({ url: category.path });
}

// 导航到商家列表
function navigateToPlanItem(item: any) {
  uni.navigateTo({ url: `/pages/index/case?id=${item.id}` });
}

// 处理婚期点击
function handleDateClick() {
  if (!checkLogin()) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再选择婚期",
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
  showDatePicker.value = true;
}

// 处理预算范围点击
function handleBudgetClick() {
  if (!checkLogin()) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再选择预算范围",
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
  showBudgetPicker.value = true;
}

// picker-view 值改变事件
function onPickerChange(e: any) {
  const value = e.detail.value;
  pickerValue.value = value;

  // 更新天数（根据选择的年月）
  const selectedYear = years.value[value[0]];
  const selectedMonth = months.value[value[1]];
  updateDays(selectedYear, selectedMonth);

  // 如果当前选择的天数超出范围，调整为最后一天
  if (value[2] >= days.value.length) {
    pickerValue.value[2] = days.value.length - 1;
  }
}

// 确认选择日期
function confirmDate() {
  const year = years.value[pickerValue.value[0]];
  const month = months.value[pickerValue.value[1]];
  const day = days.value[pickerValue.value[2]];

  // 格式化日期为 YYYY-MM-DD
  weddingDate.value = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  console.log("选择的婚期:", weddingDate.value);
  showDatePicker.value = false;

  // 如果预算也已选择，初始化日历
  if (selectedBudget.value) {
    initCalendar();
  }
}

// 确认选择预算
function confirmBudget() {
  if (tempBudgetIndex.value === -1) {
    uni.showToast({
      title: "请选择预算范围",
      icon: "none",
    });
    return;
  }

  selectedBudget.value = budgetOptions[tempBudgetIndex.value];
  console.log("选择的预算:", selectedBudget.value);
  showBudgetPicker.value = false;

  // 如果婚期也已选择，初始化日历
  if (weddingDate.value) {
    initCalendar();
  }
}

// 新增预算输入确认函数
const confirmBudgetInput = async () => {
  // 验证输入是否为空
  if (!tableCount.value.trim()) {
    uni.showToast({
      title: "请填写桌数",
      icon: "none",
    });
    return;
  }

  if (!totalBudget.value.trim()) {
    uni.showToast({
      title: "请填写总预算",
      icon: "none",
    });
    return;
  }

  // 将桌数和预算设置为已选预算
  selectedBudget.value = `${tableCount.value}桌，${totalBudget.value}`;
  showBudgetPicker.value = false;

  // 调用婚礼计划接口生成日历
  try {
    uni.showLoading({
      title: "生成计划中...",
      mask: true,
    });

    const response = await weddingPlan(
      weddingDate.value,
      totalBudget.value,
      tableCount.value
    );

    uni.hideLoading();

    // 处理返回的规划数据
    if (response && response && response.planning_phases) {
      planningPhases.value = response.planning_phases;

      // 根据当前日历月份更新任务列表
      updateCurrentMonthTasks();

      uni.showToast({
        title: "计划生成成功",
        icon: "success",
      });
    } else {
      throw new Error("数据格式错误");
    }

    // 如果婚期也已选择，初始化日历
    if (weddingDate.value) {
      initCalendar();
    }
  } catch (error) {
    uni.hideLoading();
    console.error("生成婚礼计划失败:", error);
    uni.showToast({
      title: "生成计划失败，请重试",
      icon: "none",
    });
  }
};

// 初始化日历
function initCalendar() {
  // 使用当前日期作为日历显示的基准
  const now = new Date();
  calendarYear.value = now.getFullYear();
  calendarMonth.value = now.getMonth() + 1;
  generateCalendar(calendarYear.value, calendarMonth.value);

  // 基于当前日期生成本周视图
  getCurrentWeekDays(now);

  // 更新当前月份的任务
  updateCurrentMonthTasks();
}

// 根据当前月份更新任务列表
function updateCurrentMonthTasks() {
  if (!planningPhases.value.length) return;

  // 获取当前显示的年月
  const currentYear = calendarYear.value;
  const currentMonth = calendarMonth.value;

  // 查找包含当前月份的规划阶段
  const matchedPhase = planningPhases.value.find((phase) => {
    // date_range 格式如："2026年12月03日 - 2027年01月02日"
    // 提取前面的日期部分进行匹配
    const dateRange = phase.date_range;
    const match = dateRange.match(/(\d{4})年(\d{2})月/);

    if (match) {
      const rangeYear = parseInt(match[1]);
      const rangeMonth = parseInt(match[2]);

      // 匹配年份和月份
      return rangeYear === currentYear && rangeMonth === currentMonth;
    }

    return false;
  });

  if (matchedPhase) {
    currentMonthTasks.value = matchedPhase.tasks;
  } else {
    currentMonthTasks.value = [];
  }
}

// 加载数据
onMounted(() => {
  loadHomeInfo();
  console.log("checkLogin:", checkLogin());
  if (checkLogin()) {
    loadWeddingPlan();
  }
});

// 页面显示时重新加载数据（tabbar 切换时触发）
onShow(() => {
  loadHomeInfo();
  if (checkLogin()) {
    loadWeddingPlan();
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.index-container {
  .banner {
    margin-bottom: $spacing-md;

    .banner-swiper {
      height: 1200rpx;
      border-radius: $radius-md;
      overflow: hidden;
    }

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }

  .date-budget {
    background-color: #fff;
    border-radius: $radius-md;
    margin-bottom: $spacing-lg;
    border-radius: 16px;
    margin: $spacing-md;
    .data-selector {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: $spacing-lg;
      border-radius: 16px;
      background: linear-gradient(
        136.78deg,
        rgba(241, 218, 166, 1) 0%,
        rgba(249, 236, 204, 1) 33.03%,
        rgba(233, 204, 144, 1) 100%
      );

      border: 2px solid rgba(234, 196, 123, 1);
    }
    .line {
      width: 1px;
      height: 80rpx;
      background: linear-gradient(
        180deg,
        rgba(234, 196, 123, 1) 0%,
        rgba(241, 218, 166, 1) 100%
      );
      margin: 0 $spacing-md;
    }
    .date-selector,
    .budget-selector {
      display: flex;
      flex-direction: column;
      text-align: center;
      .budget-title {
        font-size: $font-xs;
        color: rgba(191, 151, 74, 1);
        margin-bottom: $spacing-xs;
        font-size: 12px;
      }
      .budget-data {
        font-size: $font-md;
        font-weight: bold;
        color: rgba(97, 37, 0, 1);
        margin-bottom: $spacing-xs;
        font-size: $font-md;
      }
      .budget-text {
        font-size: $font-sm;
        color: rgba(171, 126, 43, 1);
        font-size: $font-sm;
      }
    }
  }
  .planItem {
    margin: $spacing-md;
    padding-bottom: 30rpx;
  }
  // 美好瞬间样式
  .section-header {
    padding: $spacing-md 0;
    .section-title {
      font-size: $font-lg;
      font-weight: bold;
      color: #ab7e2b;
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
        height: 480rpx;
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
        }
      }
    }
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;
    padding: $spacing-md 0;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .category-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: $spacing-sm;
      }

      .category-name {
        font-size: $font-xs;
        color: $text-primary;
      }
    }
  }

  .section {
    margin-bottom: $spacing-lg;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;

      .section-title {
        font-size: $font-lg;
        font-weight: bold;
        color: $text-primary;
      }

      .section-more {
        font-size: $font-sm;
        color: $text-secondary;
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }

  // 日期选择器弹窗样式
  .date-picker-mask,
  .budget-picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    z-index: 9999;
  }

  .date-picker-container,
  .budget-picker-container {
    width: 100%;
    background-color: #fff;
    border-radius: $radius-lg $radius-lg 0 0;
    overflow: hidden;
  }

  .date-picker-header,
  .budget-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border-bottom: 1px solid #f0f0f0;
    position: relative;

    .date-picker-title,
    .budget-picker-title {
      font-size: $font-md;
      color: #000;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .date-picker-close,
    .budget-picker-close {
      font-size: 48rpx;
      color: $text-secondary;
      line-height: 1;
      margin-left: auto;
    }
  }

  .date-picker-view {
    height: 400rpx;
  }

  .picker-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-md;
    color: $text-primary;
  }

  .budget-picker-content {
    max-height: 600rpx;
    overflow-y: auto;
    padding: $spacing-md 0;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
  }

  .budget-option {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 0.5px solid #383838;
    transition: background-color 0.2s;
    width: 45%;
    height: 100rpx;
    margin-bottom: 20rpx;
    &:active {
      background-color: #f9f9f9;
    }

    &.budget-option-selected {
      background-color: #fdf6e6;
      border: 0.5px solid #eac47b;
      .budget-radio {
        .budget-radio-inner {
          opacity: 1;
        }
      }

      .budget-option-text {
        color: #d4a574;
      }
    }
  }

  .budget-radio {
    width: 32rpx;
    height: 32rpx;
    border: 2rpx solid #ccc;
    margin-right: $spacing-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .budget-radio-inner {
    width: 16rpx;
    height: 16rpx;
    background-color: #d4a574;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .budget-option-text {
    font-size: $font-md;
    color: $text-primary;
  }

  .date-picker-footer,
  .budget-picker-footer {
    display: flex;
    padding: $spacing-md $spacing-lg;
    // border-top: 1px solid #f0f0f0;

    .date-picker-btn,
    .budget-picker-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: $radius-md;
      font-size: $font-md;
      border: none;

      &::after {
        border: none;
      }
    }

    .confirm-btn {
      border-radius: 20px;
      background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
      color: #612500;
    }
  }

  // 日历组件样式
  .calendar-container {
    width: 100%;
    padding: $spacing-md 0;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 $spacing-md $spacing-md;

    .calendar-nav {
      width: 56rpx;
      height: 56rpx;
      display: flex;
      justify-content: center;
      border-radius: 20rpx;

      border: 0.77px solid #9cb2cd;
      &:active {
        background-color: #f0cd8c;
      }
    }

    .calendar-title {
      font-size: $font-lg;
      font-weight: bold;
      color: rgba(128, 128, 128, 1);
    }
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: $spacing-sm $spacing-md;
    border-bottom: 1px solid #f0f0f0;

    .weekday {
      text-align: center;
      font-size: $font-sm;
      color: $text-secondary;
      padding: $spacing-sm 0;
    }
  }

  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8rpx;
    padding: $spacing-md;

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: $radius-sm;
      position: relative;

      .day-number {
        font-size: $font-md;
        color: $text-primary;
      }

      .day-label {
        font-size: 20rpx;
        color: #d4a574;
        margin-top: 4rpx;
      }

      &.day-other-month {
        .day-number {
          color: #ccc;
        }
      }

      &.day-today {
        // background-color: #fff3e0;

        .day-number {
          color: #d4a574;
          font-weight: bold;
        }
      }

      &.day-wedding {
        background: linear-gradient(
          180deg,
          rgba(234, 196, 123, 1) 0%,
          rgba(241, 218, 166, 1) 100%
        );

        .day-number {
          color: #fff;
          font-weight: bold;
        }

        .day-label {
          color: #fff;
        }
      }
    }
  }

  // 周视图样式
  .week-view {
    padding: $spacing-md;

    .week-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8rpx;

      .week-day-item {
        aspect-ratio: 0.8;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: $radius-sm;
        padding: $spacing-xs;

        .week-day-weekday {
          font-size: 24rpx;
          color: $text-secondary;
          margin-bottom: 4rpx;
        }

        .week-day-number {
          font-size: $font-lg;
          color: $text-primary;
          font-weight: bold;
        }

        .week-day-label {
          font-size: 20rpx;
          color: #d4a574;
          margin-top: 4rpx;
        }

        &.day-other-month {
          .week-day-number {
            color: #ccc;
          }
        }

        &.day-today {
          // background-color: #fff3e0;

          .week-day-number {
            color: #d4a574;
          }
        }

        &.day-wedding {
          background: linear-gradient(
            180deg,
            rgba(234, 196, 123, 1) 0%,
            rgba(241, 218, 166, 1) 100%
          );

          .week-day-number {
            color: #fff;
          }

          .week-day-label {
            color: #fff;
          }
        }
      }
    }
  }
  .expand-hint {
    display: flex;
    justify-content: center;
    align-items: center;
    .hint-text {
      font-size: $font-sm;
      color: $text-secondary;
    }

    .hint-icon {
      font-size: $font-sm;
      color: $text-secondary;
    }
  }
  // 月视图样式
  .month-view {
    .collapse-hint {
      display: flex;
      flex-direction: column;
      padding: $spacing-md $spacing-lg;
      gap: $spacing-xs;
      .hint-text {
        font-size: $font-sm;
        color: $text-secondary;
      }

      .hint-icon {
        font-size: $font-sm;
        color: $text-secondary;
        text-align: center;
      }
      .hit-title {
        font-size: $font-md;
        color: $text-primary;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10rpx 0;
        .title {
          color: #333;
          font-size: $font-md;
        }
        .choice {
          color: #bf974a;
        }
      }
      .hint-item {
        display: flex;
        justify-content: space-between;
        padding: $spacing-md 0;

        border-bottom: 1px solid #e5e5e5;
        .hint-left {
          font-size: $font-sm;
          color: $text-primary;
          flex: 1;
          display: flex;
          align-items: center;
          .hint-image {
            width: 30rpx;
            height: 30rpx;
            margin-right: $spacing-sm;
          }
        }
        .hint-right {
          font-size: $font-sm;
          color: $text-primary;
          display: flex;
          align-items: center;
        }
        .price {
          color: #bf974a;
          font-size: $font-md;
        }
      }
      .hint-empty {
        padding: $spacing-lg 0;
        text-align: center;
        .empty-text {
          font-size: $font-sm;
          color: $text-secondary;
        }
      }
    }
  }
}

.budget-input-section {
  display: flex;
  margin-bottom: 20rpx;
  padding: 0 40rpx;
  flex-direction: column;
  width: 100%;
}

.input-label {
  font-size: 32rpx;
  color: #212121;
  margin-bottom: 30rpx;
}

.budget-input {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #bcbcbc;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
}
</style>
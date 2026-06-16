<template>
  <view class="user-page">
    <!-- 用户信息 -->

    <view
      class="user-header"
      :class="{
        'user-headerBg': userProfile && userProfile.gold_service_order,
      }"
    >
      <view class="user-info" @click="handleLogin">
        <image
          :src="userStore.avatar || '/static/images/user.png'"
          class="user-avatar"
        />
        <view class="user-detail">
          <view class="user-top">
            <text class="user-nickname">{{ userStore.nickname }}</text>
            <image
              src="/static/images/16.png"
              mode="aspectFill"
              class="user-icon"
              v-if="userProfile && userProfile.gold_service_order"
              @click="
                navigateTo(
                  `/pages/user/order?id=${userProfile.gold_service_order.order_id}`
                )
              "
            />
            <image
              src="/static/images/17.png"
              mode="aspectFill"
              class="user-icon"
              v-else
            />
          </view>
          <text class="user-date" v-if="userProfile && userProfile.wedding_plan"
            >婚期：{{ userProfile.wedding_plan.wedding_date || "未设置" }}</text
          >
          <!-- <text class="user-tip" v-if="!userStore.isLoggedIn">点击登录</text> -->
        </view>
      </view>
      <view class="user-intro" @click="navigateTo('/pages/user/butler')">
        <view class="user-intro-title">
          <image
            src="/static/images/18.png"
            mode="aspectFill"
            class="user-icon"
          />
          <text class="user-intro-title-text">婚礼管家服务</text>
          <view class="user-primary">咨询</view>
        </view>
        <view class="user-intro-content">
          十年婚礼经验，专属顾问一对一，让完美婚礼触手可及花小钱办大事，婚礼管家帮您省心省力更省钱
        </view>
      </view>
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
              <up-icon name="arrow-left" size="18" color="#9CB2CD"></up-icon>
            </view>
            <text class="calendar-title"
              >{{ calendarYear }}年{{ calendarMonth }}月</text
            >
            <view class="calendar-nav" @click.stop="nextMonth">
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

    <!-- 其他功能 -->
    <view class="card menu-list">
      <view class="menu-item" @click="navigateTo('/pages/user/tasting')">
        <image
          src="/static/images/11.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">婚礼品鉴官</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/coupon')">
        <image
          src="/static/images/12.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">我的优惠券</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/gift')">
        <image
          src="/static/images/13.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">我的礼品</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/collection')">
        <image
          src="/static/images/14.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">我的收藏</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/user/complaints')">
        <image
          src="/static/images/15.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">商家投诉</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view
        class="menu-item"
        @click="navigateTo('/pages/side/index')"
        v-if="userProfile && userProfile.type && userProfile.type == 'merchant'"
      >
        <image
          src="/static/images/43.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">商家入口</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
      <view
        class="menu-item"
        v-if="userProfile && userProfile.type && userProfile.type == 'staff'"
        @click="handleStaffScan"
      >
        <image
          src="/static/images/43.png"
          mode="aspectFill"
          class="menu-image"
        />
        <text class="menu-text">员工扫一扫</text>
        <up-icon name="arrow-right" size="16" color="#9CB2CD"></up-icon>
      </view>
    </view>

    <!-- 自定义 TabBar -->
    <!-- <custom-tabbar :current="3" /> -->
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useUserStore } from "@/store/modules/user";
import { getUserInfo } from "@/api/user";
import { checkLogin, navigateToLogin } from "@/utils/auth";
import { weddingPlan, getWeddingPlan } from "@/api/index";

const userStore = useUserStore();

// 定义一个值判断是否登录
const isLogin = ref<any>(checkLogin());
console.log("isLogin:", isLogin.value);
// 定义用户对象
const userProfile = ref<any>(null);

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

// 日期选择器的值 [年索引, 月索引, 日索引]
const pickerValue = ref<number[]>([0, 0, 0]);

// 日历相关变量
const calendarYear = ref<number>(new Date().getFullYear());
const calendarMonth = ref<number>(new Date().getMonth() + 1);
const calendarDays = ref<any[]>([]);

// 日历展开状态
const isCalendarExpanded = ref<boolean>(false);

// 当前周的天数（7天）
const currentWeekDays = ref<any[]>([]);

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

// 获取今天的日期
const today = new Date();
today.setHours(0, 0, 0, 0);

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

// 导航
function navigateTo(url: string) {
  uni.navigateTo({ url });
}

// 员工扫一扫 - 扫描二维码
function handleStaffScan() {
  // 检查登录状态
  if (!checkLogin()) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再使用扫一扫功能",
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

  console.log("=== 开始扫码 ===");

  // 调用微信扫码API（支持多种码类型）
  uni.scanCode({
    onlyFromCamera: true, // 只允许从相机扫码
    scanType: ["qrCode", "barCode", "wxCode"], // 支持二维码、条形码和小程序码
    autoDecodeCharset: true, // 自动识别字符集
    success: (res) => {
      console.log("=== 扫码成功 ===");
      console.log("完整返回:", JSON.stringify(res));
      console.log("scanType:", res.scanType);

      // 获取扫码结果（优先使用 path 字段，兼容小程序码）
      const scanResult = res.path || res.result || "";
      console.log("扫码结果内容:", scanResult);
      console.log("扫码结果类型:", typeof scanResult);

      if (!scanResult) {
        console.error("扫码结果为空！");
        uni.showModal({
          title: "提示",
          content: "未能获取到二维码信息，请重试",
          showCancel: false,
        });
        return;
      }

      // 显示扫码成功提示
      uni.showToast({
        title: "扫码成功",
        icon: "success",
        duration: 1500,
      });

      // 尝试解析参数（支持多种格式）
      let userId = "";
      let activityId = "";

      try {
        // 格式1: 普通URL参数 ?userId=xxx&activityId=xxx
        const hasUserIdParam =
          scanResult.includes("?userId=") || scanResult.includes("&userId=");
        const hasActivityIdParam =
          scanResult.includes("?activityId=") ||
          scanResult.includes("&activityId=");

        if (hasUserIdParam && hasActivityIdParam) {
          console.log("检测到普通URL参数格式");
          // 提取查询字符串
          let queryString = "";
          if (scanResult.includes("?")) {
            queryString = scanResult.split("?")[1];
          } else {
            queryString = scanResult;
          }

          console.log("查询字符串:", queryString);

          // 手动解析 URL 参数
          const params: any = {};
          const pairs = queryString.split("&");

          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1] || "");
            params[key] = value;
          }

          console.log("解析后的参数对象:", params);
          userId = params.userId || "";
          activityId = params.activityId || "";
        }
        // 格式2: 微信小程序 scene 参数 ?scene=xxx
        else if (
          scanResult.includes("?scene=") ||
          scanResult.includes("&scene=")
        ) {
          console.log("检测到 scene 参数格式");

          // 提取 scene 参数值
          let sceneValue = "";
          if (scanResult.includes("?scene=")) {
            sceneValue = scanResult.split("?scene=")[1].split("&")[0];
          } else {
            const parts = scanResult.split("&scene=");
            sceneValue = parts[parts.length - 1].split("&")[0];
          }

          console.log("scene 原始值:", sceneValue);

          // URL 解码 scene 参数
          const decodedScene = decodeURIComponent(sceneValue);
          console.log("scene 解码后:", decodedScene);

          // 解析 scene 中的参数 (格式: u=59&a=1)
          const sceneParams: any = {};
          const scenePairs = decodedScene.split("&");

          for (let i = 0; i < scenePairs.length; i++) {
            const pair = scenePairs[i].split("=");
            const key = pair[0].trim();
            const value = pair[1] ? pair[1].trim() : "";
            sceneParams[key] = value;
          }

          console.log("scene 参数对象:", sceneParams);

          // 映射参数：u -> userId, a -> activityId
          userId = sceneParams.u || sceneParams.userId || "";
          activityId = sceneParams.a || sceneParams.activityId || "";
        }
        // 格式3: 直接包含 u= 和 a= 参数
        else if (scanResult.includes("u=") && scanResult.includes("a=")) {
          console.log("检测到直接参数格式");

          const params: any = {};
          let queryString = scanResult;
          if (scanResult.includes("?")) {
            queryString = scanResult.split("?")[1];
          }

          const pairs = queryString.split("&");
          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            const key = decodeURIComponent(pair[0]).trim();
            const value = decodeURIComponent(pair[1] || "").trim();
            params[key] = value;
          }

          console.log("解析后的参数对象:", params);
          userId = params.u || params.userId || "";
          activityId = params.a || params.activityId || "";
        }

        console.log("=== 最终解析结果 ===");
        console.log("userId:", userId);
        console.log("activityId:", activityId);
        console.log("userId 长度:", userId.length);
        console.log("activityId 长度:", activityId.length);

        if (!userId || !activityId) {
          console.error("参数为空！");
          uni.showModal({
            title: "提示",
            content: `参数解析失败\nuserId: ${userId}\nactivityId: ${activityId}\n\n原始二维码: ${scanResult}`,
            showCancel: false,
          });
          return;
        }

        // 构造跳转 URL
        const targetUrl = `/pages/expo/sign?u=${userId}&a=${activityId}`;
        console.log("准备跳转到:", targetUrl);

        // 显示即将跳转的提示
        uni.showToast({
          title: "正在跳转...",
          icon: "loading",
          duration: 1000,
        });

        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          console.log("执行跳转...");
          uni.navigateTo({
            url: targetUrl,
            success: () => {
              console.log("跳转成功！");
            },
            fail: (err) => {
              console.error("跳转失败:", err);
              uni.showModal({
                title: "跳转失败",
                content: JSON.stringify(err),
                showCancel: false,
              });
            },
          });
        }, 1000);
      } catch (error) {
        console.error("解析参数异常:", error);
        uni.showModal({
          title: "解析错误",
          content: String(error),
          showCancel: false,
        });
      }
    },
    fail: (err) => {
      console.error("=== 扫码失败 ===");
      console.error("错误信息:", err);
      console.error("错误消息:", err.errMsg);

      // 用户取消扫码不提示错误
      if (err.errMsg && err.errMsg.includes("cancel")) {
        console.log("用户取消扫码");
        return;
      }

      // 其他错误，显示详细信息
      uni.showModal({
        title: "扫码失败",
        content: `错误信息: ${
          err.errMsg || "未知错误"
        }\n\n可能原因:\n1. 相机权限未授权\n2. 光线太暗\n3. 二维码模糊或损坏`,
        showCancel: false,
        confirmText: "知道了",
      });
    },
  });
}

// 登录
async function handleLogin() {
  if (userStore.isLoggedIn) return;
  uni.navigateTo({ url: "/pages/login/login" });
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
      content: "请先登录后再填写预算",
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
    if (response && response.planning_phases) {
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

// 登出
function handleLogout() {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗?",
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.showToast({ title: "已退出登录", icon: "success" });
      }
    },
  });
}

// 获取用户信息
async function loadUserInfo() {
  // 检查是否有 token
  if (!checkLogin()) {
    return;
  }

  try {
    const userInfo: any = await getUserInfo();
    // 更新 store 中的用户信息
    userStore.updateUserInfo(userInfo);
    console.log("用户信息:", userInfo);
    // 更新用户信息对象
    userProfile.value = userInfo;

    // 如果已有婚期规划数据，初始化日历
    if (userInfo.wedding_plan) {
      weddingDate.value = userInfo.wedding_plan.wedding_date;

      if (userInfo.wedding_plan.table_count) {
        tableCount.value = String(userInfo.wedding_plan.table_count);
      }
      if (userInfo.wedding_plan.total_budget) {
        const budgetInWan = (
          Number(userInfo.wedding_plan.total_budget) / 10000
        ).toFixed(0);
        totalBudget.value = budgetInWan;
        selectedBudget.value = `${tableCount.value}桌，${budgetInWan}`;
      }

      // 获取婚礼计划数据（包括 planningPhases）
      await loadWeddingPlanData();

      // 初始化日历
      if (weddingDate.value && selectedBudget.value) {
        initCalendar();
      }
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
}

// 加载婚礼计划数据
async function loadWeddingPlanData() {
  try {
    const response = await getWeddingPlan();

    // 处理返回的规划数据
    if (response && response.planning_phases) {
      planningPhases.value = response.planning_phases;
      console.log("婚礼计划数据:", planningPhases.value);
    }
  } catch (error) {
    console.error("获取婚礼计划数据失败:", error);
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  if (checkLogin()) {
    loadUserInfo();
  }
});

// 页面显示时重新加载数据（tabbar 切换时触发）
onShow(() => {
  if (checkLogin()) {
    loadUserInfo();
  }
});
</script>

<style lang="scss" scoped>
.user-page {
  padding-bottom: 120rpx;
  /* 日期选择器和预算选择器样式 */
  .date-budget {
    background-color: #fff;
    border-radius: 16px;
    margin: 24rpx;

    .data-selector {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 32rpx;
      border-radius: 16px;
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 1),
          rgba(255, 255, 255, 1)
        ),
        linear-gradient(136.78deg, #f1daa6 0%, #f9eccc 33.03%, #e9cc90 100%);

      .date-selector,
      .budget-selector {
        display: flex;
        flex-direction: column;
        text-align: center;

        .budget-title {
          font-size: 24rpx;
          color: #808080;
          margin-bottom: 8rpx;
        }

        .budget-data {
          font-size: 32rpx;
          font-weight: bold;
          color: #bf974a;
          margin-bottom: 8rpx;
        }

        .budget-text {
          font-size: 28rpx;
          color: #808080;
        }
      }

      .line {
        width: 1px;
        height: 80rpx;
        background: linear-gradient(
          180deg,
          rgba(234, 196, 123, 1) 0%,
          rgba(241, 218, 166, 1) 100%
        );
        margin: 0 32rpx;
      }
    }
  }

  /* 日期选择器弹窗样式 */
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
    border-radius: 32rpx 32rpx 0 0;
    overflow: hidden;
  }

  .date-picker-header,
  .budget-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1px solid #f0f0f0;
    position: relative;

    .date-picker-title,
    .budget-picker-title {
      font-size: 32rpx;
      color: #000;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .date-picker-close,
    .budget-picker-close {
      font-size: 48rpx;
      color: #999;
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
    font-size: 32rpx;
    color: #333;
  }

  .budget-picker-content {
    max-height: 600rpx;
    overflow-y: auto;
    padding: 32rpx 0;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
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

  .date-picker-footer,
  .budget-picker-footer {
    display: flex;
    padding: 32rpx 48rpx;

    .date-picker-btn,
    .budget-picker-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 32rpx;
      font-size: 32rpx;
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

  /* 日历组件样式 */
  .calendar-container {
    width: 100%;
    padding: 32rpx 0;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32rpx 32rpx;

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
      font-size: 36rpx;
      font-weight: bold;
      color: rgba(128, 128, 128, 1);
    }
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 16rpx 0;
    border-bottom: 1px solid #f0f0f0;

    .weekday {
      text-align: center;
      font-size: 28rpx;
      color: #999;
      padding: 16rpx 0;
    }
  }

  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8rpx;
    padding: 0 32rpx;

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8rpx;
      position: relative;

      .day-number {
        font-size: 32rpx;
        color: #333;
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

  /* 周视图样式 */
  .week-view {
    padding: 32rpx;

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
        border-radius: 8rpx;
        padding: 8rpx;

        .week-day-weekday {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 4rpx;
        }

        .week-day-number {
          font-size: 36rpx;
          color: #333;
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
      font-size: 28rpx;
      color: #999;
    }

    .hint-icon {
      font-size: 28rpx;
      color: #999;
    }
  }

  /* 月视图样式 */
  .month-view {
    .collapse-hint {
      display: flex;
      flex-direction: column;
      padding: 32rpx 48rpx;
      gap: 8rpx;

      .hint-text {
        font-size: 28rpx;
        color: #999;
      }

      .hint-icon {
        font-size: 28rpx;
        color: #999;
        text-align: center;
      }

      .hint-item {
        display: flex;
        justify-content: space-between;
        padding: 32rpx 0;
        border-bottom: 1px solid #e5e5e5;

        .hint-left {
          font-size: 28rpx;
          color: #333;
          flex: 1;
          display: flex;
          align-items: center;

          .hint-image {
            width: 30rpx;
            height: 30rpx;
            margin-right: 16rpx;
          }
        }

        .hint-right {
          font-size: 28rpx;
          color: #333;
          display: flex;
          align-items: center;
        }

        .price {
          color: #bf974a;
          font-size: 32rpx;
        }
      }

      .hint-empty {
        padding: 48rpx 0;
        text-align: center;

        .empty-text {
          font-size: 28rpx;
          color: #999;
        }
      }
    }
  }

  .user-header {
    //引入背景图片
    background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/10/6a28ebbe51768.png");
    background-size: cover;
    background-position: center;
    padding: $spacing-md;
    padding-bottom: 0;
    .user-info {
      display: flex;
      align-items: center;
      padding-top: 140rpx;
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: $radius-round;
        margin-right: $spacing-md;
      }

      .user-detail {
        flex: 1;
        .user-nickname {
          display: block;
          font-size: $font-lg;
          font-weight: bold;
          color: #000;
          margin-bottom: $spacing-xs;
        }
        .user-top {
          display: flex;
          align-items: center;
        }
        .user-icon {
          width: 40rpx;
          height: 40rpx;
          margin-left: $spacing-sm;
        }
        .user-date {
          font-size: $font-md;
          color: #808080;
        }

        .user-tip {
          font-size: $font-sm;
          color: $text-secondary;
        }
      }
    }
    .user-intro {
      margin-top: $spacing-md;
      background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/10/6a28ec100de21.png");
      background-size: cover;
      background-position: center;
      border-radius: 20rpx;
      padding: 48rpx 32rpx;
      .user-intro-title {
        display: flex;
        align-items: center;
        margin-bottom: $spacing-md;
        .user-icon {
          width: 40rpx;
          height: 40rpx;
          margin-right: $spacing-sm;
        }
        .user-intro-title-text {
          font-size: $font-md;
          color: #e9cc90;
          margin-right: $spacing-sm;
        }
        .user-primary {
          border-radius: 40rpx;
          background: linear-gradient(180deg, #eac47b 0%, #f1daa6 100%);
          color: #612500;
          font-size: $font-sm;
          padding: 6rpx 24rpx;
        }
      }
      .user-intro-content {
        font-size: $font-sm;
        color: #fff;
        line-height: 1.5;
        /* 多行文本省略 */
      }
    }
  }
  .user-headerBg {
    background-image: url("https://1love-1432414161.cos.ap-chengdu.myqcloud.com/products/2026/06/11/6a2992f936363.png");
    background-size: cover;
    background-position: center;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 40rpx;
      margin-right: $spacing-md;
    }
    .menu-image {
      width: 40rpx;
      height: 40rpx;
      margin-right: $spacing-md;
    }

    .menu-text {
      flex: 1;
      font-size: $font-md;
      color: $text-primary;
    }

    .menu-arrow {
      font-size: 40rpx;
      color: $text-secondary;
    }
  }
}
.card {
  padding: 0;
  margin: 0 24rpx;
}
</style>
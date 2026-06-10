<template>
  <view class="page-container">
    <!-- Logo 和品牌展示 -->
    <view class="login-header">
      <image
        src="/static/images/logo.png"
        class="logo-image"
        mode="aspectFit"
      />
      <text class="title">欢迎加入婚礼管家</text>
      <text class="subtitle">加入后享专属活动&会员好礼</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form card">
      <!-- 微信手机号授权登录按钮 -->
      <button
        class="btn-wx-login"
        open-type="getPhoneNumber"
        @getphonenumber="handleGetPhoneNumber"
        :disabled="isLoading || !agreedToTerms"
      >
        <text v-if="!isLoading">一键获取手机号登录</text>
        <text v-else>登录中...</text>
      </button>

      <!-- 分隔线 -->
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他方式</text>
        <view class="divider-line"></view>
      </view>

      <!-- 用户协议 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox
              :checked="agreedToTerms"
              color="#E8380D"
              style="transform: scale(0.8)"
            />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @click.stop="showAgreement('user')"
                >《用户协议》</text
              >
              和
              <text class="link" @click.stop="showAgreement('privacy')"
                >《隐私政策》</text
              >
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="login-footer">
      <text class="footer-text">登录即代表您同意我们的服务条款</text>
    </view>

    <!-- 用户协议弹窗 -->
    <u-modal
      v-model="showAgreementModal"
      :title="agreementTitle"
      :content="agreementContent"
      :show-cancel-button="false"
      confirm-color="#E8380D"
      @confirm="showAgreementModal = false"
    ></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { loginWithPhone } from "@/api/user";

const userStore = useUserStore();

// 加载状态
const isLoading = ref(false);

// 是否同意协议
const agreedToTerms = ref(false);

// 协议弹窗
const showAgreementModal = ref(false);
const agreementTitle = ref("");
const agreementContent = ref("");

/**
 * 处理获取手机号
 */
async function handleGetPhoneNumber(e: any) {
  console.log("获取手机号回调:", e);

  // 验证是否同意协议
  if (!agreedToTerms.value) {
    uni.showToast({
      title: "请先同意用户协议",
      icon: "none",
    });
    return;
  }

  // 用户拒绝授权
  if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
    uni.showToast({
      title: "您取消了授权",
      icon: "none",
    });
    return;
  }

  // 获取失败
  if (e.detail.errMsg !== "getPhoneNumber:ok") {
    uni.showToast({
      title: "获取手机号失败",
      icon: "none",
    });
    return;
  }

  try {
    isLoading.value = true;

    // 获取 code（用于换取手机号）
    const { code } = e.detail;

    if (!code) {
      throw new Error("获取授权码失败");
    }

    // 先进行微信登录获取 token
    await performWxLogin();

    // 使用手机号授权码绑定手机号
    await bindPhoneNumber(code);

    uni.showToast({
      title: "登录成功",
      icon: "success",
      duration: 1500,
    });

    // 延迟跳转,让用户看到成功提示
    setTimeout(() => {
      // 登录成功后返回上一页或首页
      const pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({ url: "/pages/index/index" });
      }
    }, 1500);
  } catch (error: any) {
    console.error("登录失败:", error);

    // 错误处理
    let errorMessage = "登录失败,请稍后重试";

    if (error.message) {
      errorMessage = error.message;
    } else if (error.errMsg) {
      if (error.errMsg.includes("deny")) {
        errorMessage = "您取消了授权";
      } else if (error.errMsg.includes("fail")) {
        errorMessage = "网络请求失败,请检查网络";
      }
    }

    uni.showToast({
      title: errorMessage,
      icon: "none",
      duration: 2000,
    });
  } finally {
    isLoading.value = false;
  }
}

/**
 * 执行微信登录获取 token
 */
async function performWxLogin() {
  return new Promise<void>((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: async (loginRes) => {
        if (loginRes.code) {
          try {
            await userStore.login(loginRes.code);
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error("微信登录失败"));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * 绑定手机号
 */
async function bindPhoneNumber(phoneCode: string) {
  try {
    await loginWithPhone(phoneCode);
    // 绑定成功后同步用户信息
    await userStore.syncUserInfo();
  } catch (error) {
    console.error("绑定手机号失败:", error);
    throw new Error("绑定手机号失败");
  }
}

/**
 * 处理协议勾选
 */
function handleAgreementChange(e: any) {
  agreedToTerms.value = e.detail.value.length > 0;
}

/**
 * 显示用户协议或隐私政策
 */
function showAgreement(type: "user" | "privacy") {
  if (type === "user") {
    agreementTitle.value = "用户协议";
    agreementContent.value =
      "这里是用户协议的详细内容。在实际项目中,这里应该展示完整的用户协议内容,包括服务条款、使用规则等。";
  } else {
    agreementTitle.value = "隐私政策";
    agreementContent.value =
      "这里是隐私政策的详细内容。在实际项目中,这里应该展示完整的隐私政策,包括数据收集、使用、保护等说明。";
  }
  showAgreementModal.value = true;
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffeec7 0%, #f8f8f8 100%);
  padding: 0;
}

// 头部区域
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx $spacing-lg 80rpx;

  .logo-image {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: $spacing-lg;
  }

  .title {
    font-size: 52rpx;
    font-weight: bold;
    color: #612500;
    margin-bottom: $spacing-sm;
    letter-spacing: 2rpx;
  }

  .subtitle {
    font-size: $font-md;
    color: $text-secondary;
    letter-spacing: 1rpx;
  }
}

// 表单区域
.login-form {
  margin: 0 $spacing-lg $spacing-lg;
  padding: $spacing-xl;

  .btn-wx-login {
    width: 100%;
    height: 88rpx;

    background: linear-gradient(
      136.45deg,
      #f1daa6 0%,
      #f9eccc 33.03%,
      #e9cc90 100%
    );
    color: #612500;
    border-radius: 40rpx;
    font-size: $font-lg;
    font-weight: 500;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }

    &[disabled] {
      opacity: 0.6;
    }
  }

  // 分隔线
  .divider {
    display: flex;
    align-items: center;
    margin: $spacing-xl 0;

    .divider-line {
      flex: 1;
      height: 1rpx;
      background-color: $border-color;
    }

    .divider-text {
      padding: 0 $spacing-md;
      font-size: $font-sm;
      color: $text-secondary;
    }
  }

  // 用户协议
  .agreement {
    .agreement-label {
      display: flex;
      align-items: flex-start;

      .agreement-text {
        flex: 1;
        font-size: $font-xs;
        color: $text-secondary;
        line-height: 1.6;
        margin-left: $spacing-xs;

        .link {
          color: #ab7e2b;
          text-decoration: underline;
        }
      }
    }
  }
}

// 底部提示
.login-footer {
  padding: $spacing-lg;
  text-align: center;

  .footer-text {
    font-size: $font-xs;
    color: $text-secondary;
  }
}
</style>

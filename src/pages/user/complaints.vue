<template>
  <view class="complaints-page">
    <view class="card">
      <view class="field">
        <text class="label">选择商户</text>
        <picker
          mode="selector"
          :range="merchantList"
          range-key="name"
          :value="selectedMerchantIndex"
          @change="onMerchantChange"
        >
          <view class="picker-display">
            <text class="picker-text" v-if="selectedMerchant">
              {{ selectedMerchant.name }}
            </text>
            <text class="picker-placeholder" v-else> 请选择商户（可选） </text>
            <up-icon name="arrow-right" size="14" color="#999"></up-icon>
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">问题描述</text>
        <textarea
          class="textarea"
          placeholder="请简要描述您遇到的问题，越详细越有助于我们处理。"
          :maxlength="1000"
          v-model="description"
        ></textarea>
      </view>

      <view class="field">
        <text class="label">图片上传（最多5张）</text>
        <view class="images">
          <view
            v-for="(img, idx) in images"
            :key="img + idx"
            class="image-wrapper"
          >
            <image
              :src="img"
              class="thumb"
              @click="previewImage(idx)"
            ></image>
            <view class="delete-btn" @click.stop="deleteImage(idx)">
              <up-icon name="close-circle-fill" size="20" color="#ff4444"></up-icon>
            </view>
          </view>

          <view v-if="images.length < 5" class="thumb add" @click="chooseImage">
            <text class="plus">+</text>
          </view>
        </view>
      </view>
    </view>
    <view class="card">
      <view class="field">
        <text class="label">联系方式</text>
        <input
          class="input"
          placeholder="手机号(必填，以便我们的工作人员联系您)"
          v-model="contact"
        />
      </view>
    </view>
    <view class="actions">
      <button class="btn-submit" @click="submit">提交反馈</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uploadImage, complaint, merchantsAll } from "@/api/user";

const description = ref("");
const images = ref([]);
const contact = ref("");
const merchantList = ref([]);
const selectedMerchant = ref(null);
const selectedMerchantIndex = ref(-1);
const uploading = ref(false);

const chooseImage = () => {
  if (uploading.value) {
    uni.showToast({ title: "图片上传中，请稍候", icon: "none" });
    return;
  }

  const remain = 5 - images.value.length;
  uni.chooseImage({
    count: remain,
    sizeType: ["compressed", "original"],
    sourceType: ["album", "camera"],
    success: async (res) => {
      uploading.value = true;
      uni.showLoading({ title: "上传中...", mask: true });

      try {
        // 逐个上传图片
        for (const file of res.tempFiles) {
          const uploadRes = await uploadImage(file.path);
          // TODO: 根据实际返回数据结构调整，获取图片URL
          images.value.push(uploadRes.data?.url || uploadRes.url);
        }
        
        uni.hideLoading();
        uni.showToast({ title: "上传成功", icon: "success" });
      } catch (err) {
        uni.hideLoading();
        console.error("图片上传失败:", err);
        uni.showToast({ title: "图片上传失败", icon: "none" });
      } finally {
        uploading.value = false;
      }
    },
    fail: () => {
      uni.showToast({ title: "选择图片失败", icon: "none" });
    },
  });
};

const previewImage = (index) => {
  if (!images.value.length) return;
  uni.previewImage({
    urls: images.value,
    current: images.value[index],
  });
};

// 删除图片
const deleteImage = (index) => {
  uni.showModal({
    title: "提示",
    content: "确定要删除这张图片吗？",
    success: (res) => {
      if (res.confirm) {
        images.value.splice(index, 1);
        uni.showToast({ title: "已删除", icon: "success" });
      }
    },
  });
};

const submit = async () => {
  if (!description.value.trim()) {
    uni.showToast({ title: "请填写问题描述", icon: "none" });
    return;
  }

  uni.showLoading({ title: "提交中" });

  try {
    // 提交投诉信息
    const payload = {
      merchant_id: selectedMerchant.value?.id || null,
      content: description.value,
      images: images.value,
      phone: contact.value,
    };

    await complaint(payload);

    uni.hideLoading();
    uni.showToast({ title: "提交成功，我们会尽快处理", icon: "success" });

    // 提交后清空表单
    description.value = "";
    images.value = [];
    contact.value = "";
    selectedMerchantIndex.value = -1;
    selectedMerchant.value = null;
  } catch (err) {
    uni.hideLoading();
    console.error("提交投诉失败", err);
    uni.showToast({ title: "提交失败，请重试", icon: "none" });
  }
};

const onMerchantChange = (e) => {
  const index = e.detail.value;
  selectedMerchantIndex.value = index;
  selectedMerchant.value = merchantList.value[index] || null;
};

onMounted(async () => {
  try {
    const res = await merchantsAll();
    if (res) {
      merchantList.value = res;
    } else {
      merchantList.value = [];
    }
  } catch (err) {
    console.error("获取商户列表失败:", err);
    uni.showToast({ title: "获取商户列表失败", icon: "none" });
    merchantList.value = [];
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.complaints-page {
  padding: 24rpx;
  background: #f5f5f5;
  min-height: 100vh;

  .card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 30rpx;
  }

  .field {
    margin-bottom: 30rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: #333333;
      margin-bottom: 16rpx;
    }

    .textarea {
      min-height: 240rpx;
      padding: 20rpx;
      font-size: 26rpx;
      border: 1rpx solid #eeeeee;
      border-radius: 8rpx;
      background: #fff;
      resize: none;
    }

    .input {
      height: 72rpx;
      padding: 0 20rpx;
      font-size: 26rpx;
      border: 1rpx solid #eeeeee;
      border-radius: 8rpx;
      line-height: 72rpx;
    }

    .picker-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72rpx;
      padding: 0 20rpx;
      font-size: 26rpx;
      border: 1rpx solid #eeeeee;
      border-radius: 8rpx;
      background: #fff;

      .picker-text {
        color: #333333;
      }

      .picker-placeholder {
        color: #999999;
      }
    }

    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .image-wrapper {
        position: relative;
      }

      .thumb {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
        object-fit: cover;
      }

      .delete-btn {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
      }

      .add {
        width: 160rpx;
        height: 160rpx;
        border-radius: 8rpx;
        background: #fafafa;
        border: 1rpx dashed #e6e6e6;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .plus {
        font-size: 48rpx;
        color: #999999;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 32rpx 0;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    .btn-submit {
      width: 680rpx;
      height: 84rpx;
      line-height: 84rpx;
      background: linear-gradient(
        136.06deg,
        #f1daa6 0%,
        #f9eccc 33.03%,
        #e9cc90 100%
      );
      color: #612500;
      border: none;
      border-radius: 42rpx;
      font-size: 30rpx;
    }
  }
}
</style>
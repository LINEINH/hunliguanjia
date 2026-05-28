<template>
  <view class="expodetail-container">
    <view class="banner">
      <image
        src="/static/images/post.png"
        mode="aspectFill"
        class="banner-image"
      />
    </view>
    <view class="step">
      <view class="steptitle">
        <image
          src="/static/images/left.png"
          mode="aspectFill"
          class="titleimage" />
        01.活动流程
        <image
          src="/static/images/right.png"
          mode="aspectFill"
          class="titleimage"
      /></view>
      <view class="stepcon">
        <text class="wrap">
          西安婚博会汇聚婚宴、婚纱摄影、婚礼策划、礼服、四大金刚、珠宝喜糖、婚车蜜月等全品类婚嫁品牌，专属特惠正品保障、比价省心，现场有婚纱走秀、潮流发布、抽奖咨询，一站搞定备婚，省时省心省钱。
        </text>
        <text class="wrap">
          <text class="left">1.入场签到：</text
          >主舞台婚纱礼服走秀、婚礼场景潮流发布、婚嫁行业分享
        </text>
        <text class="wrap">
          <text class="left">2.自由逛展：</text
          >逛展咨询比价，现场下单享专属展会折扣
        </text>
        <text class="wrap">
          <text class="left">3.开幕仪式：</text
          >主办方致辞、品牌代表亮相，开启婚博会正式活动
        </text>
        <text class="wrap">
          <text class="left">4.主题秀场：</text
          >主舞台婚纱礼服走秀、婚礼场景潮流发布、婚嫁行业分享
        </text>
        <text class="wrap">
          <text class="left">5.互动福利：</text
          >备婚问答趣味互动，整点抽家电蜜月婚嫁好礼
        </text>
        <text class="wrap">
          <text class="left">6.咨询服务：</text
          >专业备婚顾问一对一答疑，定制婚礼筹备方案
        </text>
        <text class="wrap">
          <text class="left">7.离场兑礼：</text
          >逛展集章完成任务，兑换终极大奖及离场伴手礼
        </text>
      </view>
      <view class="button"> 立即报名 </view>
    </view>
    <view class="step">
      <view class="steptitle">
        <image
          src="/static/images/left.png"
          mode="aspectFill"
          class="titleimage" />
        02.展会地址
        <image
          src="/static/images/right.png"
          mode="aspectFill"
          class="titleimage"
      /></view>
      <view class="map">
        <view class="stepcon">
          <view class="wrap">
            <up-icon name="map" size="14" color="#383838"> </up-icon>
            <text class="left">西安香格里拉大酒店：</text>西安市雁塔区科技路 38
            号乙
          </view>
          <view class="map">
            <image src="/static/images/map.png" mode="aspectFill" class="map" />
          </view>
        </view>
      </view>
    </view>
    <view class="step">
      <view class="code">参会二维码</view>
      <image
        src="/static/images/post.png"
        mode="aspectFill"
        class="codeimage"
      />
      <view class="intro">*展会入场凭证，入场时向工作人员出示即可。</view>
    </view>
    <view class="ad">
      <image
        src="/static/images/post1.png"
        mode="aspectFill"
        class="ad-image"
        @click="navigateToDetail"
      />
    </view>
    <view class="ad">
      <image
        src="/static/images/post2.png"
        mode="aspectFill"
        class="ad-image"
        @click="navigateToDetail"
      />
    </view>
  </view>
</template>
<script setup lang="ts">
// 导航到商家列表
function navigateToDetail() {
  uni.navigateTo({ url: "/pages/expo/expodetail" });
}
</script>
<style lang="scss" scoped>
.expodetail-container {
  background: #f0f0f0;
  padding: $spacing-md;
  padding-top: 0;
  .banner {
    height: 400rpx;
    margin-bottom: $spacing-md;
    .banner-image {
      width: 100%;
      height: 400rpx;
      border-radius: 0 0 $radius-md $radius-md;
    }
  }
  .step {
    margin-bottom: $spacing-md;
    background: #fff;
    padding: $spacing-md;
    border-radius: $radius-md;
    .button {
      border-radius: 40rpx;
      background: linear-gradient(
        161.33deg,
        #f1daa6 0%,
        #f9eccc 44.04%,
        #e9cc90 100%
      );
      height: 80rpx;
      text-align: center;
      font-size: 32rpx;
      color: #805608;
      line-height: 80rpx;
      font-weight: bold;
    }
    .steptitle {
      color: #bf974a;
      font-size: 40rpx;
      font-weight: bold;
      text-align: center;
      margin: 16rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .titleimage {
        width: 16rpx;
        height: 30rpx;
        margin: 0 10rpx;
      }
    }
    .code {
      font-size: 32rpx;
      color: #000000;
      text-align: center;
      font-weight: bold;
    }
    .codeimage {
      width: 400rpx;
      height: 400rpx;
      margin: 32rpx auto;
      display: block;
    }
    .intro {
      font-size: 24rpx;
      color: #727272;
      text-align: center;
    }
    .stepcon {
      display: flex;
      flex-direction: column;
      .wrap {
        font-size: 28rpx;
        color: #727272;
        margin-bottom: 20rpx;
        line-height: 1.5;
        display: flex;
        align-items: center;
        .left {
          color: #383838;
        }
      }
      .map {
        width: 90%;
        margin: 32rpx;
        height: 200rpx;
      }
    }
  }

  .ad {
    height: 300rpx;
    margin-bottom: $spacing-md;
    .ad-image {
      width: 100%;
      height: 300rpx;
      border-radius: $radius-md;
    }
  }
}
</style>

<template>
  <view class="page">
    <view class="header">
      <text class="title">壹嫁婚庆平台用户协议和法律协议</text>
      <text class="subtitle"
        >本协议为您与本平台管理者之间所订立的契约，具有合同的法律效力，请您仔细阅读。</text
      >
    </view>

    <scroll-view class="content" scroll-y="true">
      <view class="section">
        <text class="section-title">一、 本协议内容、生效、变更</text>
        <text class="section-desc"
          >本协议内容包括协议正文及所有本平台已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。如您对协议有任何疑问，应向本平台咨询。您在同意所有协议条款并完成注册程序，才能成为本站的正式用户，您点击“我以阅读并同意本平台用户协议和法律协议”按钮后，本协议即生效，对双方产生约束力。
          只要您使用本平台平台服务，则本协议即对您产生约束，届时您不应以未阅读本协议的内容或者未获得本平台对您问询的解答等理由，主张本协议无效，或要求撤销本协议。您确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。
          您承诺接受并遵守本协议的约定。如果您不同意本协议的约定，您应立即停止注册程序或停止使用本平台平台服务。本平台有权根据需要不定期地制订、修改本协议及/或各类规则，并在本平台平台公示，不再另行单独通知用户。变更后的协议和规则一经在网站公布，立即生效。如您不同意相关变更，应当立即停止使用本平台平台服务。您继续使用本平台平台服务的，即表明您接受修订后的协议和规则。</text
        >
      </view>
      <view class="section">
        <text class="section-title">二、 注册</text>
        <text class="section-desc"
          >注册资格用户须具有法定的相应权利能力和行为能力的自然人、法人或其他组织，能够独立承担法律责任。您完成注册程序或其他本平台平台同意的方式实际使用本平台服务时，即视为您确认自己具备主体资格，能够独立承担法律责任。若因您不具备主体资格，而导致的一切后果，由您及您的监护人自行承担。</text
        >
        <text class="section-subtitle">注册资料</text>
        <text class="section-desc">
          2.1用户应自行诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且本平台保留终止用户使用本平台各项服务的权利。
        </text>
        <text class="section-desc"
          >2.2用户在本站进行浏览等活动时，涉及用户真实姓名/名称、通信地址、联系电话、电子邮箱等隐私信息的，本站将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。</text
        >
      </view>
      <view class="section">
        <text class="section-title">三、 账户</text>
        <text class="section-desc"
          >3.1您注册成功后，即成为本平台平台的会员，将持有本平台平台唯一编号的账户信息，您可以根据本站规定改变您的密码。</text
        >
        <text class="section-desc"
          >3.2您设置的姓名为真实姓名，不得侵犯或涉嫌侵犯他人合法权益。否则，本平台有权终止向您提供服务，注销您的账户。账户注销后，相应的会员名将开放给任意用户注册登记使用。</text
        >
        <text class="section-desc"
          >3.3您应谨慎合理的保存、使用您的会员名和密码，应对通过您的会员名和密码实施的行为负责。除非有法律规定或司法裁定，且征得本平台的同意，否则，会员名和密码不得以任何方式转让、赠与或继承（与账户相关的财产权益除外）。</text
        >
        <text class="section-desc"
          >3.4用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。</text
        >
        <text class="section-desc"
          >3.5如果发现任何非法使用等可能危及您的账户安全的情形时，您应当立即以有效方式通知本平台要求暂停相关服务，并向公安机关报案。您理解本平台对您的请求采取行动需要合理时间，本平台对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。</text
        >
      </view>
      <view class="section">
        <text class="section-title">四、 用户信息的合理使用</text>
        <text class="section-desc"
          >您可以通过应用内设置查看、修改或删除个人信息，并随时管理隐私权限。</text
        >
      </view>
      <view class="section">
        <text class="section-title">五、 免责条款</text>
        <text class="section-desc"
          >5.1
          本平台仅提供信息对接，发生一切纠纷问题皆与本平台无关，请通过仲裁部门维护各自权益。</text
        >
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  methods: {
    onAgree() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped>
.page {
  position: relative;
  padding: 32rpx 24rpx 180rpx;
  background: #f5f6fa;
  min-height: 100vh;
}
.header {
  padding-bottom: 24rpx;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}
.subtitle {
  margin-top: 12rpx;
  font-size: 28rpx;
  color: #666;
}
.content {
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.04);
  width: 100%;
}
.section {
  padding: 20rpx;
  line-height: 50rpx;
  display: flex;
  flex-direction: column;
}
.section:last-child {
  border-bottom: none;
}
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #222;
  margin-bottom: 14rpx;
}
.section-desc {
  font-size: 26rpx;
  line-height: 42rpx;
  color: #4a4a4a;
  white-space: normal;
}
.floating-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -12rpx 24rpx rgba(0, 0, 0, 0.08);
}
.agree-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #007aff;
  color: #ffffff;
  font-size: 30rpx;
}
</style>

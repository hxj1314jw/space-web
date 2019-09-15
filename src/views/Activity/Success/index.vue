<template>
  <div>
    <van-grid :border="false" :column-num="1">
      <van-grid-item>
        <template slot="icon">
          <van-icon name="checked" size="67px" color="#00B261" style="margin-top: 20px;"/>
        </template>
        <template slot="text">
          <div style="text-align: center; margin-top: 20px; line-height: 1.5em;">
            <span style="color: #333333; font-size: large">报名成功</span><br>
            <span style="color: #969799; font-size: small;">
              您已成功报名活动，进入<a href="/#/mine/ticket">我的票卷</a>查看票卷信息<br>
              请安排行程准时参加活动
            </span>

            <div style="margin: 20px 0;">
              <van-button @click="toHome()" type="primary" size="small" style="margin: 0 5px; width: 80px">返回首页</van-button>
              <van-button @click="toMineTicket()" plain type="primary" size="small" style="margin: 0 5px; width: 80px">我的票卷</van-button>
            </div>
          </div>
        </template>
      </van-grid-item>
    </van-grid>

    <div style="padding: 20px 16px;">
      <span style="font-size: x-small; color: #969799;">
        温馨提示 :<br>
        1. 请不要将电子票随意分享给他人，以免被盗用<br>
        2. 入场前请提前打开电子票，具体签到方式请听从主办方指示
      </span>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Grid, GridItem, Icon, Button } from 'vant';
Vue.use(Grid).use(GridItem).use(Icon).use(Button);

@Component({
  components: {}
})
export default class JoinSuccessfully extends Vue {
  private toHome() {
    this.$router.push('/');
  }

  private toMineTicket() {
    this.$router.push('/mine/ticket');
  }
}
</script>
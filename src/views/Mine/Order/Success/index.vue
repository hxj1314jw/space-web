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
              您已成功支付订单，进入<a href="/mine/order">我的订单</a>查看其他信息
            </span>

            <div style="margin: 20px 0;">
              <van-button @click="toHome()" type="primary" size="small" style="margin: 0 5px; width: 80px">返回首页</van-button>
              <van-button @click="toMineOrder()" plain type="primary" size="small" style="margin: 0 5px; width: 80px">我的订单</van-button>
              <van-button @click="toActivityEdit()" v-if="$route.query.orderType == '2'" plain type="primary" size="small" style="margin: 0 5px; width: 80px">发布活动</van-button>
            </div>
          </div>
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Grid, GridItem, Icon, Button } from 'vant';
Vue.use(Grid).use(GridItem).use(Icon).use(Button);

@Component({
  components: {}
})
export default class OrderPaidSuccessfully extends Vue {

  private toHome() {
    this.$router.push('/');
  }

  private toMineOrder() {
    this.$router.push('/mine/order');
  }

  private toActivityEdit() {
    this.$router.push('/mine/activity/edit');
  }
}
</script>

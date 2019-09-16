<template>
  <div>
    <van-grid :border="false" :column-num="1">
      <van-grid-item>
        <template slot="icon">
          <van-icon name="checked" size="67px" color="#00B261" style="margin-top: 20px;"/>
        </template>
        <template slot="text">
          <div style="text-align: center; margin-top: 20px; line-height: 1.5em;">
            <span style="color: #333333; font-size: large">预约成功</span><br>
            <span style="color: #969799; font-size: small;">
              您已成功预约，进入<a href="/mine/reserve">我的预约</a>查看参访信息<br>
              请安排行程准时进行参访
            </span>

            <div style="margin: 20px 0;">
              <van-button @click="toHome()" type="primary" size="small" style="margin: 0 5px; width: 80px">返回首页</van-button>
              <van-button @click="toMineTicket()" plain type="primary" size="small" style="margin: 0 5px; width: 80px">我的预约</van-button>
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
export default class ReserveSuccessfully extends Vue {
  private toHome() {
    this.$router.push('/');
  }

  private toMineTicket() {
    this.$router.push('/mine/reserve');
  }
}
</script>
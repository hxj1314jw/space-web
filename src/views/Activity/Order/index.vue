<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-top: -10px;">
      <TicketCard :ticketForm="orderForm"/>

      <!-- <van-steps :active="2" style="margin-top: 10px;">
        <van-step>选择票种</van-step>
        <van-step>填写表单</van-step>
        <van-step>确认支付</van-step>
        <van-step>交易完成</van-step>
      </van-steps> -->

      <van-cell-group style="margin-top: 10px">
        <van-cell title="费用合计" :value="'￥' + orderForm.ticketPrice" />
        <van-cell title="实付金额">
          <span style="color: #F76C6C">￥{{ orderForm.amount }}</span>
        </van-cell>
        <van-cell title="支付方式" value="微信支付" />
      </van-cell-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button :loading="loading" loading-text="支付中..." @click="confirmPay()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">确认支付</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TicketCard from '@/components/TicketCard.vue';
import { getActivityOrder, getActivityDetail } from '@/api/activity';
import { CellGroup, Button, Toast, Cell, Step, Steps } from 'vant';
Vue.use(Cell).use(CellGroup).use(Button).use(Toast).use(Step).use(Steps);

@Component({
  components: {
    TicketCard
  }
})

export default class ActivityOrder extends Vue {
  public activityForm: any = {};
  public orderForm: any = {};
  public loading: boolean = false;
  public orderId: string = '';

  public created() {
    this.orderId = this.$route.params.orderId;
    this.fetchOrder();
  }

  private async fetchOrder() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getActivityOrder({
      orderId: this.orderId
    });
    this.orderForm = res.data.data;
    Toast.clear();
  }

  private confirmPay() {
    const zoneId: any = this.$route.query.zoneId;
    this.loading = true;
    const callback = encodeURIComponent(process.env.VUE_APP_URL + '/activity/success');
    window.location.href = process.env.VUE_APP_WX_PAY + `?callbackUrl=${callback}&orderId=${this.orderId}&payType=1&zoneId=${zoneId}`;
  }
}
</script>

<style>
.center {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
.van-steps--horizontal {
  padding: 16px 16px 0;
}
</style>
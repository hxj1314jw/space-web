<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-top: -10px;">
      <OrderCard :orderForm="orderForm"/>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="账单分期" @click="showList = true" is-link>
          第{{ finishedNum }}期 / 共{{ subOrderList.length }}期
        </van-cell>
        <van-cell title="发票" value="请选择发票类型" is-link/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="单价" :value="'￥' + orderForm.price" />
        <van-cell title="数量" value="x 1" />
        <van-cell title="起租日期" :value="orderForm.purchaseBeginTime | dateFmt('YYYY-MM-DD')" />
        <van-cell title="起租时长" :value="orderForm.num" />
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="联系人" :value="orderForm.consumerName" />
        <van-cell title="联系方式" :value="orderForm.consumerPhone" />
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="计划支付时间" :value="orderForm.planDate | dateFmt('YYYY-MM-DD')" />
        <van-cell title="费用合计" :value="'￥' + orderForm.price" />
        <van-cell title="实收金额">
          <span style="color: #F76C6C">￥{{ orderForm.purchaseAmount }}</span>
        </van-cell>
      </van-cell-group>

      <div style="padding: 10px 16px; text-align: center">
        <span style="font-size: x-small; color: #969799;">
          下单时间：{{ orderForm.createDate }}
        </span>
      </div>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="cancelOrder()" type="default" plain hairline style="width: 40vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">取消订单</span>
      </van-button>
      <van-button type="primary" style="width: 60vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">立即支付</span>
      </van-button>
    </div>

    <van-popup v-model="showList" position="bottom" style="max-height: 70%">
      <van-list>
        <template v-for="(order, index) in subOrderList">
          <van-cell :title="'第' + order.num + '期' + ' / ' + '共' + subOrderList.length + '期'" :key="index">
            <span v-if="order.states === '1'" style="color: #F76C6C">待支付</span>
            <span v-if="order.states === '2'" style="color: #23B36E;">已支付</span>
            <span v-if="order.states === '4'">已取消</span>
            <span v-if="order.states === '6'" style="color: #F76C6C">已过期</span>
          </van-cell>
        </template>
      </van-list>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getSubOrderList, cancelSubOrder } from '@/api/mine';
import OrderCard from '@/components/OrderCard.vue';

import { Toast, Cell, CellGroup, Button, List, Popup, Dialog } from 'vant';
Vue.use(Toast).use(Cell).use(CellGroup).use(Button).use(List).use(Popup).use(Dialog);

@Component({
  components: {
    OrderCard
  }
})
export default class SubOrderDetail extends Vue {
  public subOrderList: any = [];
  public orderForm: any = {};
  public finishedNum: number = 1;
  public showList: boolean = false;

  public created() {
    this.fetchSubOrder();
  }

  private async fetchSubOrder() {
    const res = await getSubOrderList({
      orderId: this.$route.params.id,
      orderType: 1
    });
    this.subOrderList = res.data.data.rows;
    this.orderForm = res.data.data.rows[0];
    for (const item of this.subOrderList) {
      if (item.updateDate) {
        this.finishedNum++;
      }
    }
  }

  private cancelOrder() {
    Dialog.confirm({
      message: '订单取消后将不可恢复，确认吗？',
      confirmButtonColor: '#00B261'
    }).then(() => {
      cancelSubOrder({
        orderId: this.$route.params.id
      })
    }).catch(() => {
      // on cancel
    });
  }
}
</script>
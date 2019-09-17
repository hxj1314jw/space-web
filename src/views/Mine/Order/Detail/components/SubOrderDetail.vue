<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-top: -10px;">
      <OrderCard :orderForm="orderForm"/>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="账单分期" :value="'共' + subOrderList.length + '期'"/>
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

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="发票" value="请选择发票类型" is-link/>
      </van-cell-group>

      <div style="padding: 10px 16px; text-align: center">
        <span style="font-size: x-small; color: #969799;">
          下单时间：{{ orderForm.createDate }}
        </span>
      </div>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button type="default" plain hairline style="width: 40vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">取消订单</span>
      </van-button>
      <van-button type="primary" style="width: 60vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">立即支付</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getSubOrderList } from '@/api/mine';
import OrderCard from '@/components/OrderCard.vue';

import { Toast, Cell, CellGroup, Button } from 'vant';
Vue.use(Toast).use(Cell).use(CellGroup).use(Button);

@Component({
  components: {
    OrderCard
  }
})
export default class SubOrderDetail extends Vue {
  public subOrderList: any = [];
  public orderForm: any = {};

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
  }
}
</script>
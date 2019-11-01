<template>
  <div style="margin-top: 10px">
    <van-cell style="padding: 5px 16px;">
      <template slot="title">
        <div style="width: 60vw">订单号: {{ orderForm.orderNumber }}</div>
      </template>
      <template slot="default">
        <span v-if="orderForm.subStatus === '1'" class="order-status" style="color: #23B36E; margin-right: 10px;">分期</span>
        <span style="color: #F76C6C">
          <span v-if="orderForm.orderStates === '1'">待支付</span>
          <span v-if="orderForm.orderStates === '2'">待使用</span>
          <span v-if="orderForm.orderStates === '3'">使用中</span>
          <span v-if="orderForm.orderStates === '4'">已退款</span>
          <span v-if="orderForm.orderStates === '6'">已取消</span>
          <span v-if="orderForm.orderStates === '7'">退款中</span>
          <span v-if="orderForm.orderStates === '8'">已过期</span>
        </span>
      </template>
    </van-cell>

    <van-card style="background-color: white; margin-top: 0" @click.prevent="toDetail(orderForm.id)">
      <div slot="thumb" style="width: 35vw">
        <van-image width="100%" height="5rem" radius="1" fit="cover" :src="ossImageUrl(orderForm.bannerImage)" class="box-shadow"/>
      </div>
      <div slot="title">
        <span style="float: right; width: 80%; font-weight: bold">
          {{orderForm.productName}}
        </span>
      </div>
      <div slot="desc">
        <div style="float: right; width: 80%; margin-top: 5px;">
          <span style="color: #969799;">
            <van-icon name="location-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
            {{orderForm.address}}<br>
            <van-icon name="clock-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
            {{orderForm.purchaseBeginTime | dateFmt('YYYY.MM.DD')}}<br>
            <span style="color: #00B261; font-size: large">
              ￥{{orderForm.price || orderForm.amount }} /
              <span v-if="orderForm.chargeMethod === '1'">小时</span>
              <span v-if="orderForm.chargeMethod === '2'">日</span>
              <span v-if="orderForm.chargeMethod === '3'">月</span>
              <span v-if="orderForm.chargeMethod === '4'">年</span>
            </span>
          </span>
        </div>
      </div>
    </van-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Card, Button, Cell, Icon, Image } from 'vant';
Vue.use(Card).use(Button).use(Cell).use(Icon).use(Image);

@Component
export default class OrderCard extends Vue {
  @Prop() public orderForm!: any;

  private toDetail(orderId: any) {
    this.$router.push({
      path: `/mine/order/detail/${orderId}`,
      query: {
        status: this.orderForm.subStatus
      }
    });
  }
}
</script>
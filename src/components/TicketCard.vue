<template>
  <div style="margin-top: 10px">
    <van-cell style="padding: 5px 16px;">
      <template slot="title">
        {{ ticketForm.name }}: {{ ticketForm.phone }}
      </template>
      <template slot="default">
        <span style="color: #F76C6C">
          <span v-if="ticketForm.status === '1'">待支付</span>
          <span v-if="ticketForm.status === '2'">待参加</span>
          <span v-if="ticketForm.status === '3'">待审核</span>
          <span v-if="ticketForm.status === '4'">已拒绝</span>
          <span v-if="ticketForm.status === '5'">退票中</span>
          <span v-if="ticketForm.status === '6'">已过期</span>
          <span v-if="ticketForm.status === '7'">已使用</span>
          <span v-if="ticketForm.status === '8'">已退票</span>
        </span>
      </template>
    </van-cell>

    <van-card style="background-color: white; margin-top: 0" @click.prevent="toDetail(ticketForm.orderId, ticketForm.activityId, ticketForm.status)">
      <div slot="thumb" style="width: 35vw">
        <van-image width="100%" height="5rem" radius="1" fit="cover" :src="ossImageUrl(ticketForm.image)" class="box-shadow"/>
      </div>
      <div slot="title">
        <span style="float: right; width: 80%; font-weight: bold">
          {{ticketForm.activityName}}
        </span>
      </div>
      <div slot="desc">
        <div style="float: right; width: 80%; margin-top: 5px;">
          <span style="color: #969799;">
            <van-icon name="location-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
            {{ticketForm.address}}<br>
            <van-icon name="clock-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
            {{ticketForm.beginTime | dateFmt('YYYY.MM.DD')}} - {{ticketForm.endTime | dateFmt('YYYY.MM.DD')}}<br>
            <span style="color: #00B261; font-size: large">
              ￥{{ticketForm.ticketPrice}}
            </span>
            <span style="float: right">x{{ ticketForm.ticketNum }}</span>
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
export default class TicketCard extends Vue {
  @Prop() public ticketForm!: any;

  private toDetail(orderId: any, activityId: any, status: any) {
    switch (status) {
      case '1':
        this.$router.push(`/activity/order/${orderId}`);
        break;
      case '2':
        this.$router.push(`/mine/ticket/detail/${orderId}`);
        break;
      default:
        this.$router.push(`/activity/detail/${activityId}`);
        break;
    }
  }
}
</script>
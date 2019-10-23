<template>
  <div style="margin-top: 10px">
    <van-cell style="padding: 5px 16px;">
      <template slot="title">
        <div style="width: 60vw">预约号: {{ reserveForm.reserveNumber }}</div>
      </template>
      <template slot="default">
        <span style="color: #F76C6C">
          <span v-if="reserveForm.status === 1">预约成功</span>
          <span v-if="reserveForm.status === 2">已取消</span>
          <span v-if="reserveForm.status === 3">待确认</span>
          <span v-if="reserveForm.status === 7">已拒绝</span>
        </span>
      </template>
    </van-cell>

    <van-card style="background-color: white; margin-top: 0" @click.prevent="toDetail(reserveForm.id)">
      <div slot="thumb" style="width: 35vw">
        <van-image width="100%" height="5rem" radius="1" fit="cover" :src="ossImageUrl(reserveForm.bannerImage)" class="box-shadow"/>
      </div>
      <div slot="title">
        <span style="float: right; width: 80%; font-weight: bold">
          {{reserveForm.productName}}
        </span>
      </div>
      <div slot="desc">
        <div style="float: right; width: 80%; margin-top: 5px;">
          <span style="color: #969799;">
            <van-icon name="location-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
            {{reserveForm.address}}<br>
            <van-icon name="clock-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
            {{reserveForm.accessTime}}<br>
            <span style="color: #00B261; font-size: large">
              ￥{{reserveForm.price}}/
              <span v-if="reserveForm.chargeMethod === '1'">小时</span>
              <span v-if="reserveForm.chargeMethod === '2'">日</span>
              <span v-if="reserveForm.chargeMethod === '3'">月</span>
              <span v-if="reserveForm.chargeMethod === '4'">年</span>
            </span>
            <span style="float: right">x{{ reserveForm.useNum }}</span>
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
export default class ReserveCard extends Vue {
  @Prop() public reserveForm!: any;

  private toDetail(reserveId: any) {
    this.$router.push(`/mine/reserve/detail/${reserveId}`);
  }
}
</script>

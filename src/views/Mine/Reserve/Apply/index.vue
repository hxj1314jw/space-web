<template>
  <div style="margin-top: -10px;">
    <ReserveCard :reserveForm="reserveForm"/>

    <van-cell-group style="margin-top: 10px">
      <van-cell title="单价" :value="'￥' + reserveForm.price" />
      <van-cell title="数量" value="x 1" />
      <van-field label="起租日期" :value="reserveForm.retainingStartTime | dateFmt('YYYY-MM-DD')"
        @click="showBeginTime = true" :is-link="true" disabled="true" input-align="right" error-message-align="right" :error-message="beginTimeErrMsg"/>
      <van-field label="租期时长" v-model="rentNum" input-align="right" type="number" error-message-align="right" :error-message="rentNumErrMsg"/>
    </van-cell-group>

    <van-cell-group style="margin-top: 10px">
      <van-field label="联系人" :value="reserveForm.userName" input-align="right"/>
      <van-field label="联系方式" :value="reserveForm.userPhone" input-align="right"/>
    </van-cell-group>

    <van-cell-group style="margin-top: 10px">
      <van-cell title="费用合计" :value="'￥' + amount"/>
      <van-cell title="实收金额">
        <span style="color: #F76C6C">￥{{ amount }}</span>
      </van-cell>
    </van-cell-group>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="addOrder()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">创建订单</span>
      </van-button>
    </div>

     <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker @confirm="showBeginTime = false;" @cancel="showBeginTime = false;"
        v-model="reserveForm.retainingStartTime"
        type="date"
        :min-date="today"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getReserveInfo, addOrder } from '@/api/mine';
import ReserveCard from '@/components/ReserveCard.vue';
import { CellGroup, Button, Toast, Dialog, Field, Popup, DatetimePicker } from 'vant';
import moment from 'moment';
Vue.use(CellGroup).use(Button).use(Toast).use(Dialog).use(Field).use(Popup).use(DatetimePicker);

@Component({
  components: {
    ReserveCard
  }
})
export default class ApplyOrder extends Vue {
  public reserveForm: any = {};
  public beginTimeErrMsg: string = '';
  public rentNumErrMsg: string = '';
  public showBeginTime: boolean = false;
  public isValid: boolean  = false;
  public rentNum: number = 1;
  public today: Date = new Date();

  public created() {
    this.fetchReserve();
  }

  get amount(): number {
    if (!this.rentNum) {
      this.rentNumErrMsg = "请输入租用时长";
      this.isValid = false;
    } else {
      if ((Math.floor(this.rentNum) !== Number(this.rentNum)) || this.rentNum <= 0) {
        this.rentNumErrMsg = "请输入正整数";
        this.isValid = false;
      } else {
        if (this.rentNum > 99) {
          this.rentNumErrMsg = "租用时长不能超过2位数";
          this.isValid = false;
        } else {
          this.rentNumErrMsg = "";
          this.isValid = true;
        }
      }
    }
    return Number(this.reserveForm.price) * this.rentNum;
  }

  private async fetchReserve() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: "加载中..."
    });
    const res: any = await getReserveInfo({
      id: this.$route.params.id
    });
    this.reserveForm = res.data.data;
    vm.$toast.clear();
  }

  private async addOrder() {
    if (this.isValid) {
      this.reserveForm.startDate = moment(this.reserveForm.retainingStartTime).valueOf();
      this.reserveForm.retainingStartTime = moment(this.reserveForm.retainingStartTime).format('YYYY-MM-DD HH:mm:SS');
      this.reserveForm.rentNum = String(this.rentNum);
      this.reserveForm.amount = String(this.amount);
      this.reserveForm.amountReceived = String(this.amount);
      this.reserveForm.consumerName = this.reserveForm.userName;
      this.reserveForm.consumerPhone = this.reserveForm.userPhone;
      const res = await addOrder(this.reserveForm);
    }
  }
}
</script>

<style>
.van-field--disabled .van-field__control {
  color: rgb(70, 70, 70);
}
</style>
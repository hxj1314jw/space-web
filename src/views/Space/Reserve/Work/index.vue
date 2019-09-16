<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;">
      <div style="padding: 10px 16px;">
        <van-steps :active="1" style="background-color: #F3F3F3">
          <van-step>选择空间</van-step>
          <van-step>预约参访</van-step>
          <van-step>填写订单</van-step>
          <van-step>交易完成</van-step>
        </van-steps>
      </div>

      <van-cell-group>
        <van-field label="起租日期" @click="showBeginTime = true" :value="beginTime | dateFmt('YYYY-MM-DD')" :is-link="true" disabled="true" input-align="right"/>
        <van-field label="结束日期" @click="showEndTime = true"
          :value="endTime | dateFmt('YYYY-MM-DD')" :is-link="true" disabled="true" input-align="right" error-message-align="right" :error-message="endTimeErrMsg"/>
        <van-field label="参访时间" @click="showReserveTime = true"
          :value="reserveTime | dateFmt('YYYY-MM-DD HH:mm')" :is-link="true" disabled="true" input-align="right" error-message-align="right" :error-message="reserveTimeErrMsg"/>
      </van-cell-group>

      <div style="margin-top: 10px; text-align: center">
        <span style="color: #999999; font-size: x-small">请选择以下身份进行预约</span>
      </div>

      <van-radio-group v-model="radio" style="padding: 10px 16px;">
          <van-radio name="1" checked-color="#00B261" icon-size="20" style="margin: 0;">
            <van-cell style="width: 80vw; border-radius: 5px">
              <span style="font-weight: bold;">个人预约</span><br>
              <span style="color: #999999; font-size: smaller;">
                <van-icon slot="icon" name="user-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                姓名：{{ name }}
              </span><br>
              <span style="color: #999999; font-size: smaller;">
                <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                手机：{{ phone }}
              </span><br>
              <van-divider dashed :hairline="false" style="margin: 3px;"/>
              <span style="color: #999999; font-size: x-small;">备注：无</span>
            </van-cell>
            <div style="float: left; left: -10px;" class="ticket-circle"/>
            <div style="float: right; right: -10px;" class="ticket-circle"/>
          </van-radio>

          <template v-for="(org, index) in orgList">
            <van-radio :key="index" :name="org.id" checked-color="#00B261" icon-size="20" style="margin: 0;">
              <van-cell style="width: 80vw; border-radius: 5px">
                <span style="font-weight: bold;">机构 | {{ org.name }}</span><br>
                <span style="color: #999999; font-size: smaller;">
                  <van-icon slot="icon" name="user-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                  类型：{{ org.institutionType }}
                </span><br>
                <span style="color: #999999; font-size: smaller;">
                  <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                  手机：{{ org.companyPhone }}
                </span><br>
                <van-divider dashed :hairline="false" style="margin: 3px;"/>
                <span style="color: #999999; font-size: x-small;">备注：{{ org.institutionDescribe || '无' }}</span>
              </van-cell>
              <div style="float: left; left: -10px;" class="ticket-circle"/>
              <div style="float: right; right: -10px;" class="ticket-circle"/>
            </van-radio>
          </template>
      </van-radio-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="reserve()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon" >立即预约</span>
      </van-button>
    </div>

    <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showBeginTime = false; beginTime = today;"
        v-model="beginTime"
        type="date"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEndTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmEndTime" @cancel="showEndTime = false; endTime = today;"
        v-model="endTime"
        type="date"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showReserveTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmReserveTime" @cancel="showReserveTime = false; reserveTime = today;"
        v-model="reserveTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getOrganization, addSpaceReserve } from '@/api/space';

import { Step, Steps, Cell, CellGroup, Field, RadioGroup, Radio, Icon, Divider, Button, Popup, DatetimePicker, Toast } from 'vant';
Vue.use(Step).use(Steps).use(Cell).use(CellGroup).use(RadioGroup).use(Radio).use(Icon).use(Divider).use(Button).use(Popup).use(DatetimePicker).use(Field).use(Toast);

@Component({
  components: {}
})
export default class SpaceReserve extends Vue {
  public orgList: any = [];
  public radio: string = '1';
  public endTimeErrMsg: string = '';
  public reserveTimeErrMsg: string = '';
  public name: string = this.$store.state.user.name;
  public phone: string = this.$store.state.user.phone;
  public showBeginTime: boolean = false;
  public showEndTime: boolean = false;
  public showReserveTime: boolean = false;
  public isValid: boolean = false;
  public today: Date = new Date();
  public beginTime: Date = new Date();
  public endTime: Date = new Date();
  public reserveTime: Date = new Date();

  public created() {
    this.fetchOrg();
  }

  @Watch("beginTime")
  private onBeginTimeChanged(newVal: boolean, oldVal: boolean) {
    this.onEndTimeFocusOut();
  }

  @Watch("endTime")
  private onEndTimeChanged(newVal: boolean, oldVal: boolean) {
    this.onEndTimeFocusOut();
  }

  @Watch("reserveTime")
  private onReserveTimeChanged(newVal: boolean, oldVal: boolean) {
    this.onReserveTimeFocusOut();
  }

  private onEndTimeFocusOut() {
    if (this.endTime.getTime() <= this.beginTime.getTime()) {
      this.endTimeErrMsg = "结束日期不能早于或等于起租日期";
      return false;
    } else {
      this.endTimeErrMsg = "";
      return true;
    }
  }

    private onReserveTimeFocusOut() {
    if (this.reserveTime.getTime() <= this.today.getTime()) {
      this.reserveTimeErrMsg = "参访时间不能早于或等于当前时间";
      return false;
    } else {
      this.reserveTimeErrMsg = "";
      return true;
    }
  }

  private validate() {
    if (this.onEndTimeFocusOut() && this.onReserveTimeFocusOut()) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  private async fetchOrg() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getOrganization({
      audit: 2
    });
    this.orgList = res.data.data;
    Toast.clear();
  }

  private async reserve() {
    await this.validate();
    if (this.isValid && this.radio) {
      if (this.radio === '1') {
        addSpaceReserve({
          accessTime: this.reserveTime.getTime(),
          retainingStartTime: this.beginTime.getTime(),
          retainingEndTime: this.endTime.getTime(),
          productId: this.$route.params.id,
          productType: '1',
          userName: this.name,
          userPhone: this.phone,
          visitType: '1'
        }).then(() => {
          this.$router.push('/space/reserve/success');
        });
      } else {
        addSpaceReserve({
          accessTime: this.reserveTime.getTime(),
          retainingStartTime: this.beginTime.getTime(),
          retainingEndTime: this.endTime.getTime(),
          productId: this.$route.params.id,
          orgId: this.radio,
          productType: '1',
          visitType: '2'
        }).then(() => {
          this.$router.push('/space/reserve/success');
        });
      }
    } else {
      this.onEndTimeFocusOut();
      this.onReserveTimeFocusOut();
    }
  }

  private confirmBeginTime(value: any) {
    this.beginTime = value;
    this.showBeginTime = false;
  }

  private confirmEndTime(value: any) {
    this.endTime = value;
    this.showEndTime = false;
  }
  private confirmReserveTime(value: any) {
    this.reserveTime = value;
    this.showReserveTime = false;
  }
}
</script>

<style>
.van-step--horizontal .van-step__circle-container {
  background-color: #F3F3F3;
}
.van-field--disabled .van-field__control {
  color: rgb(70, 70, 70);
}
.ticket-circle {
  width: 20px;
  height: 20px;
  background-color: #F3F3F3;
  border-radius: 50%;
  position: relative;
  bottom: 47px;
}
</style>
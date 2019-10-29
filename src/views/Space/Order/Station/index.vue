<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;">
      <div style="padding: 10px 16px;">
        <van-steps :active="1" style="background-color: #F3F3F3">
          <van-step>选择空间</van-step>
          <van-step>填写订单</van-step>
          <van-step>交易完成</van-step>
        </van-steps>
      </div>

      <van-cell-group>
        <van-cell>
          <template slot="title">
            <span>数量</span>
          </template>
          <template>
            <van-stepper v-model="useNum" min="1" integer/>
          </template>
        </van-cell>
        <van-field label="起租时间" @click="showBeginTime = true"
          :value="beginTime | dateFmt('YYYY-MM-DD HH:mm')" :is-link="true" disabled="true" input-align="right" error-message-align="right" :error-message="beginTimeErrMsg"/>
          <van-cell>
          <template slot="title">
            <span>租用时长（小时）</span>
          </template>
          <template>
            <van-stepper v-model="rentNum" min="1" integer/>
          </template>
        </van-cell>
      </van-cell-group>

      <div style="margin-top: 10px; text-align: center">
        <span style="color: #999999; font-size: x-small">请选择以下身份进行预约</span>
      </div>

      <van-radio-group v-model="radio" style="padding: 10px 16px;">
          <van-radio name="1" checked-color="#00B261" icon-size="20" style="margin: 0;">
            <van-cell style="width: 80vw; border-radius: 5px">
              <span style="font-weight: bold;">个人</span><br>
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
        <span class="center van-icon" >立即下单</span>
      </van-button>
    </div>

    <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showBeginTime = false; beginTime = today;"
        v-model="beginTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getOrganization } from '@/api/space';
import { addOrder } from '@/api/mine';

import { Step, Steps, Cell, CellGroup, Field, RadioGroup, Radio, Icon, Divider, Button, Popup, DatetimePicker, Toast, Notify, Stepper } from 'vant';
Vue.use(Step).use(Steps).use(Cell).use(CellGroup).use(RadioGroup).use(Radio).use(Icon).use(Divider).use(Button).use(Popup).use(DatetimePicker).use(Field).use(Toast).use(Notify).use(Stepper);

@Component({
  components: {}
})
export default class StationSpaceOrder extends Vue {
  public orgList: any = [];
  public radio: string = '1';
  public beginTimeErrMsg: string = '';
  public useNum: number = 1;
  public rentNum: number = 1;
  public name: string = this.$store.state.user.name;
  public phone: string = this.$store.state.user.phone;
  public showBeginTime: boolean = false;
  public isValid: boolean = false;
  public today: Date = new Date();
  public beginTime: Date = new Date();

  public created() {
    this.fetchOrg();
  }

  @Watch("beginTime")
  private onBeginTimeChanged(newVal: boolean, oldVal: boolean) {
    this.onBeginTimeFocusOut();
  }

  private onBeginTimeFocusOut() {
    if (this.beginTime.getTime() <= this.today.getTime()) {
    this.beginTimeErrMsg = "起租时间不能早于或等于当前时间";
    return false;
    } else {
    this.beginTimeErrMsg = "";
    return true;
    }
  }

  private validate() {
    if (this.onBeginTimeFocusOut()) {
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
      if (this.name === 'null' || !this.name) {
        Notify({
            message: '请先完善个人信息',
            duration: 2500,
            background: '#F76C6C'
        });
      } else {
        if (this.radio === '1') {
          addOrder({
            consumerName: this.name,
            consumerPhone: this.phone,
            productType: this.$route.query.type,
            purchaseMethod: '1',
            rentNum: this.rentNum,
            startDate: this.beginTime.getTime(),
            useNum: this.useNum,
            zoneProductId: this.$route.params.id
          }).then((res: any) => {
            this.$router.push({
              path: `/mine/order/detail/${res.data.data}`,
              query: {
                status: '0'
              }
            });
          });
        } else {
          addOrder({
            orgId: this.radio,
            productType: this.$route.query.type,
            purchaseMethod: '2',
            rentNum: this.rentNum,
            startDate: this.beginTime.getTime(),
            useNum: this.useNum,
            zoneProductId: this.$route.params.id
          }).then((res: any) => {
            this.$router.push({
              path: `/mine/order/detail/${res.data.data}`,
              query: {
                status: '0'
              }
            });
          });
        }
      }
    } else {
      this.onBeginTimeFocusOut();
    }
  }

  private confirmBeginTime(value: any) {
    this.beginTime = value;
    this.showBeginTime = false;
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
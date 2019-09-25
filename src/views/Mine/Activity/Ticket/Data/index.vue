<template>
  <div>
    <div style="background-color: #369E6F; width: 100vw; height: 170px;">
      <div style="color: white">
        <div style="font-weight: bold; font-size: larger; padding: 10px 16px 0 16px;">{{ activityForm.name }}</div>
        <div style="font-size: small; padding: 10px 16px 0 16px;">
          {{activityForm.publisherName}}<br>
          {{activityForm.beginTime | dateFmt('YYYY-MM-DD')}} | {{activityForm.tags || '无'}}
        </div>
      </div>
    </div>
    <div style="position: absolute; top: 130px; left: 3%; height: 80px; width: 94%; background-color: white; border-radius: 5px; text-align: center">
      <van-row>
        <van-col span="6" style="padding-top: 15px;">
          <div style="font-size: X-large; color: #00B261">{{ activityForm.reportNum || '--' }}</div>
          <div style="font-size: small; color: #999999; margin-top: 3px;">报名数(人)</div>
        </van-col>
        <van-col span="6" style="padding-top: 15px;">
          <div style="font-size: X-large; color: #00B261">{{ activityForm.signNum || '--' }}</div>
          <div style="font-size: small; color: #999999; margin-top: 3px;">签到数(人)</div>
        </van-col>
        <van-col span="6" style="padding-top: 15px;">
          <div style="font-size: X-large; color: #00B261">{{ (activityForm.signNum / activityForm.reportNum * 100) || '--' }}</div>
          <div style="font-size: small; color: #999999; margin-top: 3px;">签到率(%)</div>
        </van-col>
        <van-col span="6" style="padding-top: 15px;">
          <div style="font-size: X-large; color: #00B261">{{ ticketAmount || '0' }}</div>
          <div style="font-size: small; color: #999999; margin-top: 3px;">收益额(元)</div>
        </van-col>
      </van-row>
    </div>

    <van-tabs v-model="activeName" color="#23B36E" @click="onClick" style="margin-top: 55px;">
      <van-tab title="免费票" name="free">
        <div v-if="ticketList.length !== 0" style="margin-top: -10px;">
          <template v-for="(ticket, index) in ticketList">
            <van-swipe-cell :key="index">
              <TicketUser :userForm="ticket"/>
              <template v-if="ticket.audit === 1" slot="right">
                <van-button @click="pass(ticket.id)" icon="success" square type="primary" text="通过" style="height: 100%"/>
                <van-button @click="confuse(ticket.id)" icon="cross" square type="danger" text="拒绝" style="height: 100%"/>
              </template>
            </van-swipe-cell>
          </template>
        </div>
        <NoData v-else/>
      </van-tab>
      <van-tab title="收费票" name="charge">
        <div v-if="ticketList.length !== 0" style="margin-top: -10px;">
          <template v-for="(ticket, index) in ticketList">
            <van-swipe-cell :key="index">
              <TicketUser :userForm="ticket"/>
              <template v-if="ticket.audit === 1" slot="right">
                <van-button @click="pass(ticket.id)" icon="success" square type="primary" text="通过" style="height: 100%"/>
                <van-button @click="confuse(ticket.id)" icon="cross" square type="danger" text="拒绝" style="height: 100%"/>
              </template>
            </van-swipe-cell>
          </template>
        </div>
        <NoData v-else/>
      </van-tab>
      <van-tab title="检票员" name="teller">
        <div>
          <template v-for="(teller, index) in tellerList">
            <van-swipe-cell :key="index">
              <van-cell>
                #{{ index }} 检票员
                <span style="color: #999999">（{{ teller.phone }}）</span>
              </van-cell>
              <template slot="right">
                <van-button @click="delTeller(teller.id)" icon="delete" square type="danger" text="移除" style="height: 100%"/>
              </template>
            </van-swipe-cell>
          </template>
        </div>
        <van-field type="tell" maxlength="11" v-if="show" v-model="phone" placeholder="请输入检票员手机">
          <van-button @click="addTeller()" slot="button" icon="add" round size="mini" type="primary"/>
        </van-field>
        <div @click="show = true" style="text-align: center; margin-top: 20px;">
          <span style="color: #00B261">+新增 </span>
          <span style="color: #999999; font-size: x-small">检票员</span>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TicketUser from '@/components/TicketUser.vue';
import NoData from '@/components/NoData.vue';
import { getActivityDetail, getMyActivityTicket, editTicketAudit, addTicketTeller, getTellerList, delTeller, getTicketSum } from '@/api/activity';
import moment from 'moment';
import { Tab, Tabs, Row, Col, SwipeCell, Icon, Field, Button, Notify } from 'vant';
Vue.use(Tab).use(Tabs).use(Row).use(Col).use(SwipeCell).use(Icon).use(Field).use(Button).use(Notify);

@Component({
  components: {
    TicketUser,
    NoData
  }
})

export default class MineActivityTicketData extends Vue {
  public activityForm: any = {};
  public ticketList: any = [];
  public tellerList: any = [];
  public activeName: string = 'free';
  public isFreeFlag: string = '0';
  public phone: string = '';
  public show: boolean = false;
  public ticketAmount: number = 0;

  public created() {
    this.fetchActivity();
    this.fetchTicket();
    this.fetchTicketSum();
  }

  private onClick(value: any) {
    switch (value) {
      case 'free':
        this.isFreeFlag = '0';
        this.fetchTicket();
        break;
      case 'charge':
        this.isFreeFlag = '1';
        this.fetchTicket();
        break;
      case 'teller':
        this.fetchTeller();
        break;
    }
  }

  private async fetchActivity() {
    const res = await getActivityDetail({id: this.$route.params.id});
    this.activityForm = res.data.data.activityDetail;
  }

  private async fetchTicketSum() {
    const res = await getTicketSum({id: this.$route.params.id});
    this.ticketAmount = res.data.data.amount;
  }

  private async fetchTicket() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getMyActivityTicket({
      activityId: this.$route.params.id,
      isFreeFlag: this.isFreeFlag
    });
    this.ticketList = res.data.data.rows;
    vm.$toast.clear();
  }

  private async fetchTeller() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getTellerList({
      activityId: this.$route.params.id
    });
    this.tellerList = res.data.data;
    vm.$toast.clear();
  }

  private pass(id: any) {
    editTicketAudit({
      id,
      audit: '2'
    });
    this.fetchTicket();
  }

  private confuse(id: any) {
    editTicketAudit({
      id,
      audit: '3'
    });
    this.fetchTicket();
  }

  private addTeller() {
    addTicketTeller({
      activityId: this.$route.params.id,
      phone: this.phone
    }).then(() => {
      this.fetchTeller();
      this.show = false;
    }).catch((err: any) => {
      Notify({ type: 'danger', message: err.response.data.message });
    });
  }

  private delTeller(id: any) {
    delTeller({id}).then(() => {
      this.fetchTeller();
    });
  }
}
</script>

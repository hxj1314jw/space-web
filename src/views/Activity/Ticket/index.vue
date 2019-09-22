<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-top: -10px;">
      <ActivityCard :activityForm="activityForm" :hidden="true"/>

      <div style="margin-top: 10px; text-align: center">
        <span style="color: #999999; font-size: x-small">请选择以下门票进行报名</span>
      </div>

      <van-radio-group v-model="radio" style="padding: 10px 16px;">
        <template v-for="(ticket, index) in ticketList">
          <van-radio :key="index" :name="ticket.id" @click="chooseTicket(ticket.price)" checked-color="#00B261" icon-size="20" style="margin: 0;">
            <van-cell style="width: 80vw; border-radius: 5px">
              <span style="font-weight: bold;">{{ ticket.name }}</span><br>
              <span style="color: #999999; font-size: smaller;">
                <van-icon slot="icon" name="clock-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                活动时间：{{ activityForm.beginTime | dateFmt('YYYY.MM.DD') }} - {{ activityForm.endTime | dateFmt('YYYY.MM.DD') }}
              </span><br>
              <span style="color: #00B261; font-size: larger">￥{{ ticket.price }}</span>
              <span style="color: #999999; font-size: x-small; margin-left: 10px;">剩余{{ ticket.totalCount - ticket.soldCount }}张</span>
              <van-divider dashed :hairline="false" style="margin: 3px;"/>
              <span style="color: #999999; font-size: x-small;">备注：{{ ticket.remark || '无' }}</span>
            </van-cell>
            <div style="float: left; left: -10px;" class="ticket-circle"/>
            <div style="float: right; right: -10px;" class="ticket-circle"/>
          </van-radio>
        </template>
      </van-radio-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <div style="width: 40vw; height: 100%; float: left; background-color: #FFFFFF; text-align: center">
        <span class="center">
          <span style="color: #999999; font-size: small">合计 </span>
          <span style="color: #00B261; font-size: larger">￥{{ price || '0'}}</span>
        </span>
      </div>
      <van-button @click="toTicketForm(radio)" type="primary" style="width: 60vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon" >立即报名</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityCard from '@/components/ActivityCard.vue';
import { getActivityDetail, getTicketList } from '@/api/activity';
import { RadioGroup, Radio, Cell, Divider, Button, Toast } from 'vant';
Vue.use(RadioGroup).use(Radio).use(Cell).use(Divider).use(Button).use(Toast);

@Component({
  components: {
    ActivityCard
  }
})

export default class ActivityTicket extends Vue {
  public activityForm: any = {};
  public ticketList: any = [];
  public radio: string = '';
  public price: string = '';
  public activityId: string = '';

  public created() {
    this.activityId = this.$route.params.id;
    this.fetchActivity();
    this.fetchTicket();
  }

  private async fetchActivity() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getActivityDetail({
      id: this.activityId
    });
    this.activityForm = res.data.data.activityDetail;
    Toast.clear();
  }

  private async fetchTicket() {
    const res = await getTicketList({
      activityId: this.activityId
    });
    this.ticketList = res.data.data;
  }

  private chooseTicket(price: string) {
    this.price = price;
  }

  private toTicketForm(ticketId: any) {
    if (this.radio) {
      this.$router.push(`/activity/form/${this.activityId}/${ticketId}`);
    }
  }
}
</script>

<style scoped>
.ticket-circle {
  width: 20px;
  height: 20px;
  background-color: #F3F3F3;
  border-radius: 50%;
  position: relative;
  bottom: 47px;
}
.center {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
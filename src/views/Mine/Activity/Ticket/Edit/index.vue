<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <div style="margin-top: 10px; text-align: center">
        <span style="color: #999999; font-size: x-small">请选择以下门票进行编辑</span>
      </div>

      <div style="padding: 10px 5vw; margin-top: -10px;">
        <template v-for="(ticket, index) in ticketList">
          <div :key="index" style="margin-top: 10px">
            <van-cell style="width: 90vw; border-radius: 5px;">
              <span style="font-weight: bold;">{{ ticket.name }}</span><br>
              <span style="color: #00B261; font-size: larger">￥{{ ticket.price }}</span>
              <span style="color: #999999; font-size: x-small; margin-left: 10px;">剩余{{ ticket.totalCount }}张</span>
            </van-cell>
            <van-button @click="deleteTicket(ticket.id)" plain hairline style="width: 50%">
              <span style="color: #f76c6c;">删除</span>
            </van-button>
            <van-button @click="editTicket(ticket.id)" plain hairline style="width: 50%">编辑</van-button>
          </div>
        </template>

        <div style="margin-top: 10px">
          <van-cell style="width: 90vw; border-radius: 5px; height: 127px;">
            <div style="height: 50px; text-align: center; margin-top: 25px;">
              <span @click="addTicket()" style="color: #00B261; font-size: larger;">+ 新增票种</span>
            </div>
            <van-divider dashed :hairline="false" style="margin: 3px;"/>
            <span style="color: #999999; font-size: x-small;">备注：无</span>
          </van-cell>
          <div style="float: left; left: -10px;" class="ticket-circle"/>
          <div style="float: right; right: -10px;" class="ticket-circle"/>
        </div>
      </div>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="toEditForm()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">下一步</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';
import moment from 'moment';
import { getTicketAllList, delTicket } from '@/api/activity';

import { Toast, CellGroup, Cell, Divider, Button, Dialog } from 'vant';
Vue.use(Toast).use(CellGroup).use(Cell).use(Divider).use(Button).use(Dialog);

@Component({
  components: {}
})
export default class EditActivityTicket extends Vue {
  public ticketList: any = [];

  public created() {
    this.fetchTicket();
  }

  private async fetchTicket() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getTicketAllList({activityId: this.$route.params.id});
    this.ticketList = res.data.data;
    Toast.clear();
  }

  private deleteTicket(id: any) {
    Dialog.confirm({
      message: '是否删除该票种？',
      confirmButtonColor: '#00B261'
    }).then(() => {
      delTicket({id}).then(() => {
        this.fetchTicket();
      });
    }).catch(() => {
      // on cancel
    });
  }

  private addTicket() {
    this.$router.push(`/mine/activity/ticket/add/${this.$route.params.id}`);
  }

  private editTicket(id: any) {
    this.$router.push({
      path: `/mine/activity/ticket/add/${this.$route.params.id}`,
      query: {
        ticketId: id
      }
    });
  }

  private toEditForm() {
    this.$router.push(`/mine/activity/ticket/form/${this.$route.params.id}`);
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
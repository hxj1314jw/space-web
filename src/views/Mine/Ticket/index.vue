<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
      <van-tab title="全部" name="all">
        <div v-if="ticketList.length !== 0" style="margin-top: -10px;">
          <template v-for="(ticket, index) in ticketList">
            <TicketCard :ticketForm="ticket" :key="index"/>
          </template>
        </div>
        <div v-else style="text-align: center; margin-top: 90px;">
          <img width="120px" height="94px" src="../../../assets/icon/no-data.png" />
          <div style="margin-top: 10px;">
            <span style="color: #999999">暂无数据</span>
          </div>
        </div>
      </van-tab>
      <van-tab title="待参加" name="unjoined">
        <div v-if="ticketList.length !== 0" style="margin-top: -10px;">
          <template v-for="(ticket, index) in ticketList">
            <TicketCard :ticketForm="ticket" :key="index"/>
          </template>
        </div>
        <div v-else style="text-align: center; margin-top: 90px;">
          <img width="120px" height="94px" src="../../../assets/icon/no-data.png" />
          <div style="margin-top: 10px;">
            <span style="color: #999999">暂无数据</span>
          </div>
        </div>
      </van-tab>
      <van-tab title="待审核" name="unchecked">
        <div v-if="ticketList.length !== 0" style="margin-top: -10px;">
          <template v-for="(ticket, index) in ticketList">
            <TicketCard :ticketForm="ticket" :key="index"/>
          </template>
        </div>
        <div v-else style="text-align: center; margin-top: 90px;">
          <img width="120px" height="94px" src="../../../assets/icon/no-data.png" />
          <div style="margin-top: 10px;">
            <span style="color: #999999">暂无数据</span>
          </div>
        </div>
      </van-tab>
      <van-tab title="待支付" name="unpaid">
        <div v-if="ticketList.length !== 0" style="margin-top: -10px;">
          <template v-for="(ticket, index) in ticketList">
            <TicketCard :ticketForm="ticket" :key="index"/>
          </template>
        </div>
        <div v-else style="text-align: center; margin-top: 90px;">
          <img width="120px" height="94px" src="../../../assets/icon/no-data.png" />
          <div style="margin-top: 10px;">
            <span style="color: #999999">暂无数据</span>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getTicketList } from '@/api/mine';
  import TicketCard from '@/components/TicketCard.vue';
  import { Tab, Tabs, List, SwipeCell, Button, Dialog } from 'vant';
  Vue.use(Tab).use(Tabs).use(List).use(SwipeCell).use(Button).use(Dialog);

  @Component({
    components: {
      TicketCard
    }
  })

  export default class Collect extends Vue {
    public ticketList: any = [];
    public activeName: string = 'all';
    public status: string = '';
    public size: number = Math.ceil(window.screen.availHeight / 100);

    public created() {
      this.fetchTicket();
    }

    private async fetchTicket() {
      const vm: any = this;
      vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
      });
      const res = await getTicketList({
        status: this.status
      });
      this.ticketList = res.data.data;
      vm.$toast.clear();
    }

    private onClick(value: any) {
      this.initList();
      switch (this.activeName) {
        case 'all':
          this.status = '';
          break;
        case 'unjoined':
          this.status = '2';
          break;
        case 'unchecked':
          this.status = '3';
          break;
        case 'unpaid':
          this.status = '1';
          break;
      }
      this.fetchTicket();
    }

    private initList() {
      this.ticketList = [];
    }
  }
</script>

<style scoped>
.no-data-img {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

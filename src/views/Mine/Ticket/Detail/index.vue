<template>
  <div style="margin-top: -10px;">
    <TicketCard :ticketForm="ticketForm"/>

    <van-divider style="margin: 0"/>

    <van-grid :border="false" :column-num="1">
      <van-grid-item>
        <template slot="icon">
          取票入场<br>
          <span style="color: #969799; font-size: small">请勿截图转发给陌生人</span>
          <qriously :value="qrcode" :size="200"/>
        </template>
        <template slot="text">
          <span>{{ ticketForm.orderId }}</span>
          <span style="color: #969799; font-size: small">扫描二维码即可使用</span>
        </template>
      </van-grid-item>
    </van-grid>

    <div style="padding: 20px 16px;">
      <span style="font-size: x-small; color: #969799">
        温馨提示 :<br>
        1. 请不要将电子票随意分享给他人，以免被盗用<br>
        2. 入场前请提前打开电子票，具体签到方式请听从主办方指示
      </span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getTicketDetail } from '@/api/mine';
import TicketCard from '@/components/TicketCard';
import VueQriously from "vue-qriously";
import Fingerprint2 from 'fingerprintjs2';
import { Toast, Grid, GridItem, Divider } from 'vant';
Vue.use(VueQriously).use(Toast).use(Grid).use(GridItem).use(Divider);

export default {
  data() {
    return {
      qrcode: "",
      ticketForm: []
    };
  },

  components: {
    TicketCard
  },

  methods: {
    async fetchTicket() {
      Toast.loading({
        mask: true,
        forbidClick: true,
        message: '加载中...'
      });
      const res = await getTicketDetail({orderId: this.$route.params.id});
      this.ticketForm = res.data.data;
      Toast.clear();
    },
  },

  created() {
    this.fetchTicket();
    Fingerprint2.get((callback) => {
      const orderId = this.$route.params.id;
      const deviceSig = Fingerprint2.x64hash128(callback.map((pair) => {
        return pair.value;
      }).join(), 32);
      this.qrcode = `${process.env.VUE_APP_QR_CODE}?orderId=${orderId}&deviceSig=${deviceSig}`;
    });
  }
};
</script>

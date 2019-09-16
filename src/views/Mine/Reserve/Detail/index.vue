<template>
  <div style="margin-top: -10px;">
    <ReserveCard :reserveForm="reserveForm"/>

    <van-cell-group style="margin-top: 10px">
      <van-cell title="联系人" :value="reserveForm.userName" />
      <van-cell title="联系方式" :value="reserveForm.userPhone" />
    </van-cell-group>

    <van-cell-group style="margin-top: 10px">
      <van-cell title="起租时间" :value="reserveForm.retainingStartTime" />
      <van-cell title="结束时间" :value="reserveForm.retainingEndTime" />
      <van-cell title="参访时间" :value="reserveForm.accessTime" />
    </van-cell-group>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button v-if="reserveForm.status === 3" @click="cancelReserve()" type="danger" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">取消预约</span>
      </van-button>
      <van-button v-if="reserveForm.status == 1 && reserveForm.zoneProductType =='1'" @click="applyOrder()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">申请使用</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getReserveInfo, cancelReserve } from '@/api/mine';
import ReserveCard from '@/components/ReserveCard.vue';
import { CellGroup, Button, Toast, Dialog } from 'vant';
Vue.use(CellGroup).use(Button).use(Toast).use(Dialog);

@Component({
  components: {
    ReserveCard
  }
})
export default class ReserveDetail extends Vue {
  public reserveForm: any = {};

  public created() {
    this.fetchReserve();
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

  private cancelReserve() {
    Dialog.confirm({
      message: '取消预约后将不可恢复，确认吗？',
      confirmButtonColor: '#00B261'
    }).then(() => {
      cancelReserve({id: this.$route.params.id}).then(() => {
        this.fetchReserve();
      });
    }).catch(() => {
      // on cancel
    });
  }

  private applyOrder() {
    this.$router.push(`/mine/reserve/apply/${this.$route.params.id}`);
  }
}
</script>

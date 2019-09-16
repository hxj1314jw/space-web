<template>
  <div style="margin-top: -10px;">
    <template v-for="(reserve, index) in reserveList">
      <ReserveCard :key="index" :reserveForm="reserve"/>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getReserveList } from '@/api/mine';
import ReserveCard from '@/components/ReserveCard.vue';

@Component({
  components: {
    ReserveCard
  }
})
export default class Mine extends Vue {
  public reserveList: any = [];

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
    const res: any = await getReserveList();
    this.reserveList = res.data.data;
    vm.$toast.clear();
  }
}
</script>

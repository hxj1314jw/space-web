<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E">
      <van-tab title="全部" name="all">
        <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OrderCard from '@/components/OrderCard.vue';
import { getOrderList } from '@/api/mine';
import { List, Tab, Tabs } from 'vant';
Vue.use(List).use(Tab).use(Tabs);

@Component({
  components: {
    OrderCard
  }
})
export default class MineOrder extends Vue {
  public orderList: any = [];
  public status: string = '';
  public activeName: string = 'all';
  public total: number = 0;
  public page: number = 1;
  public size: number = Math.ceil(window.screen.availHeight / 100);
  public loading: boolean = false;
  public finished: boolean = false;

  public created() {
    this.fetchOrder();
  }

  private async fetchOrder() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: "加载中..."
    });
    const res: any = await getOrderList({
      page: this.page,
      size: this.size,
      status: this.status
    });
    this.loading = false;
    this.total = Number(res.data.data.total);
    for (const item of res.data.data.rows) {
      this.orderList.push(item);
    }
    if (this.orderList.length < this.size || this.orderList.length === this.total) {
      this.finished = true;
    }
    vm.$toast.clear();
  }

  private onLoad() {
    this.loading = true;
    this.page++;
    this.fetchOrder();
  }
}
</script>

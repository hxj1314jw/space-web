<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E"  @click="onClick">
      <van-tab title="全部" name="all">
        <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="待支付" name="unpaid">
        <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="待使用" name="unused">
        <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="已完成" name="used">
        <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="已取消" name="canceled">
        <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="已退单" name="deleted">
        <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(order, index) in orderList">
              <OrderCard :key="index" :orderForm="order"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OrderCard from '@/components/OrderCard.vue';
import NoData from '@/components/NoData.vue';
import { getOrderList } from '@/api/mine';
import { List, Tab, Tabs } from 'vant';
Vue.use(List).use(Tab).use(Tabs);

@Component({
  components: {
    NoData,
    OrderCard
  }
})
export default class MineOrder extends Vue {
  public orderList: any = [];
  public states: string = '';
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
      states: this.states
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

  private onClick(value: any) {
    this.page = 1;
    this.orderList = [];
    switch (this.activeName) {
      case 'all':
        this.states = '';
        break;
      case 'unpaid':
        this.states = '1';
        break;
      case 'unused':
        this.states = '2';
        break;
      case 'used':
        this.states = '5';
        break;
      case 'canceled':
        this.states = '6';
        break;
      case 'deleted':
        this.states = '7';
        break;
    }
    this.fetchOrder();
  }
}
</script>

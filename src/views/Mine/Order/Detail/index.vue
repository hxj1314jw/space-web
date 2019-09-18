<template>
  <div>
    <SubOrderDetail v-if="status === '1'" :isAble="isAble"/>
    <OrderDetail v-else/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OrderDetail from './components/OrderDetail.vue';
import SubOrderDetail from './components/SubOrderDetail.vue';
import { getOrderInfo } from '@/api/mine';

@Component({
  components: {
    OrderDetail,
    SubOrderDetail
  }
})
export default class OrderInfo extends Vue {
  public orderForm: any = {};
  public status: string = '';
  public isAble: boolean = false;

  public created() {
    this.status = String(this.$route.query.status);
    this.fetchOrder();
  }

  public async fetchOrder() {
    const res = await getOrderInfo({
      orderId: this.$route.params.id
    });
    this.orderForm = res.data.data;
    if (this.orderForm.states === '1' || this.orderForm.states === '5') {
      this.isAble = true;
    }
  }
}
</script>

<template>
  <div>
    <SubOrderDetail v-if="status === '1'"/>
    <OrderDetail v-else/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OrderDetail from './components/OrderDetail.vue';
import SubOrderDetail from './components/SubOrderDetail.vue';

@Component({
  components: {
    OrderDetail,
    SubOrderDetail
  }
})
export default class OrderInfo extends Vue {
  public status: string = '';

  public created() {
    this.status = String(this.$route.query.status);
  }
}
</script>

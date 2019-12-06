<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-cell-group>
        <van-field v-model="ticketForm.name" label="票种名称" placeholder="请输入票种名称" input-align="right"/>
        <van-cell @click="showType = true" title="票种类型" :value="freeText" is-link/>
        <van-cell>
          <template slot="title">
            <span>票种数量</span>
          </template>
          <template>
            <van-stepper v-model="ticketForm.totalCount" />
          </template>
        </van-cell>
        <van-field v-if="freeText !== '免费'" v-model="ticketForm.price" label="票种价格" placeholder="请选择票种价格" input-align="right" type="number"/>
        <van-field v-model="ticketForm.remark" label="票种说明" placeholder="请输入票种说明" input-align="right" type="textarea" rows="2" autosize/>
        <van-switch-cell v-model="checked" title="审核" active-color="#00B261"/>
      </van-cell-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="saveTicket()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">保存</span>
      </van-button>
    </div>

    <van-popup v-model="showType" position="bottom">
      <van-picker :default-index="defaultIndex" :columns="columns" @change="onChange" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { addMyTicket, getTicketInfo, editTicket } from '@/api/activity';

import { Toast, CellGroup, Cell, Field, Button, SwitchCell, Stepper, Popup, Picker } from 'vant';
Vue.use(Toast).use(CellGroup).use(Cell).use(Field).use(Button).use(SwitchCell).use(Stepper).use(Popup).use(Picker);

@Component({
  components: {}
})
export default class AddActivityTicket extends Vue {
  public columns: any = ['免费', '收费'];
  public ticketForm: any = {
    price: 0,
    totalCount: 1
  };
  public freeText: string = '';
  public checked: boolean = false;
  public showType: boolean = false;
  public defaultIndex: number = 0;

  public created() {
    if (this.$route.query.ticketId) {
      this.fetchTicket();
    }
  }

  private async fetchTicket() {
    const res = await getTicketInfo({id: this.$route.query.ticketId});
    switch (res.data.data.isFreeFlag) {
      case 0:
        this.freeText = '免费';
        break;
      case 1:
        this.freeText = '收费';
        break;
    }
    this.ticketForm = res.data.data;
    this.ticketForm.price = 0;
    this.ticketForm.isFreeFlag = 0;
  }

  private onChange(picker: any, value: any) {
    this.freeText = value;
  }

  private saveTicket() {
    this.ticketForm.activityId = this.$route.params.id;
    this.ticketForm.isFreeFlag = 0;
    switch (this.checked) {
      case false:
        this.ticketForm.needAudit = 0;
        break;
      case true:
        this.ticketForm.needAudit = 1;
        break;
    }
    switch (this.freeText) {
      case '免费':
        this.ticketForm.isFreeFlag = 0;
        break;
      case '收费':
        this.ticketForm.isFreeFlag = 1;
        break;
    }
    if (this.$route.query.ticketId) {
      editTicket(this.ticketForm).then(() => {
        this.$router.push(`/mine/activity/ticket/edit/${this.$route.params.id}`);
      });
    } else {
      addMyTicket(this.ticketForm).then(() => {
        this.$router.push(`/mine/activity/ticket/edit/${this.$route.params.id}`);
      });
    }
  }
}
</script>

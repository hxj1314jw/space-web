<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-top: -10px;">
      <ActivityCard :activityForm="activityForm" :hidden="true"/>

      <!-- <van-steps :active="1" style="margin-top: 10px">
        <van-step>选择票种</van-step>
        <van-step>填写表单</van-step>
        <van-step>确认支付</van-step>
        <van-step>交易完成</van-step>
      </van-steps> -->

      <van-cell-group style="margin-top: 10px">
        <template v-for="(field, index) in fieldList">
          <van-field v-if="field.name === '手机'" disabled v-model="field.textStr" :label="field.name+ '：'" :placeholder="'请输入' + field.name" :required="field.requireStatus" :key="index" input-align="right"/>
          <van-field v-else v-model="field.textStr" :label="field.name+ '：'" :placeholder="'请输入' + field.name" :required="field.requireStatus" :key="index" input-align="right"/>
        </template>
      </van-cell-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="confirmSubmit()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">确认提交</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActivityCard from '@/components/ActivityCard.vue';
import { getActivityDetail, getTicketFieldList, addTicket } from '@/api/activity';
import { CellGroup, Button, Toast, Field, Step, Steps } from 'vant';
Vue.use(CellGroup).use(Button).use(Toast).use(Field).use(Step).use(Steps);

@Component({
  components: {
    ActivityCard
  }
})

export default class ActivityTicketForm extends Vue {
  public activityForm: any = {};
  public fieldList: any = [];
  public activityId: string = '';
  public ticketId: string = '';
  public ticketNum: number = 1;

  public created() {
    this.activityId = this.$route.params.activityId;
    this.ticketId = this.$route.params.ticketId;
    this.fetchActivity();
    this.fetchForm();
  }

  private async fetchActivity() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getActivityDetail({
      id: this.activityId
    });
    this.activityForm = res.data.data.activityDetail;
    Toast.clear();
  }

  private async fetchForm() {
    const res = await getTicketFieldList({activityId: this.activityId});
    this.fieldList = res.data.data;
    for (const field of this.fieldList) {
      switch (field.fieldName) {
        case 'name':
          if ( this.$store.state.user.name !== 'null') {
            field.textStr = this.$store.state.user.name;
          } else {
            field.textStr = '';
          }
          break;
        case 'phone':
          field.textStr = this.$store.state.user.phone;
          break;
      }
    }
  }

  private async confirmSubmit() {
    const data: any = {};
    this.fieldList.map((field: any) => {
      data[field.fieldName] = field.textStr;
    });
    data.activityId = this.activityId;
    data.ticketId = this.ticketId;
    data.ticketNum = this.ticketNum;
    const res = await addTicket(data);
    if (res.data.code === 200) {
      if (res.data.data.isFreeFlag === 0) {
        this.$router.push('/activity/success');
      } else {
        this.$router.push(`/activity/order/${res.data.data.id}`);
      }
    }
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
.van-steps--horizontal {
  padding: 16px 16px 0;
}
</style>
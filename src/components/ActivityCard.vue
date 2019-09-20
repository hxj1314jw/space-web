<template>
  <van-card :tag="activityForm.activityName" style="background-color: white; margin-top: 10px;" @click.prevent="toActivityDetail(activityForm.id)">
    <div slot="thumb" style="width: 35vw">
      <van-image width="100%" height="5rem" radius="1" fit="cover" :src="ossImageUrl(activityForm.image)" class="box-shadow"/>
    </div>
    <div slot="title">
      <span style="float: right; width: 80%; font-weight: bold">
        <van-tag v-if="activityForm.hotStatus" color="#fff7e8" text-color="#ffb11a">优选</van-tag>
        {{activityForm.name}}
      </span>
    </div>
    <div slot="desc">
      <div style="float: right; width: 80%;">
        <span style="color: #969799;">
          {{activityForm.publisherName}}<br>
          {{activityForm.beginTime | dateFmt('YYYY-MM-DD')}} | {{activityForm.tags || '无'}}
        </span>
        <span v-if="!hidden" style="float: right; font-weight: bold; color: #00B261; padding-right: 3px;">￥{{activityForm.price}} 起</span>
        <div v-if="!hidden" style="width: 100%; float: right;">
          <van-button plain type="primary" size="mini" style="width: 70px; float: right; margin-top: 3px;">
            <span v-if="activityForm.status === '6' || activityForm.status === '2'">立即报名</span>
            <span v-else>报名截止</span>
          </van-button>
        </div>
      </div>
    </div>
  </van-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Card, Button, Tag, Icon, Image } from 'vant';
Vue.use(Card).use(Button).use(Tag).use(Icon).use(Image);

@Component
export default class ActivityCard extends Vue {
  @Prop() public activityForm!: any;
  @Prop() public hidden: any;
  @Prop() public mine: any;

  private toActivityDetail(id: any) {
    if (this.mine) {
      this.$router.push({
        path: `/mine/activity/edit`,
        query: {
          activityId: id
        }
      });
    } else {
      this.$router.push(`/activity/detail/${id}`);
    }
  }
}
</script>

<template>
  <van-cell-group class="survey-card">
    <van-cell>
      <div>
        <span style="font-size: larger" color="#07C160">{{ surveyForm.name }}</span><br>
        <span color="rgba(193,255,182,.31)" text-color="#07c160" style="font-size: 60%">{{ surveyForm.activityName }}</span>
        <van-tag v-if="surveyForm.type == 0">未填写</van-tag>
        <van-tag v-if="surveyForm.type == 1">已填写</van-tag>
      </div>
    </van-cell>
  </van-cell-group>
<!--  <van-card style="background-color: white; margin-top: 0">-->
<!--    <div slot="thumb" style="width: 35vw">-->
<!--      <van-image width="100%" height="5rem" radius="1" fit="cover" :src="ossImageUrl(orderForm.bannerImage)" class="box-shadow"/>-->
<!--    </div>-->
<!--  </van-card>-->
</template>




<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Cell, CellGroup, Tag, Icon, Collapse, CollapseItem, Card } from 'vant';
Vue.use(Cell).use(CellGroup).use(Tag).use(Icon).use(Collapse).use(CollapseItem).use(Card);

@Component
export default class SurveyCard extends Vue {
  @Prop() public surveyForm!: any;



}

</script>


<style>
  .org-name {
    position: absolute;
    top: 50%;
  }
  .survey-card {
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>


<template>
  <van-cell>
    <div class="survey-card">
      <span style="font-size: 110%; font-weight: bolder;" color="#07C160">{{ surveyForm.name }}</span><br>
      <span color="rgba(193,255,182,.31)" text-color="#07c160" style="font-size: 60%;">{{ surveyForm.activityName }}</span><br>
      <span v-if="surveyForm.type == 1" style="font-size: 0.3em; color: #07c160">已填写</span>
      <span v-if="surveyForm.type == 0" style="font-size: 0.3em;">未填写</span>
      <van-icon @click="toSurveyDetail(surveyForm.id)" v-if="surveyForm.type == 0" color="#07C160" name="edit" size="25px" style="position: relative; bottom: 23px; float: right; right: 6px;"/>
    </div>
  </van-cell>
</template>




<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Cell, CellGroup, Tag, Icon, Card } from 'vant';
Vue.use(Cell).use(CellGroup).use(Tag).use(Icon).use(Card);

@Component
export default class SurveyCard extends Vue {
  @Prop() public surveyForm!: any;

  private toSurveyDetail(surveyId: any) {
    window.location.href = `/mine/survey/detail/${surveyId}`;
  }



}

</script>


<style>
  .org-name {
    position: absolute;
    top: 50%;
  }
  .survey-card {
    padding-top: -5px;
    padding-bottom: -5px;
  }
</style>


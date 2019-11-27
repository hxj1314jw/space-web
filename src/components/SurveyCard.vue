<template>
  <van-cell style="padding: 3px 6px; margin-bottom: 5px;">
    <div class="survey-card">
      <div v-if="surveyForm.type == 1">
        <span style="font-size: 110%; font-weight: bolder;" color="#07C160">{{ surveyForm.name }}</span>
        <van-tag color="rgba(193,255,182,.31)" text-color="#07c160" style="margin-left: 8px;">已填写</van-tag><br>
      </div>
      <div v-if="surveyForm.type == 0">
        <span style="font-size: 110%; font-weight: bolder;" color="#07C160">{{ surveyForm.name }}</span>
        <van-tag color="rgba(193,255,182,.31)" text-color="#07c160" style="margin-left: 8px;">未填写</van-tag><br>
      </div>
      <span style="font-size: small;">{{ surveyForm.activityName }}</span>
      <van-icon @click="toSurveyDetail(surveyForm.id)" v-if="surveyForm.type == 0" color="#07C160" name="edit" size="20px" style="position: relative; bottom: 10px; float: right; right: 6px;"/>
    </div>
  </van-cell>
</template>




<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Cell, Tag, Icon } from 'vant';
Vue.use(Cell).use(Tag).use(Icon);

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


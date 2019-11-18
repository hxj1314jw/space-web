<template>
  <div>
    <span style="font-size:20px; margin: 600px 20px 10px;">{{ surveyName }}</span><br>
    <span style="font-size:10px; margin: 15px 20px 10px;" v-html="surveyContent"></span>

    <div class="question-card" v-for="(question, index) in questList">
      <span>{{ index + 1 }}.{{ question.questName }}</span><br>

      <template v-if="question.questType == 1" style="margin: 20px">
        <div v-for="(answer, i) in question.answers">
          <van-radio-group v-model="objStatus[index].radio" @change="change">
            <van-radio :name="answer.id + '//' + answer.answerName + '//' + index">{{ answer.answerName }}</van-radio>
          </van-radio-group>
        </div>
      </template>

      <template v-if="question.questType == 3" style="margin: 60px">
        <van-field v-model="objStatus[index].content" placeholder="请输入答案" :input="content(index)"/>
      </template>

    </div>

    <van-button type="primary" @click="submit()">完成</van-button>

  </div>
</template>


<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getSurveyInfo, addSurvey } from '@/api/survey';
  import { RadioGroup, Radio, Button, Field } from 'vant';
  Vue.use(RadioGroup).use(Radio).use(Button).use(Field);

  @Component({
    components: {}
  })
  export default class SurveyDetail extends Vue {
    public objStatus: any = [];
    public surveyName: any = '';
    public surveyContent: any = '';
    public questList: any = [];
    public submitList: any = [];
    // public submitObj: any = {
    //   questId: '',
    //   questName: '',
    //   answerId: '',
    //   answerContent: '',
    // };

    public created() {
      this.getSurveyInfo();
    }

    private content(index: any) {
      // 主观题
      this.submitList[index].answercontent = this.objStatus[index].content;
      // console.log(this.submitList[index].answercontent);
    }

    private change(value: any) {
      // 单选题
      const arr = value.split('//');
      this.submitList[arr[2]].answerId = arr[0];
      this.submitList[arr[2]].answerContent = arr[1];
    }

    private submit() {
      // 提交
      addSurvey({
        surveyId: this.$route.params.id,
        questions: this.submitList,
      });
    }

    private getSurveyInfo() {
      getSurveyInfo({id: this.$route.params.id}).then((res: any) => {
        const vm = this;
        vm.questList = res.data.data.questions;
        vm.surveyName = res.data.data.name;
        vm.surveyContent = res.data.data.content;
        for (let i = 0; i < vm.questList.length; i++) {
          vm.submitList.push({
            questId: vm.questList[i].id,
            questName: vm.questList[i].questName,
            answerId: '',
            answerContent: '',
          });
          vm.objStatus.push({
            radio: '',
            content: '',
          });
        }
      });
    }


  }
</script>



<style>
.question-card {
  margin: 10px;
}
</style>

<template>
  <div style="background-color: #fff; width: 100vw">
    <van-image v-if="surveyImage" style="margin: 0; padding: 0" width="100%" height="230" :src="ossImageUrl(surveyImage)"/>
    <van-image v-if="!surveyImage" style="margin: 0; padding: 0" width="100%" height="230" :src="require('@/assets/survey.jpg')"/>
    <div style="padding: 5px 20px;">
      <div class="survey-title">
        <span style="font-size:20px; padding-top: 60px;">{{ surveyName }}</span><br>
      </div>
      <!--    <span style="font-size:10px; margin: 15px 20px 10px;" v-html="surveyContent"></span>-->

      <div class="question-card" v-for="(question, index) in questList">
        <div class="questtitle-div" v-if="question.questType == 1" slot="header">
          <span class="quest-title">{{ question.questName }}(单选)</span><br>
        </div>
        <div class="questtitle-div" v-if="question.questType == 2" slot="header">
          <span class="quest-title">{{ question.questName }}(多选)</span><br>
        </div>
        <div class="questtitle-div" v-if="question.questType == 3" slot="header">
          <span class="quest-title">{{ question.questName }}</span><br>
        </div>

        <template v-if="question.questType == 1">
          <div v-for="(answer, i) in question.answers">
            <van-radio-group v-model="objStatus[index].radio" @change="change">
              <div v-if="answer.answerType == 1 && submitList[index].answerId == answer.id" class="checked-style" clickable>
                <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px; padding: 7px 0 5px 9px;" icon-size="17px" checked-color="#07C160">{{ answer.answerName }}</van-radio>
              </div>
              <div v-if="answer.answerType == 1 && submitList[index].answerId !== answer.id" class="unchecked-style" clickable>
                <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px; padding: 7px 0 5px 9px;" icon-size="17px" checked-color="#07C160">{{ answer.answerName }}</van-radio>
              </div>

              <div v-if="answer.answerType == 2 && submitList[index].answerId !== answer.id" class="uchecked-other-style" clickable>
                <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px; padding: 7px 0 5px 9px;" icon-size="17px" checked-color="#07C160">
                  <span>其它</span>
                </van-radio>
              </div>

              <div v-if="answer.answerType == 2 && submitList[index].answerId == answer.id" class="other-style" clickable>
                <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px; padding: 7px 0 5px 9px;" icon-size="17px" checked-color="#07C160">
                  <span>其它</span>
                </van-radio>
                <van-field
                  v-if="answer.answerType == 2"
                  v-model="question.answers[i].answerName"
                  rows="1"
                  placeholder="请输入你的答案"
                  type="textarea"
                  autosize
                  maxlength="30"
                  style="padding: 7px 7px; font-size: 15px; border-radius: 0 5px 0 5px;">
                </van-field>
              </div>

            </van-radio-group>
          </div>
        </template>

        <div v-if="question.questType == 3 && objStatus[index].ischecked == true" style="border: 1px solid #07C160; border-radius: 5px;">
          <van-field
            v-model="objStatus[index].content"
            @focus="focus(index)"
            @blur="blur(index)"
            rows="2"
            placeholder="请输入答案"
            :input="content(index)"
            type="textarea"
            autosize
            style="padding: 6px 6px; font-size: 15px; border-radius: 5px;"
            maxlength="1000"/>
        </div>

        <div v-if="question.questType == 3 && objStatus[index].ischecked == false" style="border: 1px solid #E7FAE2; border-radius: 5px;">
          <van-field
            v-model="objStatus[index].content"
            @focus="focus(index)"
            @blur="blur(index)"
            rows="2"
            placeholder="请输入答案"
            :input="content(index)"
            type="textarea"
            autosize
            style="padding: 6px 6px; font-size: 15px; border-radius: 5px;"
            maxlength="1000"/>
        </div>

        <template v-if="question.questType == 2">
          <div v-for="(answer, i) in question.answers">
            <van-checkbox-group v-model="result" @change="checkbox">
              <div>
                <van-checkbox :name="answer" style="font-size: 15px; padding: 7px 0 5px 9px;" icon-size="17px" checked-color="#07C160" shape="square">{{ answer.answerName }}</van-checkbox>
              </div>
            </van-checkbox-group>
          </div>
        </template>



      </div>

        <van-button
          type="primary"
          @click="submit()"
          style="margin: 30px 0; width: 100%;"
        >填写完了</van-button>

    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getSurveyInfo, addSurvey } from '@/api/survey';
  import { RadioGroup, Radio, Button, Field, Cell, CellGroup, Popup, Image, Checkbox, CheckboxGroup } from 'vant';
  Vue.use(RadioGroup).use(Radio).use(Button).use(Field).use(Cell).use(CellGroup).use(Popup).use(Image).use(Checkbox).use(CheckboxGroup);

  @Component({
    components: {}
  })
  export default class SurveyDetail extends Vue {
    public objStatus: any = [];
    public result: any = [];
    public answerChanger: any = false;
    public surveyImage: any = '';
    public surveyName: any = '';
    public surveyContent: any = '';
    public questList: any = [];
    public submitList: any = [];

    public created() {
      this.getSurveyInfo();
    }

    private content(index: any) {
      // 主观题
      this.submitList[index].answerContent = this.objStatus[index].content;
    }

    private change(value: any) {
      // 单选题
      const arr = value.split('//');
      this.submitList[arr[2]].answerId = arr[0];
      this.submitList[arr[2]].answerContent = arr[1];
    }

    private checkbox(value: any) {
      // console.log(this);
    }

    private openChanger() {
      this.answerChanger = true;
    }

    private focus(index: any) {
      this.objStatus[index].ischecked = true;
    }

    private blur(index: any) {
      this.objStatus[index].ischecked = false;
    }

    private submit() {
      // 提交
      for (const item of this.result) {
        this.submitList.push({
          questId: item.questId,
          questName: item.questName,
          answerId: item.id,
          answerContent: item.answerName,
        });
      }
      addSurvey({
        surveyId: this.$route.params.id,
        questions: this.submitList,
      }).then(() => {
        this.$router.push('/mine/survey');
      });
    }

    private getSurveyInfo() {
      getSurveyInfo({id: this.$route.params.id}).then((res: any) => {
        const vm = this;
        vm.questList = res.data.data.questions;
        vm.surveyName = res.data.data.name;
        vm.surveyContent = res.data.data.content;
        vm.surveyImage = res.data.data.image;
        for (const item of vm.questList) {
          vm.submitList.push({
            questId: item.id,
            questName: item.questName,
            answerId: '',
            answerContent: '',
            checkboxResult: [],
          });
          vm.objStatus.push({
            radio: '',
            content: '',
            ischecked: false,
          });
        }
      });
    }


  }
</script>



<style>
.question-card {

}
.survey-title {
  margin: 10px 5px 20px;
}
.questtitle-div {
  margin: 13px 5px 10px;
}
.quest-title {
  font-size: 100%;
  width: 97%;
  height: 19px;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quest-style {
  font-size: 15px;
  padding: 5px 0;
}
.unchecked-style {
  height: 35px;
  border: 1px solid #E7FAE2;
  border-radius: 5px;
  margin-top: 5px;
}
.checked-style {
  background-color: rgba(193,255,182,.31);
  height: 35px;
  border: 1px solid #07C160;
  border-radius: 5px;
  margin-top: 5px;
}
.other-style {
  background-color: rgba(193,255,182,.31);
  height: 72px;
  border: 1px solid #07C160;
  border-radius: 5px;
  margin-top: 5px;
}
.uchecked-other-style {
  height: 35px;
  border: 1px solid #E7FAE2;
  border-radius: 5px;
  margin-top: 5px;
}

</style>

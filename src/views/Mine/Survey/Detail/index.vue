<template>
  <div><!--style="position: relative; top: 0; bottom: 0; width: 100vw; background-color: #fff; height: 100vh;"-->
    <van-image v-if="surveyImage" style="margin: 0; padding: 0" width="100%" height="230" :src="ossImageUrl(surveyImage)"/>
    <van-image v-if="!surveyImage" style="margin: 0; padding: 0" width="100%" height="230" :src="require('@/assets/survey.jpg')"/>
    <div style="padding: 5px 10px;">
      <div class="survey-title">
        <span style="font-size:20px; font-weight: bolder; padding-top: 60px">{{ surveyName }}</span><br>
      </div>
      <!--    <span style="font-size:10px; margin: 15px 20px 10px;" v-html="surveyContent"></span>-->

      <div class="question-card" v-for="(question, index) in questList">
        <div class="questtitle-div" slot="header">
          <span class="quest-title">{{ question.questName }}</span><br>
        </div>

        <template v-if="question.questType == 1">
          <div v-for="(answer, i) in question.answers">
            <van-radio-group v-model="objStatus[index].radio" @change="change">
              <van-cell-group border>
                <van-cell v-if="answer.answerType == 1" class="cell-style" clickable>
                  <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px;" icon-size="17px" checked-color="#07C160">{{ answer.answerName }}</van-radio>
                </van-cell>
<!--                <van-card v-if="answer.answerType == 1" class="cell-style">-->
<!--                  <template>-->
<!--                    <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px;" icon-size="17px" checked-color="#07C160">{{ answer.answerName }}</van-radio>-->
<!--                  </template>-->
<!--                </van-card>-->
                <template v-if="answer.answerType == 2">
                  <van-cell class="cell-style" clickable @click="openChanger">
                    <van-radio :name="answer.id + '//' + answer.answerName + '//' + index" style="font-size: 15px;" icon-size="17px" checked-color="#07C160">
                      <span v-if="answer.answerName.length == 0">其它</span>
                      <span v-if="answer.answerName.length !== 0">{{ answer.answerName }}(其他)</span>
                    </van-radio>
                  </van-cell>
                  <van-field
                    v-if="answer.answerType == 2"
                    v-model="question.answers[i].answerName"
                    rows="1"
                    placeholder="请输入你的答案"
                    type="textarea"
                    autosize
                    maxlength="30"
                    style="padding: 7px 7px; font-size: 15px;">
                    <!--                <van-button slot="button" size="small" type="primary">确认</van-button>&lt;!&ndash;@click="editAnswerDone(answer)"&ndash;&gt;-->
                  </van-field>
                </template>
              </van-cell-group>
            </van-radio-group>
          </div>
        </template>

        <template v-if="question.questType == 3">
          <van-field
            v-model="objStatus[index].content"
            rows="2"
            placeholder="请输入答案"
            :input="content(index)"
            type="textarea"
            autosize
            style="padding: 7px 7px; font-size: 15px;"
            show-word-limit
            maxlength="1000"/>
        </template>
      </div>

      <van-button
              type="primary"
              @click="submit()"
              style="margin: 30px 0; width: 95vw; margin-left: 2.5vw"
      >填写完了</van-button>
    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getSurveyInfo, addSurvey } from '@/api/survey';
  import { RadioGroup, Radio, Button, Field, Cell, CellGroup, Popup, Image, Card } from 'vant';
  Vue.use(RadioGroup).use(Radio).use(Button).use(Field).use(Cell).use(CellGroup).use(Popup).use(Image).use(Card);

  @Component({
    components: {}
  })
  export default class SurveyDetail extends Vue {
    public objStatus: any = [];
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
      // console.log(this.submitList[index].answercontent);
    }

    private change(value: any) {
      // 单选题
      const arr = value.split('//');
      this.submitList[arr[2]].answerId = arr[0];
      this.submitList[arr[2]].answerContent = arr[1];
    }

    private openChanger() {
      this.answerChanger = true;
    }

    private submit() {
      // 提交
      console.log(this.submitList);
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
        vm.surveyImage = res.data.data.image;
        for (const item of vm.questList) {
          vm.submitList.push({
            questId: item.id,
            questName: item.questName,
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

}
.survey-title {
  margin: 15px 5px;
}
.questtitle-div {
  margin: 13px 5px 3px;
}
.quest-title {
  font-size: 100%;
  width: 97%;
  height: 19px;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  bottom: 100px;
}
.quest-style {
  font-size: 15px;
  padding: 5px 0;
}
.cell-style {
  background-color: #f7f2f2;
  height: 35px;
  padding: 8px 0 5px 5px;
  border: 1px solid #07C160;
  border-radius: 6px;
  margin-top: 3px;
}
</style>

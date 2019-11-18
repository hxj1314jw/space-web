<template>
  <div>
    <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div style="margin-top: 60px;">
        <template v-for="(survey, index) in surveyList">
          <SurveyCard :key="index" :surveyForm="survey"/>
          <div style="position: relative; bottom: 50px; float: right; right: 10px;">
            <van-icon @click="toSurveyDetail(survey.id)" color="#07C160" name="edit" size="20px" style="margin: 0 5px;"/>
          </div>
        </template>
      </div>
    </van-list>
  </div>
</template>


<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { getUserSurvey } from '@/api/survey';
  import SurveyCard from '@/components/SurveyCard.vue';
  import { Tab, Tabs, List } from 'vant';
  Vue.use(Tab).use(Tabs).use(List);

  @Component({
    components: {
      SurveyCard
    }
  })

  export default class MineSurvey extends Vue {
    public activeName: number = 0;
    public surveyList: any = [];
    public loading: boolean = false;
    public currentPage: number = 1;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public total: number = 0;
    public finished: boolean = false;

    public created() {
      this.getUserSurvey();
    }

    private async getUserSurvey() {
      const vm: any = this;
      if (this.currentPage === 1) {
        vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
        });
      }
      const res = await getUserSurvey({
        page: this.currentPage,
        size: this.size,
      });
      this.loading = false;
      for (const item of res.data.data.rows) {
        this.surveyList.push(item);
      }
      this.total = Number(res.data.data.total);
      if (this.surveyList.length < this.size || this.surveyList.length === this.total) {
        this.finished = true;
      }
      vm.$toast.clear();
    }



    private onLoad() {
      this.loading = true;
      this.currentPage++;
      this.getUserSurvey();
    }

    private toSurveyDetail(surveyId: any) {
      this.$router.push(`/mine/survey/detail/${surveyId}`);
    }
  }

</script>


<style>
  .org-name {
    position: absolute;
    top: 50%;
    transform: translate(15px, -50%);
  }
</style>

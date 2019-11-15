<template>
  <div>
    <van-tabs v-model="activeName">
      <van-tab title="未填写" :name="0">
        <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(survey, index) in surveyList">
              <SurveyCard :key="index" :surveyForm="survey"/>
            </template>
          </div>
        </van-list>
      </van-tab>


      <van-tab title="已填写" :name="1">
        <SurveyCard/>
      </van-tab>
    </van-tabs>
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
        type: this.activeName
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
  }

</script>


<style>
  .org-name {
    position: absolute;
    top: 50%;
    transform: translate(15px, -50%);
  }
</style>

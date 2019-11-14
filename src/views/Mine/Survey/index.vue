<template>
  <div>
    <van-tabs v-model="activeName">
      <van-tab title="未填写" name="notdone">
        <template v-for="(hhh, index) in surveyList">
          <SurveyCard :key="index" :surveyForm="hhh"/>
        </template>
      </van-tab>


      <van-tab title="已填写" name="done">
        <SurveyCard/>
      </van-tab>
    </van-tabs>
  </div>
</template>




<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import {} from '@/api/survey';
  import SurveyCard from '@/components/SurveyCard.vue';
  import { Tab, Tabs } from 'vant';
  Vue.use(Tab).use(Tabs);

  @Component({
    components: {
      SurveyCard
    }
  })

  export default class MineSurvey extends Vue {
    public activeName: string = 'done';
    public surveyList: any = [ 'sss', 'gogogo' ];


  }

</script>


<style>
  .org-name {
    position: absolute;
    top: 50%;
    transform: translate(15px, -50%);
  }
</style>

<template>
  <div>
    <span>哈哈哈</span>
    <div>
      <van-radio-group v-model="radio">
        <van-radio name="1">单选框 1</van-radio>
        <van-radio name="2">单选框 2</van-radio>
      </van-radio-group>
    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getSurveyInfo } from '@/api/survey';
  import { RadioGroup, Radio } from 'vant';
  Vue.use(RadioGroup).use(Radio);

  @Component({
    components: {}
  })
  export default class SurveyDetail extends Vue {
    public radio: string = '1';
    public questList: any = [];

    public created() {
      this.getSurveyInfo();
    }

    private getSurveyInfo() {
      console.log(this.$route.params.id);
      getSurveyInfo(this.$route.params.id).then((res: any) => {
        console.log(res);
      });
    }


  }
</script>



<style>

</style>

<template>
  <van-cell-group style="margin-top: 10px;">
    <van-cell>
      <span>
        {{ surveyForm }}
        <van-tag color="rgba(193,255,182,.31)" text-color="#07c160">活动1</van-tag>
      </span>
    </van-cell>
  </van-cell-group>
</template>




<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Cell, CellGroup, Button, Tag, Grid, GridItem, Uploader } from 'vant';
Vue.use(Cell).use(CellGroup).use(Button).use(Tag).use(Grid).use(GridItem).use(Uploader);

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
</style>


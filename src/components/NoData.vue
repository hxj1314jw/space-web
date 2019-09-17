<template>
  <div style="text-align: center; margin-top: 90px;">
    <img width="120px" height="94px" src="../assets/icon/no-data.png" />
    <div style="margin-top: 10px;">
      <span style="color: #999999">暂无数据</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NoData extends Vue {}
</script>

<template>
  <van-icon @click="toAddActivity()" name="add" color="#00B261" size="50" style="position: fixed; bottom: 16px; right: 10px;"/>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { Icon } from 'vant';
  Vue.use(Icon);

  @Component({})

  export default class AddActivity extends Vue {
    private toAddActivity() {
      this.$router.push('/mine/activity/edit');
    }
  }
</script>

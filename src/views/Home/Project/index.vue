<template>
  <div>
      <van-image style="margin: 0; padding: 0" width="100%" height="230" fit="cover" :src="ossImageUrl(projectForm.banner)" />
      <van-cell-group>
        <van-cell title="作者: " :value="projectForm.author">
          <van-icon slot="icon" name="user-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
        </van-cell>
        <van-cell title="编辑时间: " :value="projectForm.updateDate">
          <van-icon slot="icon" name="clock-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
        </van-cell>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px; ">
        <van-cell style="padding: 15px; margin: 0;">
          <span style="color: #666666" v-html="projectForm.content"/>
        </van-cell>
      </van-cell-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getProjectDetail } from '@/api/home';

import { Image, Toast, Cell, CellGroup, Icon } from 'vant';
Vue.use(Image).use(Toast).use(Cell).use(CellGroup).use(Icon);

@Component({
  components: {}
})
export default class ProjectDetail extends Vue {
  public projectForm: any = {};

  public created() {
    this.fetchProject();
  }

  private fetchProject() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    getProjectDetail({id: this.$route.params.id}).then((res: any) => {
      this.projectForm = res.data.data;
      Toast.clear();
    });
  }
}
</script>

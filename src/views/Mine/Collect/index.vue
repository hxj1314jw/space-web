<template>
  <div>
    <!-- <van-search
      style="flex: 1;"
      v-model="search"
      placeholder="请输入关键字搜索"
      show-action
      shape="round"
      @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search> -->

    <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
      <van-tab title="活动" name="activity">
        <div v-if="activityList.length !== 0" style="margin-top: -10px;">
          <template v-for="(activity, index) in activityList">
            <van-swipe-cell :key="index" style="padding: 0; margin: 0">
              <template slot="right">
                <van-button square type="danger" icon="delete" text="删除" style="height: 100%" @click="deleteCollect(index, activity.id)"/>
              </template>
              <ActivityCard :activityForm="activity"/>
            </van-swipe-cell>
          </template>
        </div>
        <div v-else style="text-align: center; margin-top: 90px;">
          <img width="120px" height="94px" src="../../../assets/icon/no-data.png" />
          <div style="margin-top: 10px;">
            <span style="color: #999999">暂无数据</span>
          </div>
        </div>
      </van-tab>
      <van-tab title="空间" name="space">
        <div v-if="spaceList.length !== 0">
          <template v-for="(space, index) in spaceList">
            <SpaceCard :key="index" :spaceForm="space"/>
          </template>
        </div>
        <div v-else style="text-align: center; margin-top: 90px;">
          <img width="120px" height="94px" src="../../../assets/icon/no-data.png" />
          <div style="margin-top: 10px;">
            <span style="color: #999999">暂无数据</span>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import SpaceCard from '@/components/SpaceCard.vue';
  import ActivityCard from '@/components/ActivityCard.vue';
  import { getCollectList, deleteCollectActivity } from '@/api/activity';
  import { getSpaceList } from '@/api/space';
  import moment from 'moment';
  import { Search, Tab, Tabs, List, SwipeCell, Button, Dialog } from 'vant';
  Vue.use(Search).use(Tab).use(Tabs).use(List).use(SwipeCell).use(Button).use(Dialog);

  @Component({
    components: {
      SpaceCard,
      ActivityCard
    }
  })

  export default class Collect extends Vue {
    public search: string = '';
    public activityList: any = [];
    public spaceList: any = [];
    public activeName: string = 'activity';
    public size: number = Math.ceil(window.screen.availHeight / 100);

    public created() {
      this.fetchActivity();
    }

    private onClick(value: any) {
      switch (value) {
        case 'space':
          this.onSearch();
          break;
        case 'activity':
          this.onSearch();
          break;
      }
    }

    private async fetchSpace() {
      const vm: any = this;
      vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
      });
      const res = await getCollectList({
        type: 1
      });
      for (const item of res.data.data) {
        this.spaceList.push({
          productName: item.productName,
          remark: item.remark,
          bannerImage: item.bannerImage,
          price : item.price,
          id: item.productId,
          tags: item.tags,
          hotStatus: item.hotStatus,
          address: item.address,
          numberOfPeople: item.numberOfPeople,
          dimensions: item.dimensions,
          chargeMethod: item.chargeMethod
        });
      }
      vm.$toast.clear();
    }

    private async fetchActivity() {
      const vm: any = this;
      vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
      });
      const res = await getCollectList({
        type: 2
      });
      for (const item of res.data.data) {
        this.activityList.push({
          name: item.productName,
          publisherName: item.publisherName,
          image: item.bannerImage,
          price : item.price,
          id: item.productId,
          tags: item.tags,
          hotStatus: item.hotStatus,
          activityName: item.activityName
        });
      }
      vm.$toast.clear();
    }

    private onSearch() {
      this.initList();
      switch (this.activeName) {
        case 'space':
          this.fetchSpace();
          break;
        case 'activity':
          this.fetchActivity();
          break;
      }
    }

    private initList() {
      this.activityList = [];
      this.spaceList = [];
    }

    private deleteCollect(deleteNum: number, activityId: any) {
      Dialog.confirm({
        message: '确认删除收藏？',
        confirmButtonColor: '#00B261'
      }).then(() => {
        // on confirm
        deleteCollectActivity({
          productId: activityId,
          type: 2
        }).then(() => {
          this.activityList.splice(deleteNum, 1);
        });
      }).catch(() => {
        // on cancel
      });
    }
  }
</script>

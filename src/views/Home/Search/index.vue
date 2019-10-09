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
        <van-list :loading="loadingActivity" :immediate-check="false" :finished="finishedActivity" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(activity, index) in activityList">
              <ActivityCard :key="index" :activityForm="activity"/>
            </template>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="空间" name="space">
        <van-list :loading="loadingSpace" :immediate-check="false" :finished="finishedSpace" finished-text="没有更多了" @load="onLoad">
          <div>
            <template v-for="(space, index) in spaceList">
              <SpaceCard :key="index" :spaceForm="space"/>
            </template>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import SpaceCard from '@/components/SpaceCard.vue';
  import ActivityCard from '@/components/ActivityCard.vue';
  import { getActivityList } from '@/api/activity';
  import { getSpaceList } from '@/api/space';
  import moment from 'moment';
  import { Search, Tab, Tabs, List } from 'vant';
  Vue.use(Search).use(Tab).use(Tabs).use(List);

  @Component({
    components: {
      SpaceCard,
      ActivityCard
    }
  })

  export default class SearchResult extends Vue {
    public search: any;
    public activityList: any = [];
    public spaceList: any = [];
    public activeName: string = 'activity';
    public currentPage: number = 1;
    public totalActivity: number = 0;
    public totalSpace: number = 0;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public loadingActivity: boolean = false;
    public finishedActivity: boolean = false;
    public loadingSpace: boolean = false;
    public finishedSpace: boolean = false;

    @Prop() public hotStatus: any;

    public created() {
      this.search = this.$route.query.search;
      this.fetchActivity();
    }

    private onClick(value: any) {
      switch (value) {
        case 'space':
          this.currentPage = 1;
          this.onSearch();
          break;
        case 'activity':
          this.currentPage = 1;
          this.onSearch();
          break;
      }
    }

    private async fetchSpace() {
      const vm: any = this;
      if (this.currentPage === 1) {
        vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
        });
      }
      const res = await getSpaceList({
        page: this.currentPage,
        size: this.size,
        searchName: this.search,
        hotStatus: this.hotStatus
      });
      console.log(this.spaceList);
      this.loadingSpace = false;
      for (const item of res.data.data.rows) {
        this.spaceList.push(item);
      }
      this.totalSpace = Number(res.data.data.total);
      if (this.spaceList.length < this.size || this.spaceList.length === this.totalSpace) {
        this.finishedSpace = true;
      }
      vm.$toast.clear();
    }

    private async fetchActivity() {
      const vm: any = this;
      if (this.currentPage === 1) {
        vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
        });
      }
      const res = await getActivityList({
        page: this.currentPage,
        size: this.size,
        searchName: this.search,
        hotStatus: this.hotStatus
      });
      this.loadingActivity = false;
      for (const item of res.data.data.rows) {
        this.activityList.push(item);
      }
      this.totalActivity = Number(res.data.data.total);
      if (this.activityList.length < this.size || this.activityList.length === this.totalActivity) {
        this.finishedActivity = true;
      }
      vm.$toast.clear();
    }

    private onLoad() {
      this.loadingSpace = true;
      this.loadingActivity = true;
      this.currentPage++;
      switch (this.activeName) {
        case 'space':
          this.fetchSpace();
          break;
        case 'activity':
          this.fetchActivity();
          break;
      }
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
      this.currentPage = 1;
      this.totalActivity = 0;
      this.totalSpace = 0;
      this.loadingSpace = false;
      this.loadingActivity = false;
      this.finishedActivity = false;
      this.finishedSpace = false;
      this.activityList = [];
      this.spaceList = [];
    }
  }
</script>

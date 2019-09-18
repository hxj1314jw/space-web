<template>
  <div>
    <van-search
      style="flex: 1;"
      v-model="search"
      placeholder="请输入关键字搜索"
      show-action
      shape="round"
      @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div style="margin-top: -10px;">
        <template v-for="(activity, index) in activityList">
          <ActivityCard :key="index" :activityForm="activity"/>
        </template>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import ActivityCard from '@/components/ActivityCard.vue';
  import { getActivityList } from '@/api/activity';
  import moment from 'moment';
  import { Search, Tab, Tabs, List } from 'vant';
  Vue.use(Search).use(Tab).use(Tabs).use(List);

  @Component({
    components: {
      ActivityCard
    }
  })

  export default class SearchResult extends Vue {
    public search: any;
    public activityList: any = [];
    public activeName: string = 'activity';
    public currentPage: number = 1;
    public total: number = 0;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public loading: boolean = false;
    public finished: boolean = false;

    public created() {
      this.search = this.$route.query.search;
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
        activityTypeId: this.$route.params.id
      });
      this.loading = false;
      for (const item of res.data.data.rows) {
        this.activityList.push(item);
      }
      this.total = Number(res.data.data.total);
      if (this.activityList.length < this.size || this.activityList.length === this.total) {
        this.finished = true;
      }
      document.title = this.activityList[0].activityName;
      vm.$toast.clear();
    }

    private onLoad() {
      this.loading = true;
      this.currentPage++;
      this.fetchActivity();
    }

    private onSearch() {
      this.initList();
      this.fetchActivity();
    }

    private initList() {
      this.currentPage = 1;
      this.total = 0;
      this.loading = false;
      this.finished = false;
      this.activityList = [];
    }
  }
</script>

<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
      <van-tab title="全部" name="all">
        <van-list v-if="activityList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(activity, index) in activityList">
              <ActivityCard :key="index" :activityForm="activity"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="进行中" name="ing">
        <van-list v-if="activityList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(activity, index) in activityList">
              <ActivityCard :key="index" :activityForm="activity"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
      <van-tab title="草稿箱" name="draft">
        <van-list v-if="activityList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div style="margin-top: -10px;">
            <template v-for="(activity, index) in activityList">
              <ActivityCard :key="index" :activityForm="activity"/>
            </template>
          </div>
        </van-list>
        <NoData v-else/>
      </van-tab>
    </van-tabs>

    <AddActivity />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import ActivityCard from '@/components/ActivityCard.vue';
  import NoData from '@/components/NoData.vue';
  import AddActivity from '@/components/AddActivity.vue';
  import { getMineActivity } from '@/api/mine';
  import moment from 'moment';
  import { Search, Tab, Tabs, List } from 'vant';
  Vue.use(Search).use(Tab).use(Tabs).use(List);

  @Component({
    components: {
      ActivityCard,
      NoData,
      AddActivity
    }
  })

  export default class MineActivity extends Vue {
    public activityList: any = [];
    public activeName: string = 'all';
    public status: string = '';
    public currentPage: number = 1;
    public total: number = 0;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public loading: boolean = false;
    public finished: boolean = false;

    @Prop() public hotStatus: any;

    public created() {
      this.fetchActivity();
    }

    private onClick(value: any) {
      switch (this.activeName) {
        case 'all':
          break;
        case 'ing':
          this.status = '6';
          break;
        case 'draft':
          this.status = '10';
          break;
      }
      this.initList();
      this.fetchActivity();
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
      const res = await getMineActivity({
        page: this.currentPage,
        size: this.size,
        status: this.status
      });
      this.loading = false;
      for (const item of res.data.data.rows) {
        this.activityList.push(item);
      }
      this.total = Number(res.data.data.total);
      if (this.activityList.length < this.size || this.activityList.length === this.total) {
        this.finished = true;
      }
      vm.$toast.clear();
    }

    private onLoad() {
      this.loading = true;
      this.currentPage++;
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

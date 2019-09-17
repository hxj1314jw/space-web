<template>
  <div  style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
    <van-search
      style="flex: 1;"
      v-model="search"
      placeholder="请输入关键字搜索"
      show-action
      shape="round"
      @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <van-dropdown-menu active-color="#00B261">
      <van-dropdown-item @change="onSearch()" v-model="type" :options="typeOption"/>
      <van-dropdown-item @change="onSearch()" v-model="price" :options="priceOption"/>
      <van-dropdown-item @change="onSearch()" v-model="status" :options="statusOption"/>
    </van-dropdown-menu>

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
  import { Component, Vue } from "vue-property-decorator";
  import ActivityCard from '@/components/ActivityCard.vue';
  import { getActivityList, getActivityTypeList } from '@/api/activity';
  import { Search, DropdownMenu, DropdownItem, List } from 'vant';
  Vue.use(Search).use(DropdownMenu).use(DropdownItem).use(List);

  @Component({
    components: {
      ActivityCard
    }
  })

  export default class Activity extends Vue {
    public search: string = '';
    public type: string = '';
    public status: string = '';
    public price: string = '';
    public activityList: any = [];
    public typeOption: any = [
      {text: '全部类型', value: ""}
    ];
    public priceOption: any = [
      {text: "全部价格", value: ""},
      {text: "免费", value: "0"},
      {text: "收费", value: "1"}
    ];
    public statusOption: any = [
      {text: "全部状态", value: ""},
      {text: "正在进行", value: "0"},
      {text: "已截止", value: "1"}
    ];
    public currentPage: number = 1;
    public total: number = 0;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public loading: boolean = false;
    public finished: boolean = false;

    public created() {
      this.fetchActivityType();
      this.fetchActivity();
    }

    private async fetchActivityType() {
      const res = await getActivityTypeList();
      for (const item of res.data.data) {
        this.typeOption.push({
          text: item.name,
          value: item.id
        });
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
        activityTypeId: this.type,
        isFreeFlag: this.price,
        searchName: this.search
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

    private onSearch() {
      this.activityList = [];
      this.fetchActivity();
    }
  }
</script>

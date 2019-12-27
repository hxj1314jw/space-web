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
      <van-dropdown-item @change="onSearch()" v-model="method" :options="methodOption"/>
    </van-dropdown-menu>

    <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div>
        <template v-for="(space, index) in spaceList">
          <SpaceCard :key="index" :spaceForm="space"/>
        </template>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { getSpaceList } from '@/api/space';
  import SpaceCard from '@/components/SpaceCard.vue';
  import { Search, DropdownMenu, DropdownItem, List } from 'vant';
  Vue.use(Search).use(DropdownMenu).use(DropdownItem).use(List);

  @Component({
    components: {
      SpaceCard
    }
  })

  export default class Space extends Vue {
    public search: string = '';
    public type: string = '';
    public method: string = '';
    public spaceList: any = [];
    public typeOption: any = [
      {text: '全部类型', value: ""},
      {text: '办公室', value: "1"},
      {text: '会议室', value: "2"},
      {text: '固定工位', value: "3"},
      {text: '自由工位', value: "4"},
      {text: '活动空间', value: "5"}
    ];
    public methodOption: any = [
      {text: '全部方式', value: ""},
      {text: '按时缴纳', value: "1"},
      {text: '按日缴纳', value: "2"},
      {text: '按月缴纳', value: "3"},
      {text: '按年缴纳', value: "4"},
    ];
    public currentPage: number = 1;
    public total: number = 0;
    public size: number = Math.ceil(window.screen.availHeight / 200);
    public loading: boolean = false;
    public finished: boolean = false;

    public created() {
      if (this.$route.query.type) {
        this.type = String(this.$route.query.type);
      }
      this.fetchSpace();
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
        type: this.type,
        searchName: this.search,
        chargeMethod: this.method
      });
      this.loading = false;
      for (const item of res.data.data.rows) {
        this.spaceList.push(item);
      }
      this.total = Number(res.data.data.total);
      if (this.spaceList.length < this.size || this.spaceList.length === this.total) {
        this.finished = true;
      }
      vm.$toast.clear();
    }

    private onLoad() {
      this.loading = true;
      this.currentPage++;
      this.fetchSpace();
    }

    private onSearch() {
      this.spaceList = [];
      this.loading = true;
      this.finished = false;
      this.currentPage = 1;
      this.fetchSpace();
    }
  }
</script>

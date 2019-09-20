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

    <div style="margin-top: -10px;">
      <template v-for="(org, index) in orgList">
        <van-swipe-cell :key="index">
          <OrgCard :orgForm="org"/>
          <template slot="right">
            <van-button @click="joinOrg(org.id)" square type="warning" text="加入" style="height: 100%"/>
          </template>
        </van-swipe-cell>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import OrgCard from '@/components/OrgCard.vue';
  import { getOrgList, addOrgMember } from '@/api/organization';
  import { Search, SwipeCell, Button, Toast } from 'vant';
  Vue.use(Search).use(SwipeCell).use(Button).use(Toast);

  @Component({
    components: {
      OrgCard
    }
  })

  export default class JoinOrg extends Vue {
    public search: string = '';
    public orgList: any = [];
    public activeName: string = 'activity';
    public currentPage: number = 1;

    public created() {
      this.fetchOrg();
    }

    private async fetchOrg() {
      const vm: any = this;
      vm.$toast.loading({
        mask: true,
        forbidClick: true,
        message: '加载中...'
      });
      const res = await getOrgList({
        name: this.search
      });
      this.orgList = res.data.data;
      vm.$toast.clear();
    }

    private onSearch() {
      this.orgList = [];
      this.fetchOrg();
    }

    private joinOrg(id: any) {
      addOrgMember({id}).then(() => {
        Toast({
          message: '申请成功',
          icon: 'success',
          duration: 1000
        });
      });
    }
  }
</script>

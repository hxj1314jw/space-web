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

    <div v-if="orgList.length !== 0" style="margin-top: -10px;">
      <template v-for="(org, index) in orgList">
        <div :key="index">
          <OrgCard :orgForm="org"/>
            <div style="position: relative; bottom: 30px; float: right; right: 10px;">
              <van-icon @click="joinOrg(org.id)" color="rgb(0, 178, 97)" name="add-o"  size="20px" style="margin: 0 5px;"/>
            </div>
        </div>
      </template>
    </div>
    <NoData v-else/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import OrgCard from '@/components/OrgCard.vue';
  import NoData from '@/components/NoData.vue';
  import { getOrgList, addOrgMember } from '@/api/organization';
  import { Search, Cell, Button, Toast, Icon } from 'vant';
  Vue.use(Search).use(Cell).use(Button).use(Toast).use(Icon);

  @Component({
    components: {
      OrgCard,
      NoData
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

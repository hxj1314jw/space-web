<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
        <van-tab title="我的组织" name="mine">
          <div v-if="orgList.length !== 0" style="margin-top: -10px;">
            <template v-for="(org, index) in orgList">
              <OrgCard :key="index" :orgForm="org"/>
            </template>
          </div>
          <NoData v-else/>
        </van-tab>
        <van-tab title="待审核" name="ing">
          <div v-if="orgList.length !== 0" style="margin-top: -10px;">
            <template v-for="(org, index) in orgList">
              <OrgCard :key="index" :orgForm="org"/>
            </template>
          </div>
          <NoData v-else/>
        </van-tab>
        <van-tab title="已拒绝" name="confuse">
          <div v-if="orgList.length !== 0" style="margin-top: -10px;">
            <template v-for="(org, index) in orgList">
              <OrgCard :key="index" :orgForm="org"/>
            </template>
          </div>
          <NoData v-else/>
        </van-tab>
      </van-tabs>
      <!-- <van-icon @click="toAddOrg()" name="add" color="#00B261" size="50" style="position: fixed; bottom: 66px; right: 10px;"/> -->
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="toJoinOrg()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">加入机构</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import OrgCard from '@/components/OrgCard.vue';
  import NoData from '@/components/NoData.vue';
  import { getMyOrgList } from '@/api/organization';
  import { Button, Icon } from 'vant';
  Vue.use(Button).use(Icon);

  @Component({
    components: {
      OrgCard,
      NoData
    }
  })

  export default class MineOrg extends Vue {
    public search: any;
    public orgList: any = [];
    public activeName: string = 'mine';
    public audit: string = '2';

    public created() {
      this.search = this.$route.query.search;
      this.fetchOrg();
    }

    private onClick(value: any) {
      this.orgList = [];
      switch (value) {
        case 'mine':
          this.audit = '2';
          this.fetchOrg();
          break;
        case 'ing':
          this.audit = '1';
          this.fetchOrg();
          break;
        case 'confuse':
          this.audit = '3';
          this.fetchOrg();
          break;
      }
    }

    private async fetchOrg() {
      const vm: any = this;
      vm.$toast.loading({
        mask: true,
        forbidClick: true,
        message: '加载中...'
      });
      const res = await getMyOrgList({
        audit: this.audit
      });
      this.orgList = res.data.data;
      vm.$toast.clear();
    }

    private toJoinOrg() {
      this.$router.push('/mine/organization/join');
    }

    private toAddOrg() {
      this.$router.push('/mine/organization/edit');
    }
  }
</script>

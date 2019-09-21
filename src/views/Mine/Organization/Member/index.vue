<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
      <van-tab title="机构成员" name="member">
        <div v-if="memberList.length !== 0" style="margin-top: -10px;">
          <template v-for="(member, index) in memberList">
            <UserCard :key="index" :userForm="member"/>
          </template>
        </div>
        <NoData v-else/>
      </van-tab>
      <van-tab title="待审核" name="ing">
        <div v-if="memberList.length !== 0" style="margin-top: -10px;">
          <template v-for="(member, index) in memberList">
            <van-swipe-cell :key="index">
              <UserCard :key="index" :userForm="member"/>
              <template slot="right">
                <van-button @click="addMember(member.contactsId)" square icon="plus" type="primary" text="通过" style="height: 100%"/>
                <van-button @click="delMember(member.contactsId)" square icon="delete" type="danger" text="忽略" style="height: 100%"/>
              </template>
            </van-swipe-cell>
          </template>
        </div>
        <NoData v-else/>
      </van-tab>
      <van-tab title="已拒绝" name="confuse">
        <div v-if="memberList.length !== 0" style="margin-top: -10px;">
          <template v-for="(member, index) in memberList">
            <UserCard :key="index" :userForm="member"/>
          </template>
        </div>
        <NoData v-else/>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import UserCard from '@/components/UserCard.vue';
  import NoData from '@/components/NoData.vue';
  import { getOrgMember, agreeOrgMember } from '@/api/organization';
  import { Button, Icon, SwipeCell, Tag, Notify } from 'vant';
  Vue.use(Button).use(Icon).use(SwipeCell).use(Tag).use(Notify);

  @Component({
    components: {
      UserCard,
      NoData
    }
  })

  export default class OrgMember extends Vue {
    public search: any;
    public memberList: any = [];
    public activeName: string = 'member';
    public audit: string = '2';

    public created() {
      this.fetchOrg();
    }

    private onClick(value: any) {
      this.memberList = [];
      switch (value) {
        case 'member':
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
      const res = await getOrgMember({
        audit: this.audit,
        id: this.$route.params.id
      });
      this.memberList = res.data.data;
      vm.$toast.clear();
    }

    private addMember(contactsId: any) {
      agreeOrgMember({contactsId, id: this.$route.params.id}).then(() => {
        this.fetchOrg().then(() => {
          this.activeName = 'member';
        });
      }).catch((err: any) => {
        Notify({ type: 'danger', message: err.response.data.message });
      });
    }

    private delMember(contactsId: any) {
      // del org member
    }
  }
</script>

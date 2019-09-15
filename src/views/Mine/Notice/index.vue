<template>
  <van-list v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <div style="margin-top: -10px;">
      <template v-for="(notice, index) in noticeList">
        <van-swipe-cell :key="index">
          <NoticeCard :noticeForm="notice" />
          <template slot="right">
            <van-button square type="warning" style="height: 100%" icon="flag-o" text="标为未读" @click="unreadMsg(notice.id, index)"/>
            <van-button square type="danger" style="height: 100%" icon="delete" text="删除" @click="delMsg(notice.id)"/>
          </template>
        </van-swipe-cell>
      </template>
    </div>
  </van-list>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getNoticeList, editNotice } from '@/api/mine';
  import NoticeCard from '@/components/NoticeCard.vue';
  import { List, Button, SwipeCell, Dialog } from 'vant';
  Vue.use(List).use(Button).use(SwipeCell).use(Dialog);

  @Component({
    components: {
      NoticeCard
    }
  })

  export default class Notice extends Vue {
    public noticeList: any = [];
    public total: number = 0;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public currentPage: number = 1;
    public loading: boolean = false;
    public finished: boolean = false;

    public created() {
      this.fetchNotice();
    }

    private async fetchNotice() {
      const vm: any = this;
      vm.$toast.loading({
          mask: true,
          forbidClick: true,
          message: '加载中...'
      });
      const res = await getNoticeList({
        page: this.currentPage,
        size: this.size
      });
      this.loading = false;
      for (const item of res.data.data.rows) {
        this.noticeList.push(item);
      }
      this.total = Number(res.data.data.total);
      if (this.noticeList.length < this.size || this.noticeList.length === this.total) {
        this.finished = true;
      }
      vm.$toast.clear();
    }

    private onLoad() {
      this.loading = true;
      this.currentPage++;
      this.fetchNotice();
    }

    private async unreadMsg(id: any, index: number) {
      await editNotice({
        status: 0,
        id
      });
      this.noticeList[index].status = '0';
    }

    private delMsg(id: any) {
      Dialog.confirm({
        message: '确认删除通知？',
        confirmButtonColor: '#00B261'
      }).then(() => {
        editNotice({
          status: 2,
          id
        });
        for (let i = 0; i < this.noticeList.length; i++) {
          if (this.noticeList[i].id === id) {
            this.noticeList.splice(i, 1);
            break;
          }
        }
      }).catch(() => {
        // on cancel
      });
    }
  }
</script>

<template>
  <van-panel style="margin-top: 10px;" @click="toDetail(noticeForm.msgId)">
    <template slot="header">
      <div style="padding: 10px 16px;">
        <div style="display: flex; align-items: center;">
          <span v-if="noticeForm.status === '0'" class="unread"/>
          <span class="notice-title" style="font-size: small">{{ title }}</span>
        </div>
        <span style="font-size: x-small; color: #969799;">
          {{ noticeForm.createTime }}
        </span>
      </div>
    </template>
    <template>
      <div style="padding: 10px 16px; padding-top: 0">
        <span style="font-size: small; color: #999999">
          {{ content }}
        </span>
      </div>
    </template>
  </van-panel>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { editNotice } from '@/api/mine';
import { Panel, List } from 'vant';
Vue.use(Panel).use(List);

@Component
export default class NoticeCard extends Vue {
  public title: string = '';
  public content: string = '';
  @Prop() public noticeForm!: any;

  public created() {
    const contentList = this.noticeForm.content.split('，');
    this.title = contentList[0] + ', ' + contentList[1];
    this.content = this.noticeForm.content;
  }

  private async toDetail(id: any) {
    await editNotice({
      status: 1,
      id: this.noticeForm.id
    });
    switch (this.noticeForm.msgType) {
      case '1':
        this.$router.push(`/mine/reserve/detail/${id}`);
        break;
      case '2':
        this.$router.push(`/mine/activity`);
        break;
      case '4':
        this.$router.push(`/mine/ticket/detail/${id}`);
        break;
    }
  }
}
</script>

<style>
  .notice-title {
    font-weight: bolder;
    width: 97%;
    height: 19px;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical
  }
  .unread {
    width: 4px;
    height: 4px;
    margin-right: 6px;
    background-color: #F76C6C;
    border-radius: 50%;
  }
</style>
<template>
  <div>
    <van-cell style="padding: 0px; margin: 0; position: relative;">
      <van-uploader style="float: left; margin: 10px; margin-left: 15px; margin-bottom: 0;" :before-read="beforeRead" :after-read="afterRead" :preview-image="true">
        <van-image round width="5rem" height="5rem" :src="ossImageUrl(userForm.avatar)" fit="cover"/>
      </van-uploader>
      <span class="user-name">
        {{userForm.name}}<br>
        <span style="color: #999999; font-size: small;">{{ userForm.phone }}</span>
      </span>
      <img width="92px" height="68px" style="float: right;" src="../../assets/icon/userinfo-front.png" />
    </van-cell>

    <van-grid>
      <van-grid-item to="/mine/ticket" icon="paid" text="我的票卷"/>
      <van-grid-item to="/mine/collect" icon="star-o" text="我的收藏"/>
      <van-grid-item to="/mine/notice" icon="comment-o" text="我的通知" :info='msgNum===0?"":msgNum'/>
      <van-grid-item to="/mine/reserve" icon="notes-o" text="我的预约"/>
    </van-grid>

    <van-cell-group style="margin-top: 10px;">
      <van-cell title="我的名片" to="/mine/info" is-link/>
      <van-cell title="我的订单" to="/mine/order" is-link/>
      <van-cell title="我的活动" to="/mine/activity" is-link />
      <van-cell title="我的机构" to="/mine/organization" is-link />
      <!--<van-cell title="我的问卷" to="/mine/survey" is-link />-->
    </van-cell-group>

    <van-button
      type="danger"
      @click="logout()"
      style="margin: 15px 0; width: 95vw; margin-left: 2.5vw"
    >登出</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';
import { getUserInfo } from '@/api/user';
import { updateAvatar, editUserInfo, getMsgNum } from '@/api/mine';
import { Cell, CellGroup, Button, Image, Grid, GridItem, Uploader } from 'vant';
import {setName} from "@/utils/auth";
Vue.use(Cell).use(CellGroup).use(Button).use(Image).use(Grid).use(GridItem).use(Uploader);

@Component({
  components: {}
})
export default class Mine extends Vue {
  public userForm: any = {};

  public msgNum: string = '';

  public created() {
    this.fetchInfo();
  }

  private async fetchInfo() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: "加载中..."
    });
    this.getMsgNum();
    const res: any = await getUserInfo();
    this.userForm = res.data.data;
    setName(this.userForm.name);
    vm.$toast.clear();
  }

  private async getMsgNum() {
    const res: any = await getMsgNum();
    this.msgNum = res.data.data;
    this.$emit('func', this.msgNum);
  }

  private async logout() {
    await UserModule.Logout();
    this.$router.push("/");
  }

  private beforeRead(file: any) {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return true;
    } else {
      return false;
    }
  }

  private async afterRead(file: any) {
    const data = new FormData();
    data.append('file', file.file);
    const res = await updateAvatar(data);
    const url = res.data.data.url;
    await editUserInfo({
      avatar: url,
      id: this.userForm.id
    });
    this.fetchInfo();
  }
}
</script>

<style>
.user-name {
  position: absolute;
  top: 50%;
  transform: translate(15px, -40%);
  font-size: 150%;
}
</style>

<template>
  <div>
    <van-nav-bar v-if="!isWeixin" @click-left="onClickLeft" :left-arrow="isArrow"
      style="font-weight: 700; background-color: #F3F3F3; width: 100vw; position: fixed; top: 0;"
      :title="title"/>
    <van-tabbar v-if="isTabbar" v-model="selected" active-color="#23B36E" safe-area-inset-bottom>
      <van-tabbar-item name="首页" to="/home" icon="home-o" replace>首页</van-tabbar-item>
      <van-tabbar-item name="空间" to="/space" icon="hotel-o" replace>空间</van-tabbar-item>
      <van-tabbar-item name="活动" to="/activity" icon="orders-o" replace>活动</van-tabbar-item>
      <van-tabbar-item name="我的" to="/mine" icon="user-o":info="msgNum ===0?'':msgNum" replace>我的</van-tabbar-item>
    </van-tabbar>
    <div class="router-view" :style="isWeixin ? 'top: 0;' : 'top: 46px;'">
      <router-view @func="getMsgNum"></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import { getZoneId } from '@/utils/zone';
  import { getMsgNum } from '@/api/mine';
  import { getZoneInfo } from '@/api/home';
  import { NavBar, Tabbar, TabbarItem } from 'vant';
  import { getFromUrl, getToUrl } from '../utils/url';
  import {getToken} from "@/utils/auth";
  Vue.use(NavBar).use(Tabbar).use(TabbarItem);

  @Component({
    components: {}
  })

  export default class Main extends Vue {
    public selected: string = "";
    public title: string = "";
    public msgNum: string = "";
    public zoneId: string = getZoneId() || '';
    public isTabbar: boolean = true;
    public isArrow: boolean = false;
    public homeTitle: string = "";

    get isWeixin(): boolean {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('micromessenger') !== -1) {
        return true;
      } else {
        return false;
      }
    }

    public created() {
      this.selected = String(this.$route.meta.title);
      getZoneInfo().then((res: any) => {
        this.homeTitle = res.data.data.homeTitle;
        if (this.$route.path === '/home') {
          if (this.homeTitle) {
            this.title = this.homeTitle;
          } else {
            this.title = res.data.data.name;
          }
        } else {
          this.title = this.selected;
        }
      });
      this.isShow();
      this.fetch();
    }

    public async fetch() {
      if (getToken()) {
        const res: any = await getMsgNum();
        this.msgNum = res.data.data;
      }
    }

    public getMsgNum(msgNum: any) {
      this.msgNum = msgNum;
    }

    private isShow() {
      if (this.$route.path === '/home' || this.$route.path === '/space' || this.$route.path === '/activity' || this.$route.path === '/mine') {
        this.isTabbar = true;
        this.isArrow = false;
      } else {
        this.isTabbar = false;
        this.isArrow = true;
      }
    }

    @Watch("$route.path")
    private onRouteChanged(newVal: boolean, oldVal: boolean) {
      this.isShow();
      if (this.$route.path !== '/home') {
        this.selected = String(this.$route.meta.title);
        this.title = this.selected;
      } else {
        this.title = this.homeTitle;
        document.title = this.title;
      }
    }

    private onSelectChanged() {
      this.title = String(this.$route.meta.title);
    }

    private onClickLeft() {
      if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
        if (history.length > 0) {
          window.history.go(-1);
        } else {
          window.location.href = "/";
        }
      } else {
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
          navigator.userAgent.indexOf('Opera') >= 0 ||
          navigator.userAgent.indexOf('Safari') >= 0 ||
          navigator.userAgent.indexOf('Chrome') >= 0 ||
          navigator.userAgent.indexOf('WebKit') >= 0) {
          if (window.history.length > 1) {
            window.history.go(-1);
            // this.$router.push(getFromUrl());
          } else {
            window.location.href = "/";
          }
        } else {
          window.history.go(-1);
        }
      }
    }
  }
</script>

<style>
  .router-view {
    position: absolute;
    bottom: 50px;
    width: 100%;
  }

  .van-nav-bar .van-icon{
    color: #23B36E;
    vertical-align: middle;
  }

  .box-shadow {
    -moz-box-shadow: 1px 1px 3px #333333;
    -webkit-box-shadow: 1px 1px 3px #333333;
    box-shadow: 1px 1px 3px #333333;
  }
</style>

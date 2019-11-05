<template>
  <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">

    <van-search
      style="flex: 1;"
      v-model="search"
      placeholder="请输入关键字搜索"
      show-action
      shape="round"
      @search="onSearch"
      @focus="onFocus"
      @blur="show = false">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <van-popup v-model="show" position="top" :overlay="false" class="search-history" style="max-height: 70%">
      <div>
        <div v-if="searchList.length !== 0" style="padding: 10px 16px">
          <div style="font-size: small; width: 100%;">
            搜索历史:
            <span style="float: right; color: #666666" @click="delSearchHistory()">
              <van-icon name="delete" />
              <!-- 清除记录 -->
            </span>
          </div>
          <div style="margin-top: 10px;">
            <template v-for="(search, index) in searchList">
              <van-tag :key="index" color="rgba(193,255,182,.31)" text-color="#07c160" size="large" style="margin-right: 5px; margin-bottom: 5px;" @click="searchHistory(search)">{{ search }}</van-tag>
            </template>
          </div>
        </div>
        <div>
          <template v-for="(suggest, index) in suggestList">
            <van-cell :key="index" :title="suggest" @click="searchHistory(suggest)"/>
          </template>
        </div>
      </div>
    </van-popup>

    <div style="height: 230px">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(banner, index) in bannerList" :key="index">
          <img @click="getCurrentPage(banner.id, banner.itemType)" v-lazy="ossImageUrl(banner.imageUrl)" width="100%" height="230px;" style="object-fit: cover;"/>
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-grid :column-num="4">
      <van-grid-item to="/home/top" icon="fire-o" text="人气榜"/>
      <van-grid-item to="/home/calendar" icon="calender-o" text="活动日历"/>
      <van-grid-item to="/home/choiceness" icon="award-o" text="空间优选"/>
      <van-grid-item to="/mine/ticket" icon="paid" text="我的票卷"/>
      <!-- <van-grid-item to="/home/introduce" icon="diamond-o" text="关于我们"/> -->
    </van-grid>

    <van-cell style="padding-top: 10px; ">
      <template slot="title">
        <h3 style="margin: 0; padding: 0">
          找活动
          <div style="float: right;">
            <span style="font-size: small; font-weight: normal; color: #969799;" @click="toActivityList()">
              查看全部
            </span>
          </div>
        </h3>
      </template>
      <template slot="label">
        <div style="margin-top: 10px;">
          <template v-for="(activity, index) of activityList">
            <van-card :key="index" :tag="activity.activityName" style="padding: 8px;" @click.prevent="toActivityDetail(activity.id)">
              <div slot="thumb" style="width: 35vw">
                <van-image width="100%" height="5rem" radius="1" fit="cover" :src="ossImageUrl(activity.image)" class="box-shadow"/>
              </div>
              <div slot="title">
                <span style="float: right; width: 80%; font-weight: bold">
                  <van-tag v-if="activity.hotStatus" color="#fff7e8" text-color="#ffb11a">优选</van-tag>
                  {{activity.name}}
                </span>
              </div>
              <div slot="desc">
                <div style="float: right; width: 80%;">
                  <span style="color: #969799">
                    {{activity.publisherName}}<br>
                    {{activity.beginTime | dateFmt('YYYY-MM-DD')}} | {{activity.tags}}
                  </span>
                  <div style="font-weight: bold; text-align: right; color: #00B261; padding-right: 3px;">￥{{activity.price}} 起</div>
                  <div style="width: 100%; text-align: right">
                    <van-button v-if="activity.status === '6' || activity.status === '2'" plain type="primary" size="mini" style="width: 70px; margin-top: 3px;">立即报名</van-button>
                    <van-button v-else plain type="warning" size="mini" style="width: 70px; float: right; margin-top: 3px;">报名截止</van-button>
                  </div>
                </div>
              </div>
            </van-card>
          </template>
        </div>
      </template>
    </van-cell>

    <van-cell style="padding: 0; margin-top: 10px;">
      <template slot="title">
        <h3 style="margin: 0; padding: 10px 16px; padding-bottom: 0">精选榜单</h3>
      </template>
      <template slot="label">
        <div style="width: 100vw; overflow-x: auto; -webkit-overflow-scrolling: touch; white-space: nowrap; margin: 10px 0;">
          <template v-for="(tag, index) in tagList">
            <span v-if="index === 0" :key="index" style="margin-left: 16px; margin-right: 5px;">
              <van-image width="7rem" height="10rem" radius="3" fit="cover" :src="ossImageUrl(tag.image)" class="box-shadow" @click="toSearchActivityType(tag.id)"/>
            </span>
            <span v-else :key="index" style="margin: 0 5px;">
              <van-image width="7rem" height="10rem" radius="3" fit="cover" :src="ossImageUrl(tag.image)" class="box-shadow" @click="toSearchActivityType(tag.id)"/>
            </span>
          </template>
        </div>
      </template>
    </van-cell>

    <van-cell style="padding-top: 10px; margin-top: 10px;">
      <template slot="title">
        <h3 style="margin: 0; padding: 0">
          强力推荐
          <div style="float: right;">
            <span style="font-size: small; font-weight: normal; color: #969799;" @click="refreshProduct()">
              <van-icon name="replay"/>
              换一换
            </span>
          </div>
        </h3>
      </template>
      <template slot="label">
        <van-row justify="space-around" gutter="10" style="padding-bottom: 10px;">
          <template v-for="(product, index) in productList">
            <van-col :key="index" span="12" @click="toSpaceDetail(product.id)">
              <van-image width="100%" height="7rem" radius="3" fit="cover" :src="ossImageUrl(product.bannerImage)" class="product-img box-shadow"/>
              <div style="padding: 0 3px;">
                <span class="product-name">{{ product.productName }}</span>
                <span>
                  {{ product.address }} | {{ product.tags || '无' }}<br>
                  容纳{{ product.numberOfPeople}}人 {{ product.dimensions }}㎡
                </span>
                <span style="float: right; font-weight: bold;">
                  <span v-if="product.priceStates === '1'" style="color: #f76c6c">
                    ￥{{ product.activityPrice }}/<span v-if="product.chargeMethod === '1'">时</span><span v-if="product.chargeMethod === '2'">日</span><span v-if="product.chargeMethod === '3'">月</span><span v-if="product.chargeMethod === '4'">年</span>
                  </span>
                  <span v-else style="color: #00B261;">
                    ￥{{ product.price }}/<span v-if="product.chargeMethod === '1'">时</span><span v-if="product.chargeMethod === '2'">日</span><span v-if="product.chargeMethod === '3'">月</span><span v-if="product.chargeMethod === '4'">年</span>
                  </span>
                </span>
              </div>
              <van-divider v-if="index < 2" :hairline="false" style="margin: 10px 0;"/>
            </van-col>
          </template>
        </van-row>
      </template>
    </van-cell>

    <van-cell style="padding: 0; margin-top: 10px">
      <template slot="title">
        <h3 style="margin: 0; padding: 10px 16px; padding-bottom: 0">发现更多</h3>
      </template>
      <template slot="label">
        <div style="width: 100vw; overflow-x: auto; -webkit-overflow-scrolling: touch; white-space: nowrap; margin: 10px 0;">
          <template v-for="(project, index) in projectList">
            <span v-if="index === 0" :key="index" style="margin-left: 16px; margin-right: 5px;">
              <van-image width="80%" height="10rem" radius="5" fit="cover" :src="ossImageUrl(project.banner)" class="box-shadow" @click="toProjectDetail(project.url, project.id)"/>
            </span>
            <span v-else :key="index" style="margin: 0 5px;">
              <van-image width="80%" height="10rem" radius="5" fit="cover" :src="ossImageUrl(project.banner)" class="box-shadow" @click="toProjectDetail(project.url, project.id)"/>
            </span>
          </template>
        </div>
      </template>
    </van-cell>

    <!-- <van-cell style="margin-top: 10px; padding: 10px 16px;">
      <template slot="title">
        <van-image style="float: left" round width="3rem" height="3rem" :src="ossImageUrl(orgLogo)" />
        <span class="org-title">
          <span style="font-size: large;">{{ orgForm.name }}</span><br>
          {{ orgForm.address }}
        </span>
      </template>
    </van-cell>
    <van-cell style="padding: 10px 16px; padding-top: 5px;">
      <div style="margin: 0; padding: 0; margin-top: -14px; color: #999999" class="org-desc" v-html="orgForm.remark"/>
    </van-cell> -->

    <van-cell style="margin-top: 10px; padding: 10px; height: 90px;" to="/home/introduce">
      <img width="100%" src="../../assets/about.png" height="90px" style="object-fit: cover;"/>
      <span class="about-title">关于我们</span>
    </van-cell>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { getBannerList, getProductList, getProjectList, getZoneInfo, getSearchTagList } from '@/api/home';
  import { getActivityList, getActivityTypeList } from '@/api/activity';
  import moment from 'moment';
  import { Search, Swipe, SwipeItem, Lazyload, Grid, GridItem, Cell, Toast, Image, Row, Col, Divider, Card, Button, Tag, Icon, Popup } from 'vant';
  Vue.use(Search).use(Swipe).use(SwipeItem).use(Lazyload).use(Grid).use(GridItem).use(Cell).use(Toast).use(Image).use(Row).use(Col).use(Divider).use(Card).use(Button).use(Popup).use(Tag).use(Icon);

  @Component({
    components: {}
  })

  export default class Home extends Vue {
    public search: string = '';
    public orgLogo: string = '';
    public orgForm: any = {};
    public bannerList: any = [];
    public productTotalList: any = [];
    public productList: any = [];
    public activityList: any = [];
    public tagList: any = [];
    public projectList: any = [];
    public searchList: any = [];
    public suggestList: any = [];
    public show: boolean = false;

    public created() {
      this.fetchBanner();
      this.fetchProduct();
      this.fetchActivity();
      this.fetchActivityType();
      this.fetchProject();
      this.fetchZone();
      this.fetchSearchTag();
      if (localStorage.search) {
        this.searchList = localStorage.search.split(',').slice(-5);
      }
    }

    get isWeixin(): boolean {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('micromessenger') !== -1) {
        return true;
      } else {
        return false;
      }
    }

    @Watch("search")
    private onSearchChanged(newVal: boolean, oldVal: boolean) {
      this.fetchSearchTag();
    }

    private async fetchBanner() {
      Toast.loading({
        mask: true,
        forbidClick: true,
        message: '加载中...'
      });
      const res = await getBannerList();
      this.bannerList = res.data.data;
      this.orgLogo = res.data.data[0].imageUrl;
      Toast.clear();
    }

    private async fetchSearchTag() {
      const res = await getSearchTagList({tagsName: this.search});
      this.suggestList = res.data.data;
    }

    private async fetchProduct() {
      const res = await getProductList({
        page: 1,
        size: 10
      });
      this.productTotalList = res.data.data.rows;
      this.productList = this.productTotalList.slice(0, 4);
    }

    private async fetchZone() {
      const res = await getZoneInfo();
      this.orgForm = res.data.data;
    }

    private async fetchProject() {
      const res = await getProjectList({
        page: 1,
        size: 10
      });
      this.projectList = res.data.data.rows;
    }

    private async fetchActivity() {
      const today = new Date();
      const year = moment(today).format("YYYY");
      const month = moment(today).format("M");
      const res = await getActivityList({
        size: 3,
        hotStatus: 1
      });
      this.activityList = res.data.data.rows;
    }

    private async fetchActivityType() {
      const res = await getActivityTypeList();
      this.tagList = res.data.data;
    }

    private refreshProduct() {
      this.productList = this.getRandomArrayElements(this.productTotalList, 4);
    }

    private getRandomArrayElements(arr: any, count: number) {
      let temp;
      let index;
      let i = arr.length;
      const shuffled = arr.slice(0);
      const min = i - count;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    }

    private getCurrentPage(id: string, itemType: any) {
      switch (itemType) {
        case '1':
          this.$router.push('home/introduce');
          break;
        case '2':
          this.toSpaceDetail(id);
          break;
        case '3':
          this.toActivityDetail(id);
          break;
      }
    }

    private toSpaceDetail(id: string) {
      // this.$router.push(`/space/detail/${id}`);
      window.location.href = `/space/detail/${id}`;
    }

    private toActivityDetail(id: string) {
      // this.$router.push(`/activity/detail/${id}`);
      window.location.href = `/activity/detail/${id}`;
    }

    private toActivityList() {
      this.$router.push('/activity');
    }

    private toProjectDetail(productUrl: string, id: any) {
      if (productUrl) {
        window.location.href = productUrl;
      } else {
        this.$router.push(`/home/project/${id}`);
      }
    }

    private onFocus() {
      this.show = true;
    }

    private delSearchHistory() {
      localStorage.setItem('search', '');
      this.searchList = [];
    }

    private searchHistory(search: any) {
      this.search = search;
      this.onSearch();
    }

    private onSearch() {
      if (this.search) {
        if (localStorage.search) {
          let exist = false;
          const searchList = localStorage.search.split(',');
          for (const item of searchList) {
            if (item === this.search) {
              exist = true;
              break;
            } else {
              exist = false;
            }
          }
          if (!exist) {
            this.searchList.push(this.search);
            localStorage.setItem('search', this.searchList.join(','));
          }
        } else {
          localStorage.search = this.search;
        }
        this.$router.push({
          path: '/home/search',
          query: {
            search: this.search
          }
        });
      }
    }

    private toSearchActivityType(activityTypeId: string) {
      this.$router.push(`/home/type/${activityTypeId}`);
    }
  }
</script>

<style scoped>
  .product-img {
    -webkit-filter: grayscale(50%);
    filter: grayscale(50%);
    margin-top: 10px;
  }
  .product-name {
    font-weight: bold;
    font-size: 1.2em;
    width: 100%;
    height: 19px;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical
  }
  .org-title {
    position: absolute;
    top: 50%;
    transform: translate(20px, -50%);
  }
  .org-desc {
    height: 59px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }
  .about-title {
    letter-spacing: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 200%;
    color: white;
  }
  .search-history {
    position: absolute;
    top: 54px;
  }
</style>

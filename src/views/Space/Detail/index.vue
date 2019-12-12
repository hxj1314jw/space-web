<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-image style="margin: 0; padding: 0" width="100%" height="230" fit="cover" :src="ossImageUrl(spaceForm.bannerImage)" />
      <van-cell-group>
        <van-cell style="padding: 15px; margin: 0;">
          <div class="product-name">
            <van-tag v-if="spaceForm.hotStatus" color="#fff7e8" text-color="#ffb11a">优选</van-tag>
            {{spaceForm.productName}}
          </div>
          <span style="margin-top: 5px; line-height: 1.2em;">
            <span class="space-card-desc">
              {{ spaceForm.remark }}<br>
              {{ spaceForm.address }} | 
              <template v-for="(tag, index) in tagList">
                <van-tag v-if="tag" :key="index" color="rgba(193,255,182,.31)" text-color="#07c160" size="medium" style="margin: 0 3px;">{{ tag }}</van-tag>
                <span v-else :key="index">无</span>
              </template><br>
              容纳{{ spaceForm.numberOfPeople}}人 {{ spaceForm.dimensions }}㎡ | {{ spaceForm.counts }}个可预订
            </span>
          </span>
            <div style="float: right; text-align: right">
                <template v-if="spaceForm.showPrice === '0'">
                    <span  style="color: #f76c6c; font-size: large;">
                      ￥<span>有偿</span>
                    </span>
                </template>
                <template v-else>
                    <span v-if="spaceForm.priceStates === '1'">
                      <s style="color: #999999;">
                        ￥{{spaceForm.price}} /
                        <span>{{charge}}</span>
                      </s><br>
                      <span style="color: #F76C6C; font-size: large;">
                        ￥{{spaceForm.activityPrice}} /
                        <span>{{charge}}</span>
                      </span>
                  </span>
                    <span v-else style="color: #00B261; font-size: large;">
                      ￥{{spaceForm.price}} /
                      <span>{{charge}}</span>
                    </span>
                </template>
            </div>
        </van-cell>
        <van-cell @click="toMap()" title="地理位置: " :value="spaceForm.address" is-link>
          <van-icon slot="icon" name="location-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
        </van-cell>
        <van-cell title="开放日: ">
          <van-icon slot="icon" name="calender-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
          <template v-for="(able, index) in ableList">
            <span :key="index" style="background-color: #F76C6C; padding: 1px 3px; margin-left: 3px; border-radius: 3px;">
              <span style="color: white; font-weight: bold; font-size: xx-small">{{ able }}</span>
            </span>
          </template>
        </van-cell>
        <van-cell title="开放时间: ">
          <van-icon slot="icon" name="clock-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
          <template>
            {{ spaceForm.openDate }}
          </template>
        </van-cell>
        <van-cell v-if="spaceForm.opRemark" title="备注: ">
          <van-icon slot="icon" name="notes-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
          <template>
            {{ spaceForm.opRemark }}
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell v-if="deviceList && deviceList.length > 0" style="padding-top: 10px; margin-top: 10px;">
        <template slot="title">
          <span style="margin: 0; padding: 0;">免费设施</span>
        </template>
        <template slot="label">
          <van-grid :border="false" style="margin-top: 10px;" :column-num="5">
            <template v-for="(device, index) in deviceList">
              <van-grid-item :key="index" :column-num="5" style="margin-top: -7px;">
                <template slot="icon">
                  <div style="border-radius: 50%; border: 1px solid; border-color: #cdcdcd; width: 40px; height: 40px;">
                    <van-image style="margin-top: 10px; margin-left: 10px;" fit="contain" width="20px" height="20px" :src="ossImageUrl(device.url)" />
                  </div>
                </template>
                <template slot="text">
                  <span style="margin-top: 5px;">{{ device.name }}</span>
                </template>
              </van-grid-item>
            </template>
          </van-grid>
        </template>
      </van-cell>

      <van-cell v-if="chargeDeviceList && chargeDeviceList.length > 0" style="padding-top: 10px; margin-top: 10px;">
        <template slot="title">
          <span style="margin: 0; padding: 0;">收费设施</span>
        </template>
        <template slot="label">
          <van-grid :border="false" style="margin-top: 10px;" :column-num="5">
            <template v-for="(device, index) in chargeDeviceList">
              <van-grid-item :key="index" :column-num="5" style="margin-top: -7px;">
                <template slot="icon">
                  <div style="border-radius: 50%; border: 1px solid; border-color: #ffb11a; width: 40px; height: 40px;">
                    <van-image style="margin-top: 10px; margin-left: 10px;" fit="contain" width="20px" height="20px" :src="ossImageUrl(device.url)" />
                  </div>
                </template>
                <template slot="text">
                  <span style="margin-top: 5px;">{{ device.name }}</span>
                </template>
              </van-grid-item>
            </template>
          </van-grid>
        </template>
      </van-cell>

      <!-- <van-cell style="padding-top: 10px; margin-top: 10px;">
        <div style="margin-top: -90px; margin-left: -10px;">
          <iframe :src="mapUrl" style="width: 100%; height: 450px;" />
        </div>
      </van-cell> -->
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button type="default" to="/home" plain hairline style="width: 20vw; margin: 0; padding: 0; height: 100%;">
        <van-icon name="wap-home" size="25" class="center"/>
      </van-button>
      <van-button type="default" @click="collect()" plain hairline style="width: 20vw; margin: 0; padding: 0; height: 100%;">
        <van-icon v-if="isCollect" name="star" color="#ffb11a" size="25" class="center"/>
        <van-icon v-else name="star-o" size="25" class="center"/>
      </van-button>
      <template v-if="spaceForm.type === '1' || spaceForm.type === '3' || spaceForm.type === '5'">
        <van-button  type="primary" @click="toSpaceReserve()" style="width: 30vw; margin: 0; padding: 0; height: 100%;">
          <span class="center van-icon">看场地</span>
        </van-button>
        <van-button type="danger" @click="toAddOrder()" style="width: 30vw; margin: 0; padding: 0; height: 100%;">
          <span class="center van-icon">订场地</span>
        </van-button>
      </template>
      <template v-else>
        <van-button type="danger" @click="toAddOrder()" style="width: 60vw; margin: 0; padding: 0; height: 100%;">
          <span class="center van-icon">订场地</span>
        </van-button>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';
import moment from 'moment';
import { getSpaceDetail, collectSpace, deleteCollectSpace } from '@/api/space';
import {wxChatShare} from '@/utils/wxShare';

import {
  Image,
  Dialog,
  Field,
  Toast,
  Cell,
  CellGroup,
  Tag,
  Button,
  Icon,
  Grid,
  GridItem,
  GoodsAction,
  GoodsActionIcon, GoodsActionButton
} from 'vant';
import { getZoneId, initChargeMethod } from '../../../utils/zone';
Vue.use(Image).use(Field).use(Toast).use(Cell).use(CellGroup).use(Dialog).use(Tag).use(Button).use(Icon).use(Grid).use(GridItem);

@Component({
  components: {}
})
export default class SpaceDetail extends Vue {
  public spaceForm: any = {};
  public tagList: any = [];
  public deviceList: any = [];
  public chargeDeviceList: any = [];
  public ableList: any = [];
  public isCollect: boolean = false;
  public charge: string = '';

  public created() {
    this.fetchSpace();
  }

  private fetchSpace() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    getSpaceDetail({id: this.$route.params.id}).then((res: any) => {
      this.spaceForm = res.data.data.productDetail;
      this.isCollect = res.data.data.isCollect;
      this.tagList = this.spaceForm.tags.split(',');
      for (const item of res.data.data.deviceList) {
        if (item.freeFlag === '0') {
          this.deviceList.push(item);
        } else {
          this.chargeDeviceList.push(item);
        }
      }
      document.title = this.spaceForm.productName;
      this.initAbleList();
      this.settingShare();
      this.getCharge();
      Toast.clear();
    });
  }

  private getCharge() {
    const chargeMethod = this.spaceForm.chargeMethod;
    this.charge = initChargeMethod(chargeMethod);
  }
  private settingShare() {
    const param = {
      url: window.location.href.split('#')[0], // 当前页面url
      title: this.spaceForm.productName, // 分享数据配置 主标题
      desc: '【' + this.spaceForm.tags + '】我在有空发现了一个空间，赶紧来看看吧。', // 分享数据配置 副标题
      link: process.env.VUE_APP_URL + '/space/detail/' + this.spaceForm.id + '?zoneId=' + getZoneId(), // 分享数据配置
      imgUrl: this.spaceForm.bannerImage, // 分享数据配置 －－ 全路径
      type: "link", // 分享类型,music、video或link，不填默认为link
      dataUrl: " ", // 如果type是music或video，则要提供数据链接，默认为空
    };
    wxChatShare(param);
  }

  private toMap() {
    window.location.href = 'https://m.amap.com/search/mapview/keywords=' + this.spaceForm.address;
  }

  private initAbleList() {
    const openDayList = this.spaceForm.openDay.split(',');
    for (const item of openDayList) {
      switch (item) {
        case '1':
          this.ableList.push('一');
          break;
        case '2':
          this.ableList.push('二');
          break;
        case '3':
          this.ableList.push('三');
          break;
        case '4':
          this.ableList.push('四');
          break;
        case '5':
          this.ableList.push('五');
          break;
        case '6':
          this.ableList.push('六');
          break;
        case '7':
          this.ableList.push('日');
          break;
      }
    }
  }

  private collect() {
    UserModule.SetToUrl(`/space/detail/${this.$route.params.id}`);
    if (!this.isCollect) {
      collectSpace({
        productId: this.$route.params.id,
        type: 1
      }).then(() => {
        Toast({
          message: '收藏成功',
          icon: 'star',
          duration: 1000
        });
      });
    } else {
      deleteCollectSpace({
        productId: this.$route.params.id,
        type: 1
      });
    }
    this.isCollect = !this.isCollect;
  }

  private toSpaceReserve() {
    switch (this.spaceForm.type) {
      case '5':
        this.$router.push(`/space/reserve/activity/${this.$route.params.id}`);
        break;
      default:
        this.$router.push(`/space/reserve/work/${this.$route.params.id}`);
        break;
    }
  }

  private toAddOrder() {
    this.$router.push({
      path: `/space/order/${this.$route.params.id}`,
      query: {
        type: this.spaceForm.type
      }
    });
  }
}
</script>

<style scoped>
  .space-card-desc {
    font-size: 0.8em;
    color: #969799;
  }
  .center {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .product-name {
    font-weight: bold;
    font-size: 1.2em;
    width: 100%;
    color: black;
  }
</style>
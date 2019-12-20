<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
      <van-tab title="空间" name="zone">
        
        <van-cell-group style="margin-top: 0px; ">
          <van-image style="margin: 0; padding: 0" width="100%" height="230" fit="cover" :src="ossImageUrl(ZoneForm.imageUrl)" />

          <van-cell title="联系电话: " :value="ZoneForm.contactInformation">
            <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>
          </van-cell>
      
          <van-cell title="地理位置: " :value="ZoneForm.address">
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
              {{ ZoneForm.openDate }}
            </template>
          </van-cell>

          <!--<van-cell title="协议" is-link @click="showQualify()">-->
            <!--<van-icon slot="icon" name="orders-o" style="line-height: inherit; margin-right: 7px;" color="#00B261"/>-->
            <!--<template>-->
              <!--查看空间协议-->
            <!--</template>-->
          <!--</van-cell>-->
        </van-cell-group>

        <van-cell-group style="margin-top: 10px; ">
          <van-cell>
            <span style="font-weight: bold">空间简介</span><br>
            <span style="color: #666666" v-html="ZoneForm.remark"/>
          </van-cell>
        </van-cell-group>
        <van-cell-group style="margin-top: 10px; ">
          <van-cell>
            <span style="font-weight: bold">团队简介</span><br>
            <span style="color: #666666" v-html="ZoneForm.teamRemark"/>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="品牌" name="brand">
        <van-image style="margin: 0; padding: 0; background-color: white" width="100%" height="230" fit="contain" :src="ossImageUrl(Brand.imageUrl)" />
        <van-cell-group style="margin-top: 0px; ">
          <van-cell>
            <span style="font-weight: bold">品牌简介</span><br>
            <span style="color: #666666" v-html="Brand.remark"/>
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { UserModule } from '@/store/modules/user';
  import { getBrandDetail, getZoneDetail } from '@/api/home';
  import moment from 'moment';
  import { Image, Toast, Cell, CellGroup, Icon, Tab, Tabs, ImagePreview } from 'vant';
  Vue.use(Image).use(Toast).use(Cell).use(CellGroup).use(Icon).use(Tab).use(Tabs).use(ImagePreview);

  @Component({
    components: {}
  })
  export default class Aboutus extends Vue {
    public Brand: any = {};
    public ZoneForm: any = {};
    public ableList: any = [];
    public activeName: string = 'zone';

    public created() {
      this.fetchZone();
    }

    private initAbleList() {
      this.ableList = [];
      const openDayList = this.ZoneForm.openDay.split(',');
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
          case '0':
            this.ableList.push('日');
            break;
        }
      }
    }

    private fetchBrand() {
      Toast.loading({
        mask: true,
        forbidClick: true,
        message: '加载中..s.'
      });
      getBrandDetail({id: this.$route.params.id}).then((res: any) => {
        this.Brand = res.data.data;
        Toast.clear();
      });
    }

    private fetchZone() {
      Toast.loading({
        mask: true,
        forbidClick: true,
        message: '加载中..s.'
      });
      getZoneDetail({id: this.$route.params.id}).then((res: any) => {
        this.ZoneForm = res.data.data;
        this.initAbleList();
        Toast.clear();
      });
    }

    private onClick(value: any) {
      switch (value) {
        case 'zone':
          this.fetchZone();
          break;
        case 'brand':
          this.fetchBrand();
          break;
      }
    }

    private showQualify() {
      ImagePreview([
        this.ZoneForm.agreement + "?x-oss-process=style/ys"
      ]);
    }
  }
</script>

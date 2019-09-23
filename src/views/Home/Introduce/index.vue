<template>
  <div>
    <van-tabs v-model="activeName" color="#23B36E" @click="onClick">
      <van-tab title="空间" name="zone">
        
        <van-cell-group style="margin-top: 0px; ">
          <van-image style="margin: 0; padding: 0" width="100%" height="230" fit="cover" :src="ossImageUrl(ZoneForm.imageUrl)" />

          <van-cell title="联系电话: " :value="ZoneForm.contactInformation"></van-cell>
      
          <van-cell title="地理位置: " :value="ZoneForm.address"></van-cell>

          <van-cell title="开放时间: ">
            <template>
              {{ ZoneForm.openDate }}
            </template>
          </van-cell>
        </van-cell-group>

        <van-cell title="资质" is-link @click="showQualify()"/>
        <van-cell-group style="margin-top: 10px; ">
          <van-cell>
            <span style="font-weight: bold">空间简介</span><br>
            <span style="color: #666666" v-html="ZoneForm.remark"/>
          </van-cell>
        </van-cell-group>
        <div v-html="ZoneForm.teamremark"></div>
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
    public activeName: string = 'zone';

    public created() {
      this.fetchZone();
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
      getZoneDetail({id: this.$route.params.id}).then((res: any) => {
        this.ZoneForm = res.data.data;
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
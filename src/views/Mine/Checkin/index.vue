<template>
  <div>
    <div class="map">
      <van-row>
        <template>
          <span style="font-size: smaller; margin: 10px 10px 7px;"><font color="gray">当前位置</font></span><br>
          <span style="font-size: small; margin: 5px 10px 5px;">{{ address }}</span>
        </template>
        <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" style="margin: 10px 10px 10px; height: 125px;"></el-amap>

        <div class="toolbar">
          <span v-if="loaded == false">正在定位</span>
        </div>
      </van-row>
    </div>
    <div class="checkin">
      <van-row>
        <van-button
          v-if="checked == false"
          type="primary"
          @click="checkin()"
          style="margin: 30px 0; width: 90%;">签到</van-button>
        <van-button
          v-if="checked == true"
          type="primary"
          disabled
          style="margin: 30px 0; width: 90%;">今日已签到</van-button>
      </van-row>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { checkin } from '@/api/mine';
  import { Button, Row, Col, Notify } from 'vant';
  Vue.use(Button).use(Row).use(Col).use(Notify);

  export default {
    data() {
      const self = this;
      return {
        center: [121.59996, 31.197646],
        lng: 0,
        lat: 0,
        loaded: false,
        checked: false,
        address: '',
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              o.getCurrentPosition((status, result) => {
                console.log(result.formattedAddress);
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.address = result.formattedAddress;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                  self.$nextTick();
                }
              });
            }
          }
        }]
      };
    },
    methods: {
      checkin() {
        checkin({address: this.address}).then(() => {
          console.log(this.address);
          this.checked = true;
          Notify({ type: 'success', message: '签到成功' });
        });
      },
    }
  };
</script>

<style>
.amap-demo {
  height: 300px;
}
.map {
  background-color: white;
}
.checkin {
  top: 30%;
  text-align:center;
  position: absolute;
  width: 100%;
}
</style>

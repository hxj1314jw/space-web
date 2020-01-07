<template>
  <div>
    <div class="map">
      <van-row>
        <template>
          <span style="font-size: smaller; margin: 10px 10px 7px;"><font color="gray">当前位置</font></span><br>
          <span style="font-size: small; margin: 5px 10px 5px;">{{ address }}</span>
        </template>
        <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" style="margin: 5px 10px 10px; height: 120px;"></el-amap>

        <div class="toolbar">
          <span v-if="loaded == false">正在定位</span>
        </div>
      </van-row>
    </div>
    <div class="checkin">
      <button class="button" @click="checkin()" v-if="checked == false">签到<br>{{ currTime }}</button>
      <button class="button" v-if="checked == true">已签到</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import dayjs from 'dayjs';
  import { checkin } from '@/api/mine';
  import { Button, Row, Col, Notify } from 'vant';
  Vue.use(Button).use(Row).use(Col).use(Notify);

  export default {
    data() {
      const self = this;
      return {
        center: [121.59996, 31.197646],
        currTime: '',
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
    mounted() {
      this.getTime();
      setInterval(() => {
        this.getTime();
      }, 1000);
    },
    methods: {
      getTime() {
        this.currTime = dayjs().format('HH:mm');
      },
      checkin() {
        checkin({address: this.address}).then(() => {
          this.checked = true;
          Notify({ type: 'success', message: '签到成功' });
        });
      },
    }
  };
</script>

<style>
.amap-demo {
  box-shadow: 2px 2px 5px rgba(0,0,0,.4);
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
.button {
  cursor: pointer;
  position: relative;
  color: white;
  width: 110px;
  height: 110px;
  top: 110px;
  line-height: 25px;
  text-align: center;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,.4);
  background-color: #10b91296;
}
</style>

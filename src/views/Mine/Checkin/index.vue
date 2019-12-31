<template>
  <div class="container">
    <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
    </el-amap>

    <div class="toolbar">
      <button @click="getMap()">get map</button>
    </div>
  </div>
</template>

<script>
  import { Vue } from "vue-property-decorator";
  import VueAMap from 'vue-amap';
  import { Button } from 'vant';
  Vue.use(Button).use(VueAMap);

  VueAMap.initAMapApiLoader({
      key: 'e852c7063fa9387e931ba86d797d3763',
      plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor'],
      v: '1.4.4',
  });

  let amapManager = new VueAMap.AMapManager();
  export default {
    data: function() {
      return {
        amapManager,
        zoom: 12,
        center: [121.59996, 31.197646],
        events: {
          init: (o) => {
            console.log(o.getCenter())
            console.log(this.$refs.map.$$getInstance())
            o.getCity(result => {
              console.log(result)
            })
          },
          'moveend': () => {
          },
          'zoomchange': () => {
          },
          'click': (e) => {
            alert('map clicked');
          }
        },
        plugin: ['ToolBar', {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(o) {
              console.log(o);
            }
          }
        }],
      }
    },
    methods: {
      getMap() {
        // amap vue component
        console.log(amapManager._componentMap);
        // gaode map instance
        console.log(amapManager._map);
      }
    },

  };
</script>

<style>
  .amap-demo {
    height: 300px;
  }
  .container {
    width: 700px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border: 1px solid #999;
  }
</style>

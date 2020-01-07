import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { getZoneId, setZoneId } from './utils/zone';
import { getZoneInfo } from '@/api/home';
import service from '@/utils/request';
import moment from 'moment';
import { getToken, setToken } from './utils/auth';
import { UserModule } from '@/store/modules/user';
import { getToUrl } from './utils/url';
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
  key: 'e852c7063fa9387e931ba86d797d3763',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor', 'Geolocation'],
  v: '1.4.4',
  uiVersion: '1.0',
});

Vue.config.productionTip = false;

Vue.prototype.$axios = service;

Vue.filter('dateFmt', (input: any, formatString: any = "YYYY-MM-DD") => {
  return moment(input).format(formatString);
});

router.beforeEach((to, from, next) => {
  if (!to.query.zoneId) {
    const query = to.query || '';
    query.zoneId = getZoneId();
    next({
      path: to.path,
      query
    });
  } else {
    getZoneInfo().then((res: any) => {
      document.title = res.data.data.homeTitle;
    });
    // document.title = String(to.meta.title);
    setZoneId(String(to.query.zoneId));
    if (to.meta.login) {
      const token = getToken();
      if (!token) {
        UserModule.SetToUrl(to.path);
        next({
          path: '/login',
          query: to.query
        });
      } else {
        next();
      }
    } else {
      if (to.path === '/login') {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('micromessenger') !== -1) {
          if (!to.query.openId) {
            const callback = encodeURIComponent(process.env.VUE_APP_URL + to.fullPath);
            window.location.href = process.env.VUE_APP_WX_LOGIN + `?callback=${callback}`;
          } else {
            localStorage.openId = to.query.openId;
            if (to.query.token && to.query.refreshToken) {
              UserModule.GetUserInfo(to.query.token);
              setToken(String(to.query.token));
              next(getToUrl());
            } else {
              next();
            }
          }
        } else {
          next();
        }
      } else {
        if (from.path !== '/login') {
          UserModule.SetFromUrl(from.path);
        }
        next();
      }
    }
  }
});

Vue.prototype.ossImageUrl = (url: string) => {
  return url + "?x-oss-process=style/ys";
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

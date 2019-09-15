import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { getZoneId, setZoneId } from './utils/zone';
import service from '@/utils/request';
import moment from 'moment';
import { getToken, setToken } from './utils/auth';
import { UserModule } from '@/store/modules/user';
import { getToUrl } from './utils/url';

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
    document.title = String(to.meta.title);
    setZoneId(String(to.query.zoneId));
    if (to.meta.login) {
      const token = getToken();
      if (!token) {
        UserModule.SetToUrl(to.path);
        next('/login');
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
            if (to.query.token && to.query.refreshToken) {
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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

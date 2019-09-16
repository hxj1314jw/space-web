import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: () => import('./views/Login/index.vue'), meta: { title: '登陆' } },
    {
      path: '/',
      name: 'main',
      component: () => import('./views/Main.vue'),
      redirect: '/home',
      children: [
        { path: '/home', name: 'home', component: () => import('./views/Home/index.vue'), meta: { title: '首页' } },
        { path: '/space', name: 'space', component: () => import('./views/Space/index.vue'), meta: { title: '空间' } },
        { path: '/activity', name: 'acivity', component: () => import('./views/Activity/index.vue'), meta: { title: '活动' } },
        { path: '/mine', name: 'mine', component: () => import('./views/Mine/index.vue'), meta: { title: '我的', login: 'true' } },

        { path: '/home/top', name: 'top', component: () => import('./views/Home/Top/index.vue'), meta: { title: '人气榜' } },
        { path: '/home/calendar', name: 'calendar', component: () => import('./views/Home/Calendar/index.vue'), meta: { title: '活动日历' } },
        { path: '/home/choiceness', name: 'choiceness', component: () => import('./views/Home/Choiceness/index.vue'), meta: { title: '空间优选' } },
        { path: '/home/introduce', name: 'introduce', component: () => import('./views/Home/Introduce/index.vue'), meta: { title: '空间介绍' } },
        { path: '/home/search', name: 'search', component: () => import('./views/Home/Search/index.vue'), meta: { title: '搜索详情' } },

        { path: '/space/detail/:id', name: 'spaceDetail', component: () => import('./views/Space/Detail/index.vue'), meta: { title: '空间详情' } },
        { path: '/space/reserve/work/:id', name: 'spaceReserve', component: () => import('./views/Space/Reserve/Work/index.vue'), meta: { title: '办公预约', login: 'true' } },
        { path: '/space/reserve/activity/:id', name: 'activityReserve', component: () => import('./views/Space/Reserve/Activity/index.vue'), meta: { title: '活动预约', login: 'true' } },
        { path: '/space/reserve/success', name: 'reserveSuccess', component: () => import('./views/Space/Reserve/Success/index.vue'), meta: { title: '预约成功', login: 'true' } },

        { path: '/activity/detail/:id', name: 'activityDetail', component: () => import('./views/Activity/Detail/index.vue'), meta: { title: '活动详情' } },
        { path: '/activity/ticket/:id', name: 'chooseTicket', component: () => import('./views/Activity/Ticket/index.vue'), meta: { title: '选择票种', login: 'true' } },
        { path: '/activity/form/:activityId/:ticketId', name: 'editTicketForm', component: () => import('./views/Activity/Form/index.vue'), meta: { title: '报名表单', login: 'true' } },
        { path: '/activity/order/:orderId', name: 'activityOrder', component: () => import('./views/Activity/Order/index.vue'), meta: { title: '活动订单', login: 'true' } },
        { path: '/activity/success', name: 'joinSuccessfully', component: () => import('./views/Activity/Success/index.vue'), meta: { title: '报名成功', login: 'true' } },

        { path: '/mine/ticket', name: 'ticket', component: () => import('./views/Mine/Ticket/index.vue'), meta: { title: '我的票卷', login: 'true' } },
        { path: '/mine/ticket/detail/:id', name: 'ticketDetail', component: () => import('./views/Mine/Ticket/Detail/index.vue'), meta: { title: '票卷详情', login: 'true' } },
        { path: '/mine/collect', name: 'collect', component: () => import('./views/Mine/Collect/index.vue'), meta: { title: '我的收藏', login: 'true' } },
        { path: '/mine/notice', name: 'notice', component: () => import('./views/Mine/Notice/index.vue'), meta: { title: '我的通知', login: 'true' } },
        { path: '/mine/reserve', name: 'reserve', component: () => import('./views/Mine/Reserve/index.vue'), meta: { title: '我的预约', login: 'true' } },
        { path: '/mine/reserve/detail/:id', name: 'reserveDetail', component: () => import('./views/Mine/Reserve/Detail/index.vue'), meta: { title: '预约详情', login: 'true' } },
        { path: '/mine/reserve/apply/:id', name: 'applyOrder', component: () => import('./views/Mine/Reserve/Apply/index.vue'), meta: { title: '申请订单', login: 'true' } }
      ]
    }
  ],
});

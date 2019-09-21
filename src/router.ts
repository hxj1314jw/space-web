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
        { path: '/home/type/:id', name: 'type', component: () => import('./views/Home/Type/index.vue'), meta: { title: '精选榜单' } },

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
        { path: '/mine/reserve/apply/success', name: 'applyOrderSuccessfullly', component: () => import('./views/Mine/Reserve/Apply/Success/index.vue'), meta: { title: '申请成功', login: 'true' } },
        { path: '/mine/reserve/apply/:id', name: 'applyOrder', component: () => import('./views/Mine/Reserve/Apply/index.vue'), meta: { title: '申请订单', login: 'true' } },

        { path: '/mine/Info', name: 'info', component: () => import('./views/Mine/Info/index.vue'), meta: { title: '我的名片', login: 'true' } },

        { path: '/mine/order', name: 'order', component: () => import('./views/Mine/Order/index.vue'), meta: { title: '我的订单', login: 'true' } },
        { path: '/mine/order/detail/:id', name: 'orderDetail', component: () => import('./views/Mine/Order/Detail/index.vue'), meta: { title: '订单详情', login: 'true' } },
        { path: '/mine/order/success', name: 'orderPaidSuccessfully', component: () => import('./views/Mine/Order/Success/index.vue'), meta: { title: '支付成功', login: 'true' } },

        { path: '/mine/activity', name: 'mineActivity', component: () => import('./views/Mine/Activity/index.vue'), meta: { title: '我的活动', login: 'true' } },
        { path: '/mine/activity/edit', name: 'mineActivityEdit', component: () => import('./views/Mine/Activity/Edit/index.vue'), meta: { title: '活动信息', login: 'true' } },
        { path: '/mine/activity/ticket/edit/:id', name: 'mineActivityTicketEdit', component: () => import('./views/Mine/Activity/Ticket/Edit/index.vue'), meta: { title: '票种设置', login: 'true' } },
        { path: '/mine/activity/ticket/add/:id', name: 'mineActivityTicketAdd', component: () => import('./views/Mine/Activity/Ticket/Add/index.vue'), meta: { title: '新建票种', login: 'true' } },
        { path: '/mine/activity/ticket/form/:id', name: 'mineActivityTicketForm', component: () => import('./views/Mine/Activity/Ticket/Form/index.vue'), meta: { title: '表单设置', login: 'true' } },
        { path: '/mine/activity/success', name: 'mineActivitySuccess', component: () => import('./views/Mine/Activity/Success/index.vue'), meta: { title: '发布成功', login: 'true' } },

        { path: '/mine/organization', name: 'mineOrganization', component: () => import('./views/Mine/Organization/index.vue'), meta: { title: '我的机构', login: 'true' } },
        { path: '/mine/organization/join', name: 'joinOrganization', component: () => import('./views/Mine/Organization/JoinOrg/index.vue'), meta: { title: '加入机构', login: 'true' } },
        { path: '/mine/organization/edit', name: 'editOrganization', component: () => import('./views/Mine/Organization/Edit/index.vue'), meta: { title: '编辑机构', login: 'true' } },
        { path: '/mine/organization/member/:id', name: 'editOrganizationMember', component: () => import('./views/Mine/Organization/Member/index.vue'), meta: { title: '机构成员', login: 'true' } },
        { path: '/mine/organization/success', name: 'addOrganizationSuccess', component: () => import('./views/Mine/Organization/Success/index.vue'), meta: { title: '申请成功', login: 'true' } }

      ]
    }
  ],
});

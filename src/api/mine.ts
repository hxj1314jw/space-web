import request from '@/utils/request';

export const getTicketList = (params: any) =>
  request({
    url: '/enroll/myTicket',
    method: 'get',
    params
  });

export const getTicketDetail = (params: any) =>
  request({
    url: '/enroll/info',
    method: 'get',
    params
  });

export const updateAvatar = (data: any) =>
  request({
    url: '/oss/pictures',
    method: 'post',
    data
  });

export const editUserInfo = (data: any) =>
  request({
    url: '/user/edit',
    method: 'post',
    data
  });

export const getNoticeList = (params: any) =>
  request({
    url: '/msg/list',
    method: 'get',
    params
  });
export const getMsgNum = () =>
    request({
        url: '/msg/msgNum',
        method: 'get',
    });

export const editNotice = (params: any) =>
  request({
    url: '/msg/read',
    method: 'get',
    params
  });

export const getReserveList = () =>
  request({
    url: '/reserve/list',
    method: 'get'
  });

export const getReserveInfo = (params: any) =>
  request({
    url: '/reserve/info',
    method: 'get',
    params
  });

export const cancelReserve = (params: any) =>
  request({
    url: '/reserve/cancel',
    method: 'get',
    params
  });

export const addOrder = (data: any) =>
  request({
    url: '/order/add',
    method: 'post',
    data
  });

export const editOrderAmount = (data: any) =>
  request({
    url: '/order/amount',
    method: 'post',
    data
  });

export const getOrderList = (params: any) =>
  request({
    url: '/order/list',
    method: 'get',
    params
  });

export const getSubOrderList = (params: any) =>
  request({
    url: '/order/subList',
    method: 'get',
    params
  });

export const cancelSubOrder = (params: any) =>
  request({
    url: '/order/cancelSub',
    method: 'get',
    params
  });

export const addInvoice = (data: any) =>
  request({
    url: '/invoice/add',
    method: 'post',
    data
  });

export const getOrderInfo = (params: any) =>
  request({
    url: '/order/info',
    method: 'get',
    params
  });

export const cancelOrder = (params: any) =>
  request({
    url: '/order/cancel',
    method: 'get',
    params
  });

export const getMineActivity = (params: any) =>
  request({
    url: '/activity/myList',
    method: 'get',
    params
  });

export const getNextSevenData = () =>
    request({
        url: '/product/time',
        method: 'get'
    });

export const getInterval = (params: any) =>
    request({
        url: '/product/interval',
        method: 'get',
        params
    });


export const orderPayEdit = (params: any) =>
    request({
        url: '/order/payEdit',
        method: 'get',
        params
    });


export const orderSubPayEdit = (params: any) =>
    request({
        url: '/order/subPayEdit',
        method: 'get',
        params
    });

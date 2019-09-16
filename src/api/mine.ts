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

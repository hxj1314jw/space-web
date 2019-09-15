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

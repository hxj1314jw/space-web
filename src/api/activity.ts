import request from '@/utils/request';

export const getActivityList = (params: any) =>
  request({
    url: '/activity/list',
    method: 'get',
    params
  });

export const getActivityTypeList = () =>
  request({
    url: '/activity/activityType',
    method: 'get'
  });

export const getActivityDetail = (params: any) =>
  request({
    url: '/activity/info',
    method: 'get',
    params
  });

export const getActivitySurplus = (params: any) =>
  request({
    url: '/activity/surplus',
    method: 'get',
    params
  });

export const collectActivity = (data: any) =>
  request({
    url: '/collect/add',
    method: 'post',
    data
  });

export const deleteCollectActivity = (params: any) =>
  request({
    url: '/collect/delete',
    method: 'get',
    params
  });

export const getCollectList = (params: any) =>
  request({
    url: '/collect/list',
    method: 'get',
    params
  });

export const getTicketList = (params: any) =>
  request({
    url: '/ticket/list',
    method: 'get',
    params
  });

export const delTicket = (params: any) =>
  request({
    url: '/ticket/delete',
    method: 'get',
    params
  });

export const addMyTicket = (data: any) =>
  request({
    url: '/ticket/add',
    method: 'post',
    data
  });

export const editTicket = (data: any) =>
  request({
    url: '/ticket/edit',
    method: 'post',
    data
  });

export const getTicketInfo = (params: any) =>
  request({
    url: '/ticket/info',
    method: 'get',
    params
  });

export const getTicketFieldList = (params: any) =>
  request({
    url: '/form/list',
    method: 'get',
    params
  });

export const addTicket = (data: any) =>
  request({
    url: '/enroll/add',
    method: 'post',
    data
  });

export const addActivityField = (data: any) =>
  request({
    url: '/form/add',
    method: 'post',
    data
  });

export const getActivityOrder = (params: any) =>
  request({
    url: '/enroll/info',
    method: 'get',
    params
  });

export const addActivity = (data: any) =>
  request({
    url: '/activity/add',
    method: 'post',
    data
  });

export const addActivityImage = (data: any) =>
  request({
    url: '/oss/pictures',
    method: 'post',
    data
  });

export const editActivity = (data: any) =>
  request({
    url: '/activity/edit',
    method: 'post',
    data
  });

export const getMyActivityTicket = (params: any) =>
  request({
    url: '/enroll/list',
    method: 'get',
    params
  });

export const editTicketAudit = (params: any) =>
  request({
    url: '/enroll/audit',
    method: 'get',
    params
  });

export const addTicketTeller = (data: any) =>
  request({
    url: '/sign/add',
    method: 'post',
    data
  });

export const getTellerList = (params: any) =>
  request({
    url: '/sign/list',
    method: 'get',
    params
  });

export const delTeller = (params: any) =>
  request({
    url: '/sign/delete',
    method: 'get',
    params
  });

export const getTicketSum = (params: any) =>
  request({
    url: '/activity/amount',
    method: 'get',
    params
  });

export const getTicketAllList = (params: any) =>
  request({
    url: '/ticket/AllList',
    method: 'get',
    params
  });

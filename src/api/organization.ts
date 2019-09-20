import request from '@/utils/request';

export const getMyOrgList = (params: any) =>
  request({
    url: '/org/userList',
    method: 'get',
    params
  });

export const getOrgList = (params: any) =>
  request({
    url: '/org/list',
    method: 'get',
    params
  });

export const addOrgMember = (params: any) =>
  request({
    url: '/org/addMember',
    method: 'get',
    params
  });

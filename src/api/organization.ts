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

export const getOrgInfo = (params: any) =>
  request({
    url: '/org/info',
    method: 'get',
    params
  });

export const uploadPicture = (data: any) =>
  request({
    url: '/oss/pictures',
    method: 'post',
    data
  });

export const editOrgInfo = (data: any) =>
  request({
    url: '/org/edit',
    method: 'post',
    data
  });

export const addOrg = (data: any) =>
  request({
    url: '/org/add',
    method: 'post',
    data
  });

export const getOrgMember = (params: any) =>
  request({
    url: '/org/member',
    method: 'get',
    params
  });

export const agreeOrgMember = (params: any) =>
  request({
    url: '/org/auditMember',
    method: 'get',
    params
  });

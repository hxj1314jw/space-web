import request from '@/utils/request';

export const getSpaceList = (params: any) =>
  request({
    url: '/product/list',
    method: 'get',
    params
  });

export const getSpaceDetail = (params: any) =>
  request({
    url: '/product/detail',
    method: 'get',
    params
  });

export const collectSpace = (data: any) =>
  request({
    url: '/collect/add',
    method: 'post',
    data
  });

export const deleteCollectSpace = (params: any) =>
  request({
    url: '/collect/delete',
    method: 'get',
    params
  });

export const getOrganization = (params: any) =>
  request({
    url: '/org/userList',
    method: 'get',
    params
  });

export const addSpaceReserve = (data: any) =>
  request({
    url: '/reserve/add',
    method: 'post',
    data
  });

export const getReserveNum = (params: any) =>
  request({
    url: '/reserve/lineUp',
    method: 'get',
    params
  });


export const getProductInfo = (params: any) =>
    request({
        url: '/product/info',
        method: 'get',
        params
    });


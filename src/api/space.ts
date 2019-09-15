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

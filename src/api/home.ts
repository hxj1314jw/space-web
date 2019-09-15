import request from '@/utils/request';

export const getBannerList = () =>
  request({
    url: '/zone/banner',
    method: 'get'
  });

export const getProductList = (params: any) =>
  request({
    url: '/product/list',
    method: 'get',
    params,
  });

export const getProjectList = (params: any) =>
  request({
    url: '/project/list',
    method: 'get',
    params
  });

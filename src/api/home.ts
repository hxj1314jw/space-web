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

export const getZoneInfo = () =>
  request({
    url: '/zone/detail',
    method: 'get'
  });

export const getBrandDetail = (params: any) =>
  request({
    url: '/zone/brand',
    method: 'get',
    params
  });

export const getZoneDetail = (params: any) =>
  request({
    url: '/zone/detail',
    method: 'get',
    params
  });

export const getProjectDetail = (params: any) =>
  request({
    url: '/project/info',
    method: 'get',
    params
  });

export const getSearchTagList = (params: any) =>
  request({
    url: '/product/tags',
    method: 'get',
    params
  });

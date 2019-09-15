import request from '@/utils/request';

export const getLoginCode = (params: any) =>
  request({
    url: '/login/code',
    method: 'get',
    params
  });

export const getUserInfo = () =>
  request({
    url: '/user/userInfo',
    method: 'get'
  });

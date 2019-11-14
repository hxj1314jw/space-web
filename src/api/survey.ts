import request from '@/utils/request';

export const getSurveyInfo = (params: any) =>
    request({
        url: 'survey/info',
        method: 'get',
        params
    });

export const getUserSurvey = (params: any) =>
    request({
        url: 'survey/user',
        method: 'get',
        params
    });

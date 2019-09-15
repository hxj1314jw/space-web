import axios from 'axios';
import { getToken } from '@/utils/auth';

import { Toast, Notify, Dialog } from 'vant';
import { getZoneId } from './zone';
import router from '@/router';

let service: any = {};
service = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 3000,
});


// request 拦截器
service.interceptors.request.use(
    (config: { headers: { [x: string]: any; }; }) => {
        config.headers.zoneId = getZoneId();
        if (getToken()) {
            config.headers['AUTH-TOKEN'] = getToken();
        }
        return config;
    },
    (error: any) => {
        // Do something with request error
        Promise.reject(error);
    }
);

// response 拦截器
service.interceptors.response.use(
    (response: { status: any; message: any; data: any; }) => {
        const code = response.status;
        if (code < 200 || code > 300) {
            Toast.fail(response.message);
            return Promise.reject('error');
        } else {
            return response;
        }
    },
    (error: { response: { data: { status: number; message: any; code: number }; }; toString: { (): { indexOf: (arg0: string) => number; }; (): { indexOf: (arg0: string) => number; }; }; }) => {
        const code = error.response.data.code;
        try {
            switch (code) {
                case 1502:
                    router.push('/login');
                    break;
            }
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                Notify({
                    message: '网络请求超时',
                    duration: 2500,
                    background: '#F76C6C'
                });
                return Promise.reject(error);
            }
            if (error.toString().indexOf('Error: Network Error') !== -1) {
                Notify({
                    message: '网络请求错误',
                    duration: 2500,
                    background: '#F76C6C'
                });
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default service;

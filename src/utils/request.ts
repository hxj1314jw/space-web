import axios from 'axios';
import { getToken } from '@/utils/auth';
import { UserModule } from '@/store/modules/user';

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
        if (code === 401) {
            Dialog.alert({
                message: '登录状态已过期，您可以继续留在该页面，或者重新登录',
                title: '系统提示',
                confirmButtonText: '重新登录',
                cancelButtonText: '取消'
            }).then(() => {
                UserModule.Logout().then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
            });
        } else if (code === 403) {
            // Router.push({ path: '/401' })
        } else {
            const errorMsg = error.response.data.message;
            if (errorMsg !== undefined) {
                Notify({
                    message: errorMsg,
                    duration: 2500,
                    background: '#F76C6C'
                });
            }
        }
        return Promise.reject(error);
    }
);

export default service;

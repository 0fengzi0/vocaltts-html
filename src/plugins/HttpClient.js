import store from '@/store';
import axios from 'axios';
import qs from 'qs';
import $cookies from 'vue-cookies';

// 统一异常处理部分
function errorHandle (res) {
    let snackBarData = {
        message: '',
        color  : 'error'
    };
    if (res.status === 200) {
        snackBarData.color = 'warning';
        snackBarData.message = res.data.message;
        console.log(res.data.code + '====' + res.data.message);
    } else {
        switch (res.status) {
            case 404:
                snackBarData.message = '文件不存在';
                break;
            case 500:
                snackBarData.message = '服务器错误';
                break;
            case undefined :
                snackBarData.message = '网络连接失败,请检查网络连接';
                break;
            default :
                snackBarData.message = '未知错误';
        }
        console.log(res.status + '====' + res.message);
    }
    store.commit('snackBarShow', snackBarData);
}

// 创建axios实例
const instance = axios.create({
    baseURL: process.env.VUE_APP_HOST == null ? 'https://api.5ixf.vip/' : process.env.VUE_APP_HOST,
    // 超时 15秒
    timeout: 1000 * 15,
    // 跨域请求时是否需要使用凭证,默认为false
    withCredentials: true,
    // 请求头
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// 请求拦截器
instance.interceptors.request.use(res => {
    if (res.method === 'post' || res.method === 'POST') {
        res.data = {
            app       : 'web',
            uid       : process.env.VUE_APP_APPID,
            time      : new Date().getTime().toString().substr(0, 10),
            session_id: $cookies.isKey('session_id') ? $cookies.get('session_id') : '',
            ...res.data
        };
        res.data = qs.stringify(res.data);
        return res;
    } else if (res.method === 'get' || res.method === 'GET') {
        res.params = {
            app       : 'web',
            uid       : process.env.VUE_APP_APPID,
            time      : new Date().getTime().toString().substr(0, 10),
            session_id: $cookies.isKey('session_id') ? $cookies.get('session_id') : '',
            ...res.params
        };
        return res;
    }
});

// 响应拦截器
instance.interceptors.response.use(res => {
    if (res.data.session_id != null && (!$cookies.isKey('session_id') || $cookies.get('session_id') !== res.data.session_id)) {
        $cookies.set('session_id', res.data.session_id);
    }
    if (res.status === 200 && res.data.code === 200) {
        return Promise.resolve(res.data);
    } else {
        errorHandle(res);
        return Promise.reject(res);
    }
}, error => {
    errorHandle(error);
    return Promise.reject(error);
});

function doHttp (url = '', type = 'get', data = {}) {
    if (type === 'get' || type === 'GET') {
        return instance.get(url, {
            params: data
        });
    } else if (type === 'post' || type === 'POST') {
        return instance.post(url, data);
    }
}

export default {
    doHttp
};

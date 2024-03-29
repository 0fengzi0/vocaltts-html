import store from '@/store';
import axios from 'axios';

// 统一异常处理部分
function errorHandle(res) {
    let snackBarData = {
        message: '',
        color: 'error'
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
    baseURL: process.env.VUE_APP_HOST == null ? 'https://ce47f01b-122e-42fe-b15b-bc743b1f5f3c.bspapp.com/vocaltts/' : process.env.VUE_APP_HOST,
    // 超时 15秒
    timeout: 1000 * 15,
    // 跨域请求时是否需要使用凭证,默认为false
    withCredentials: true,
    // 请求头
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(res => {
    if (res.method === 'post' || res.method === 'POST') {
        res.data = {
            app: 'web',
            uid: process.env.VUE_APP_APPID,
            time: new Date().getTime().toString().substr(0, 10),
            ...res.data
        };
        // res.data = qs.stringify(res.data);
        return res;
    } else if (res.method === 'get' || res.method === 'GET') {
        res.params = {
            app: 'web',
            uid: process.env.VUE_APP_APPID,
            time: new Date().getTime().toString().substr(0, 10),
            ...res.params
        };
        return res;
    }
});

// 响应拦截器

instance.interceptors.response.use(res => {
    if (res.status === 200 && res.data.code === 200) {
        return res.data;
    } else {
        errorHandle(res);
        return Promise.reject(res);
    }
});

function doHttp(url = '', type = 'get', data = {}) {
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

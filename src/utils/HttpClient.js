```js
import axios from 'axios';
import qs from 'qs';

// 统一异常处理部分
function errorHandle (res) {
    let data = {
        msg  : res.msg,
        color: 'error'
    };
    res.msg == null ? data.msg = '网络请求错误' : '';
}

// 创建axios实例
const instance = axios.create({
    // 超时 15秒
    timeout        : 1000 * 15,
    // 跨域请求时是否需要使用凭证,默认为false
    withCredentials: true,
    // 请求头
    headers        : {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // 设置请求url
    baseURL        : process.env.VUE_APP_HOST == null ? 'https://api.5ixf.vip/' : process.env.VUE_APP_HOST
});

// 请求拦截器
instance.interceptors.request.use(res => {
    if (res.method === 'post' || res.method === 'POST') {
        res.data.app = 'web';
        res.data.uid = process.env.VUE_APP_APPID;
        res.data.time = new Date().getTime();
        res.data = qs.stringify(res.data);
        return res;
    } else if (res.method === 'get' || res.method === 'GET') {
        res.params.time = new Date().getTime();
        return res;
    }
});

// 响应拦截器
instance.interceptors.response.use(res => {
    if (res.data.code !== 200) {
        errorHandle(res.data);
        return Promise.reject(res.data);
    }
    return Promise.resolve(res.data);
}, error => {
    let data = {
        code: -1,
        msg : error.message,
        data: error
    };
    errorHandle(data);
    return Promise.reject(data);
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

export default doHttp;
```

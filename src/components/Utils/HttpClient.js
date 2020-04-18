import axios from "axios"
import qs from 'qs';
import Bus from "./Bus";

function errorHandle(res) {
    let data = {
        msg : res.msg,
        color : "error"
    };
    res.code == null ? data.msg = "网络请求错误" : '';
    Bus.$emit('showSnackBar', data);
}

//创建axios实例
const instance = axios.create({
        // 超时
        timeout : 1000 * 12,
        // 请求头
        headers : {
            'Content-Type' : "application/x-www-form-urlencoded"
        }
    })
;

//请求拦截器
instance.interceptors.request.use(res => {
    if ( res.method === "post" || res.method === "POST" ) {
        res.data.app = 'web';
        res.data.uid = process.env.VUE_APP_APPID;
        res.data.time = new Date().getTime();
        res.data = qs.stringify(res.data);
    }
    return res;
}, error => {
    Promise.error(error);
});

//响应拦截器
instance.interceptors.response.use(res => {
    if ( res.data.code !== 200 ) {
        errorHandle(res.data);
    }
    return Promise.resolve(res.data);
}, error => {
    console.log('请求失败,其他原因', error);
    let data = {
        code : -1,
        msg : error.message
    };
    errorHandle(data);
    return Promise.reject(data);
});


let serviceApi = process.env.VUE_APP_HOST == null ? 'https://api.5ixf.cc/' : process.env.VUE_APP_HOST;

function doHttp(url = "", type = "get", data = {}) {
    if ( type === "get" || type === "GET" ) {
        return instance.get(serviceApi + url, {
            params : data
        })
    } else if ( type === "post" || type === "POST" ) {
        return instance.post(serviceApi + url,
            data
        )
    }
}

export default {
    doHttp,
    serviceApi
}


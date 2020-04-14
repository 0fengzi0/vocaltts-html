import axios from "axios"
import qs from 'qs';
import Bus from "./Bus";

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
    console.log('请求拦截器', res);
    if ( res.method === "post" || res.method === "POST" ) {
        console.log(res.data);
        res.data.app = 'web';
        res.data.uid = 'admin';
        res.data.time = new Date().getTime();
        res.data = qs.stringify(res.data);
    }
    return res;
}, error => {
    Promise.error(error);
});

//响应拦截器
instance.interceptors.response.use(res => {
    console.log('响应拦截器', res);
    return Promise.resolve(res.data);
}, error => {
    console.log('请求失败,其他原因', error);
});


let serviceApi = "";

if ( process.env.NODE_ENV === "development" ) {
    // 开发环境
    serviceApi = "https://api.5ixf.cc/";
} else if ( process.env.NODE_ENV === "production" ) {
    // 打包环境
    serviceApi = "https://api.5ixf.cc/";
}

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


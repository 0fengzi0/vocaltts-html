# vocaltts-html
vocaltts项目的前端开源地址,项目使用vue-cli构建

欢迎star

在线展示页面

[主站1-tts.5ixf.cc](http://tts.5ixf.cc)        
[主站2-tts.5ixf.vip](http://tts.5ixf.vip)    
[LastDream-lastdream.net](https://www.lastdream.net/plugin.php?id=LD:VOCALTTS)

-------------------------------

##### (0)准备
``` bash
在这里申请验证码相关东西
[vaptcha手势验证码](https://www.vaptcha.com/)
```

##### (1)开始
###### github
``` bash
git clone https://github.com/0fengzi0/vocaltts-html.git
```
###### 码云(备用,更新较慢)
``` bash
git clone https://gitee.com/feng__zi/vocaltts-html.git
```

##### (2)
``` bash
yarn
```

##### (3)新建配置文件并填写, 配置文件在 "/src/assets/js/config.js"
``` javascript
// 配置文件内容

// 服务器地址
let apiService = "https://api.5ixf.cc/";
// 分配的appid
let appid = '';
// 验证码vid
let vid = '';
// 备案信息
let recordMsg = '';

export default {
    apiService,
    appid,
    vid,
    recordMsg
}
```

##### (4)开始构建
``` bash
yarn build
```
---------------------------------
2020.2.18
    
    新增弹窗公告功能
    验证码对接为手势验证码
    修改配置引入方式为js文件
2020.1.1

    修改配置方式为json文件配置

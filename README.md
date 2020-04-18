# vocaltts-html
vocaltts项目的前端开源地址,项目使用vue-cli构建

欢迎star

在线展示页面

[主站1-tts.5ixf.cc](http://tts.5ixf.cc)        
[主站2-tts.5ixf.vip](http://tts.5ixf.vip)    
[LastDream-lastdream.net](https://www.lastdream.net/plugin.php?id=LD:VOCALTTS)

-------------------------------

##### (0)准备

在这里申请验证码相关东西

[vaptcha手势验证码](https://www.vaptcha.com/)

##### (1)开始,github和码云二选一
###### github(主要,速度较慢)
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

##### (3)在根目录新建配置文件[.env]并填写(备案信息支持HTML代码)
``` text
NODE_ENV=分配的appid
VUE_APP_CVID=你的手势验证码CVID
VUE_APP_RECORD=<a style='text-decoration: none;color: black !important;' href='http://www.beian.miit.gov.cn/'>备案信息</a>
```

##### (4)开始构建
``` bash
yarn build
```
更新日志
---------------------------------
2020.4.15

    重构前端项目,使用环境变量进行文件配置
    UI使用vuetifyjs
2020.2.18
    
    新增弹窗公告功能
    验证码对接为手势验证码
    修改配置引入方式为js文件
2020.1.1

    修改配置方式为json文件配置

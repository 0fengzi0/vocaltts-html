# vocaltts-html
### 关于此项目

    本项目为VOCALTTS的前端，使用vue-cli构建。
    开源本项目只是希望能为一些学习前端的同学提供一些帮（wu）助（dao）。
    同时此项目也为自己在前端的学习上提供一些实践的地方。
    如果你对某些地方有更好的解决方法，欢迎提出。
-------------------------------
### 在线展示页面


[主站1-gitee部署](https://feng__zi.gitee.io/vocaltts-html/)   
[主站2-tts.5ixf.vip](http://tts.5ixf.vip)    
[LastDream-lastdream.net](https://www.lastdream.net/plugin.php?id=LD:VOCALTTS)
-------------------------------
##### (0)准备

在这里申请验证码相关东西

[vaptcha手势验证码](https://www.vaptcha.com/)

##### (1)开始，github和码云二选一
###### github(主要,速度较慢)
``` bash
git clone https://github.com/0fengzi0/vocaltts-html.git
```

###### 码云(备用,更新较慢)
``` bash
git clone https://gitee.com/feng__zi/vocaltts-html.git
```

##### (2)安装依赖
``` bash
yarn
```

##### (3)在根目录新建配置文件[.env]并填写(备案信息支持HTML代码)
``` text
VUE_APP_APPID=分配的appid
VUE_APP_CVID=你的手势验证码CVID
VUE_APP_RECORD=<a style='text-decoration: none;color: black !important;' href='http://www.beian.miit.gov.cn/'>备案信息</a>
```

##### (4)开始构建
``` bash
yarn build
```
更新日志
---------------------------------
2020.4.18

    开启Gzip
    部分组件使用异步加载
2020.4.15

    重构前端项目
    新增移动端页面
    修改配置引入方式为环境变量
    UI使用vuetifyjs（一个谷歌MD风格的UI框架）
2020.2.18
    
    新增弹窗公告功能
    人机验证为替换为手势验证码
    修改配置引入方式为js文件
2020.1.1

    修改配置方式为json文件配置

--------------
## 鸣谢

特别感谢 [JetBrains](https://www.jetbrains.com/?from=VOCALTTS) 为开源项目提供免费的 [WebStrom](https://www.jetbrains.com/?from=VOCALTTS) 等 IDE 的授权  
[<img src="https://s1.ax1x.com/2020/08/13/az4yMF.png" width="200"/>](https://www.jetbrains.com/?from=VOCALTTS)
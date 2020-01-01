# vocaltts-html
vocaltts项目的前端开源地址,项目使用vue-cli构建

欢迎star

在线展示页面

[主站](http://tts.5ixf.cc)        
[LastDream](https://www.lastdream.net/plugin.php?id=LD:VOCALTTS)

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

##### (3)开始构建
``` bash
yarn build
```
##### (4)将生成的dist目录内的文件放到网站的根目录,并修改config.js中的配置
``` json
{
    <!-- api地址-->
    "serviceApi": "https://api.5ixf.cc/",
    
    <!-- 分配的appid-->
    "appid": "",
    
    <!-- 备案信息-->
    "recordMsg": ""
}
```
---------------------------------
2020.1.1
    修改配置方式为json文件配置
<template >
    <div id="vaptchaModel" >
        <div class="model" >
            <div class="modelTitle" >
                请进行验证
                <div id="closeButton" @click="returnData('')" >×</div >
            </div >
            <!-- 嵌入式仅需设置宽度，高度根据宽度自适应，最小宽度为200px -->
            <div id="vaptchaContainer" >
                <!--vaptcha-container是用来引入VAPTCHA的容器，下面代码为预加载动画，仅供参考-->
                <div class="vaptcha-init-main" >
                    <div class="vaptcha-init-loading" >
                        <a href="/" target="_blank" >
                            <img src="https://r.vaptcha.com/public/img/vaptcha-loading.gif" />
                        </a >
                        <span class="vaptcha-text" >Vaptcha启动中...</span >
                    </div >
                </div >
            </div >
        </div >
    </div >
</template >

<script >
    import config from "../../assets/js/config";
    
    export default {
        name : "vaptcha",
        // 引用组件
        components : {},
        data() {
            return {};
        },
        // 初始化完成
        mounted() {
            //配置参数
            this.vaptcha(config.vid);
        },
        // 其他函数
        methods : {
            // 验证码
            vaptcha(cvid) {
                let that = this;
                window.vaptcha({
                    // 验证单元id
                    vid : cvid,
                    // 展现类型 嵌入式
                    type : 'embed',
                    // 验证场景
                    scene : 1,
                    // 按钮容器，可为Element 或者 selector
                    container : '#vaptchaContainer',
                    // 语言 默认zh-CN,可选值zh-CN,en,zh-TW
                    lang : 'zh-CN',
                    // 使用https 默认 true
                    https : true,
                    //离线模式服务端地址
                    offline_server : 'https://5ixf.vip/',
                }).then(function (vaptchaObj) {
                    // 调用验证实例 vpObj 的 render 方法加载验证按钮
                    vaptchaObj.render();
                    
                    vaptchaObj.listen('pass', function () {
                        // 验证成功进行后续操作
                        console.log("验证成功")
                        // 获取验证的token
                        // 返回数据
                        that.returnData(vaptchaObj.getToken());
                        //重置验证码
                        vaptchaObj.reset();
                    });
                });
            },
            
            // 返回数据
            returnData(token) {
                this.$emit("return-token", token);
            }
        }
    };
</script >

<style scoped >
    #vaptchaModel {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.8);
    }
    
    .model {
        width: 400px;
        height: 280px;
        z-index: 10;
        padding: 10px 5px 5px 5px;
        margin: auto;
        background-color: white;
        box-shadow: 20px 20px 10px 0px rgba(0, 0, 0, 0.9);
    }
    
    .modelTitle {
        width: 400px;
        height: 50px;
        text-align: center;
        line-height: 40px;
        font-size: 26px;
    }
    
    #closeButton {
        width: 40px;
        height: 40px;
        line-height: 40px;
        position: relative;
        left: 360px;
        bottom: 40px;
    }
    
    #closeButton:hover {
        cursor: pointer;
    }
    
    #vaptchaContainer {
        width: 400px;
        height: 230px;
    }
    
    .vaptcha-init-main {
        display: table;
        width: 100%;
        height: 100%;
        background-color: #EEEEEE;
    }
    
    .vaptcha-init-loading {
        display: table-cell;
        vertical-align: middle;
        text-align: center
    }
    
    .vaptcha-init-loading > a {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: none;
    }
    
    .vaptcha-init-loading > a img {
        vertical-align: middle
    }
    
    .vaptcha-init-loading .vaptcha-text {
        font-family: sans-serif;
        font-size: 12px;
        color: #CCCCCC;
        vertical-align: middle
    }
</style >

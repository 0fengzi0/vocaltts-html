<template >
    <div id="vaptchaModel" v-if="vaptchaModelData.isShow" >
        <div class="model" >
            <div class="modelTitle" >
                请进行验证
                <div id="closeButton" @click="returnData('')" >×</div >
            </div >
            <!-- 嵌入式仅需设置宽度，高度根据宽度自适应，最小宽度为200px -->
            <div id="vaptchaContainer" style="width: 300px;height: 172.5px" >
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
    import Bus from "./Bus";
    
    export default {
        name : "vaptchaModel",
        // 引用组件
        components : {},
        data() {
            return {
                vaptchaModelData : {
                    isShow : false
                }
            };
        },
        // 初始化完成
        mounted() {
            //配置参数
            let that = this;
            Bus.$on("doVaptcha", (res) => {
                that.vaptchaModelData.isShow = true;
                setTimeout(() => {
                    that.vaptcha(process.env.VUE_APP_CVID)
                }, 50);
            });
        },
        // 其他函数
        methods : {
            // 验证码
            vaptcha(cvid = '') {
                let that = this;
                if ( cvid != '' ) {
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
                        
                        // 验证成功进行后续操作
                        vaptchaObj.listen('pass', function () {
                            console.log("验证成功");
                            // 获取验证的token 并返回数据
                            that.returnData(vaptchaObj.getToken());
                            //重置验证码
                            vaptchaObj.reset();
                        });
                    });
                } else {
                    Bus.$emit('showSnackBar', {
                        msg : "手势验证码配置错误,请检查",
                        color : "error"
                    })
                }
                
            },
            
            // 返回数据
            returnData(token = '') {
                this.vaptchaModelData.isShow = false;
                token !== '' ? Bus.$emit("returnToken", token) : '';
            }
        }
    };
</script >

<style scoped >
    #vaptchaModel {
        width: 100%;
        height: 100%;
        display: flex;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.8);
    }
    
    .model {
        z-index: 10;
        padding: 10px;
        margin: auto;
        background-color: white;
        box-shadow: 20px 20px 10px 0px rgba(0, 0, 0, 0.9);
    }
    
    .modelTitle {
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 40px;
        font-size: 26px;
        position: relative;
    }
    
    #closeButton {
        width: 40px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 0;
        right: 0;
    }
    
    #closeButton:hover {
        cursor: pointer;
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

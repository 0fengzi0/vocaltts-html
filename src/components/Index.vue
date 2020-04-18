<template >
    <div id="Index" >
        <!--提示信息条-->
        <SnackBar ></SnackBar >
        <!--pc页面主体-->
        <PcIndex v-if="isPc" ></PcIndex >
        <!--手机页面主体-->
        <PhoneIndex v-else ></PhoneIndex >
        <!--验证码弹窗-->
        <VaptchaModel ></VaptchaModel >
    </div >
</template >

<script >
    import Bus from "./Utils/Bus";
    import HttpClient from "./Utils/HttpClient";
    
    import PhoneIndex from "./Phone/PhoneIndex";
    import PcIndex from "./Pc/PcIndex";
    import VaptchaModel from "./Utils/VaptchaModel";
    import SnackBar from "./Utils/SnackBar";
    
    export default {
        name : "Index",
        // 引用组件
        components : {
            PhoneIndex,
            PcIndex,
            SnackBar,
            VaptchaModel,
        },
        data() {
            return {
                // 是否是电脑页面
                isPc : false,
            };
        },
        
        // 初始化完成
        mounted() {
            window.document.body.offsetWidth >= 900 ? this.isPc = true : this.isPc = false;
        },
        
        // 销毁前
        beforeDestroy() {
            Bus.$off('doVaptcha', res => {
                console.log('销毁验证码监听', res);
            })
        },
        
        // 其他函数
        methods : {}
    };
</script >

<style scoped lang="scss" >
    #Index {
        width: 100%;
        height: 100%;
    }
</style >

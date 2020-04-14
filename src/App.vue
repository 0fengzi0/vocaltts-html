<template >
    <v-app id="app" @contextmenu.prevent="" >
        <router-view />
    </v-app >
</template >

<script >
    export default {
        name : "app",
        // 初始化完成
        mounted() {
            console.info(window.document.body.offsetWidth >= 900 ? '当前是电脑页面' : '当前是手机页面');
            console.info('当前环境:' + process.env.NODE_ENV);
        },
        // 其他函数
        methods : {}
    }
</script >

<style lang="scss" >
    html, body, #app {
        width: 100%;
        height: 100%;
        overflow: hidden !important;
        margin: 0;
        padding: 0;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style >

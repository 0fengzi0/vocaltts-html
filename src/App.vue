<template >
    <div id="app" @contextmenu.prevent="" >
        <router-view />
    </div >
</template >

<script >
    export default {
        name : "App",
        data() {
            return {};
        },
        
        // 初始化完成
        mounted() {
        }
    }
</script >

<style >
    body {
        margin: 0px;
        padding: 0px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style >

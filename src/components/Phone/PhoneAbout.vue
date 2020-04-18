<template >
    <div id="PhoneAbout" class="d-flex flex-column" >
        <v-card
            class="ma-3"
            min-height="400px"
            max-height="80vh"
            color="rgba(255,255,255,0.8)"
        >
            <v-card-title >
                关于本站
            </v-card-title >
            <v-divider ></v-divider >
            <v-card-text >
                <div class="red--text" ><strong >声明：本站内容为个人兴趣自制且仅供试听，严禁用于商业用途</strong ></div >
                <div >制作与维护：
                    <span ><a target="_Blank" href="https://5ixf.cc" >疯子</a ></span >
                    <span class="white-space" ></span >
                    <span >B站：<a target="_Blank" href="https://space.bilibili.com/13938564" >0疯_子0</a ></span >
                </div >
                <div >
                    前端开源地址：
                    <a target="_Blank" href="https://github.com/0fengzi0/vocaltts-html" >Github</a >
                    <span class="white-space" ></span >
                    <a target="_Blank" href="https://gitee.com/feng__zi/vocaltts-html" >Gitee</a >
                </div >
                <div >
                    友情合作：
                </div >
                <div >
                    <a target="_Blank" href="https://space.bilibili.com/42973598" >VirtualVocal粉丝大会应援团</a >
                    <span class="white-space" ></span >
                    <a target="_Blank" href="http://www.lastdream.net/" >语音时代</a >
                    <span class="white-space" ></span >
                    <a target="_Blank" href="https://space.bilibili.com/134558" >世界协奏之歌</a >
                    <span class="white-space" ></span >
                    <a target="_Blank" href="https://space.bilibili.com/24921468" >呆呆酱机器人</a >
                    <span class="white-space" ></span >
                </div >
            </v-card-text >
        </v-card >
        <PhoneFooter ></PhoneFooter >
    </div >
</template >

<script >
    import PhoneFooter from "./PhoneFooter";
    
    export default {
        name : "PhoneAbout",
        // 引用组件
        components : { PhoneFooter },
        data() {
            return {};
        },
        
        // 初始化完成
        mounted() {
        
        },
        
        // 其他函数
        methods : {}
    };
</script >

<style scoped >
    a {
        text-decoration: none;
    }
    
    .white-space {
        margin: 0 5px;
    }
    
    #PhoneAbout {
        width: 100%;
        height: 100%;
    }
</style >

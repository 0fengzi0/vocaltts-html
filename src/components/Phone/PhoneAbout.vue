<template >
    <div class="d-flex flex-column" id="PhoneAbout" >
        <v-card
                class="ma-3"
                color="rgba(255,255,255,0.8)"
                max-height="80vh"
                min-height="400px"
        >
            <v-card-title >
                关于本站
            </v-card-title >
            <v-divider ></v-divider >
            <v-card-text >
                <div class="red--text" ><strong >声明：本站内容为个人兴趣自制且仅供试听，严禁用于商业用途</strong ></div >
                <div >本站建立时间{{ startDay }}，已提供服务{{ runDays }}天</div >
                <div >当前版本V{{ version }}</div >
                <div >制作与维护：
                    <span ><a href="https://5ixf.cc" target="_Blank" >疯子</a ></span >
                    <span class="white-space" ></span >
                    <span >B站：<a href="https://space.bilibili.com/13938564" target="_Blank" >0疯_子0</a ></span >
                </div >
                <div >
                    前端开源地址：
                    <a href="https://github.com/0fengzi0/vocaltts-html" target="_Blank" >Github</a >
                    <span class="white-space" ></span >
                    <a href="https://gitee.com/feng__zi/vocaltts-html" target="_Blank" >Gitee</a >
                </div >
                <div >
                    友情合作：
                </div >
                <div >
                    <a href="https://space.bilibili.com/42973598" target="_Blank" >VirtualVocal粉丝大会应援团</a >
                    <span class="white-space" ></span >
                    <a href="http://www.lastdream.net/" target="_Blank" >语音时代</a >
                    <span class="white-space" ></span >
                    <a href="https://space.bilibili.com/134558" target="_Blank" >世界协奏之歌</a >
                    <span class="white-space" ></span >
                    <a href="https://space.bilibili.com/24921468" target="_Blank" >呆呆酱机器人</a >
                    <span class="white-space" ></span >
                </div >
            </v-card-text >
        </v-card >
        <PhoneFooter ></PhoneFooter >
    </div >
</template >

<script >
    import PhoneFooter from "./PhoneFooter";
    import config from "../../../package.json";

    export default {
        name: "PhoneAbout",
        // 引用组件
        components: {PhoneFooter},
        data() {
            return {
                // 建站日期
                startDay: '2018-11-21',
                // 运行天数
                runDays: 0,
                // 当前版本
                version: config.version,
            };
        },

        // 初始化完成
        mounted() {
            let that = this;
            // 计算运行天数
            that.countRunDays();
        },

        // 其他函数
        methods: {
            // 计算运行天数
            countRunDays() {
                // 两个时间戳相差的毫秒数
                let usedTime = Date.parse(new Date()) - Date.parse(new Date(this.startDay));
                // 计算相差的天数
                this.runDays = Math.floor(usedTime / (24 * 3600 * 1000));
            },
        }
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

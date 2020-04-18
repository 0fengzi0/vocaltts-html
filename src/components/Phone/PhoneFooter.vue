<template >
    <div id="PhoneFooter" class="text-center" >
        <div >本站建立时间{{ startDay }}，已提供服务{{ runDays }}天</div >
        <div >当前版本V{{ version }}</div >
        <div v-html="record" ></div >
    </div >
</template >

<script >
    import config from "../../../package.json";
    
    export default {
        name : "PhoneFooter",
        // 引用组件
        components : {},
        data() {
            return {
                // 建站日期
                startDay : '2018-11-21',
                // 运行天数
                runDays : 0,
                // 当前版本
                version : config.version,
                // 备案信息
                record : process.env.VUE_APP_RECORD
            };
        },
        
        // 初始化完成
        mounted() {
            let that = this;
            // 计算运行天数
            that.countRunDays();
        },
        
        // 其他函数
        methods : {
            
            // 计算运行天数
            countRunDays() {
                // 两个时间戳相差的毫秒数
                var usedTime = Date.parse(new Date()) - Date.parse(new Date(this.startDay));
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
    
    #PhoneFooter {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 5px 0;
        margin-top: auto;
    }
</style >

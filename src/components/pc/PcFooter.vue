<template>
    <div id='PcFooter'>
        <p>声明：本站内容为个人兴趣自制且仅供试听，严禁用于商业用途</p>
        <p>
				<span>
					制作与维护：
					<a href='https://5ixf.vip' target='_Blank'>疯子</a>
				</span>
            <span class='white-space'></span>
            <span>
					B站：
					<a href='https://space.bilibili.com/13938564' target='_Blank'>0疯_子0</a>
				</span>
            <span class='white-space'></span>
            <span>
					前端开源地址：
					<a href='https://github.com/0fengzi0/vocaltts-html' target='_Blank'>Github</a>
					<span class='white-space'></span>
					<a href='https://gitee.com/feng__zi/vocaltts-html' target='_Blank'>Gitee</a>
				</span>
        </p>
        <p>
            友情合作：
            <a href='https://space.bilibili.com/42973598' target='_Blank'>VirtualVocal粉丝大会应援团</a>
            <span class='white-space'></span>
            <a href='http://www.lastdream.net/' target='_Blank'>语音时代</a>
            <span class='white-space'></span>
            <a href='https://space.bilibili.com/134558' target='_Blank'>世界协奏之歌</a>
            <span class='white-space'></span>
            <a href='https://space.bilibili.com/24921468' target='_Blank'>呆呆酱机器人</a>
            <span class='white-space'></span>
        </p>
        <p>本站建立时间{{ startDay }}，已提供服务{{ runDays }}天，当前版本V{{ version }}</p>
        <p v-html='record'><!--<img src="../assets/beiantubiao.png" alt="" width="13px" height="13px" />--></p>
    </div>
</template>

<script>
import config from '/package.json';

export default {
    name: 'PcFooter',
    // 引用的组件
    components: {},
    data() {
        return {
            // 建站日期
            startDay: '2018-11-21',
            // 当前版本
            version: config.version,
            // 运行天数
            runDays: 0,
            // 备案信息
            record: process.env.VUE_APP_RECORD
        };
    },
    // 计算属性
    computed: {},
    // 初始化完成
    mounted() {
        this.countRunDays();
    },
    // 其他函数
    methods: {
        // 计算运行天数
        countRunDays() {
            // 两个时间戳相差的毫秒数
            var usedTime = Date.parse(new Date()) - Date.parse(new Date(this.startDay));
            // 计算相差的天数
            this.runDays = Math.floor(usedTime / (24 * 3600 * 1000));
        },
    }
};
</script>

<style scoped>

a {
    text-decoration: none;
    color: black !important;
}

a:hover {
    color: #ee0000 !important;
}

p {
    margin: 10px 0 !important;
}

#PcFooter {
    width: 800px;
    position: absolute;
    top: 420px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 30px auto;
    text-align: center;
}

.white-space {
    margin: 0 5px;
}
</style>
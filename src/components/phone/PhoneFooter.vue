<template>
    <div id='PhoneFooter' class='text-center'>
        <div>本站仅提供语音合成二创和试听</div>
        <div>严禁任何商业用途！</div>
        <div>洛天依版权归上海禾念信息科技有限公司所有</div>
        <div v-html='record'></div>
    </div>
</template>

<script>

export default {
    name: 'PhoneFooter',
    // 引用组件
    components: {},
    data() {
        return {
            // 备案信息
            record: process.env.VUE_APP_RECORD
        };
    },

    // 初始化完成
    mounted() {
    },

    // 其他函数
    methods: {}
};
</script>

<style scoped>

a {
    text-decoration: none;
}

#PhoneFooter {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 0;
    margin-top: auto;
}
</style>

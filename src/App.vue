<template>
    <v-app id='app' @contextmenu.prevent=''>
        <router-view/>
        <!--全局提示条-->
        <v-snackbar
                v-model='snackBarModel'
                :color='this.$store.state.snackBar.model.color'
                right top
        >
            {{ $store.state.snackBar.model.message }}
        </v-snackbar>
    </v-app>
</template>

<script>
export default {
    name: 'app',
    // 计算属性
    computed: {
        snackBarModel: {
            get: function () {
                return this.$store.state.snackBar.model.isShow;
            },
            set: function (res) {
                this.$store.commit('snackBarHide');
            }
        }
    },
    // 初始化完成
    mounted () {
        console.info(window.document.body.offsetWidth >= 900 ? '当前是电脑页面' : '当前是手机页面');
        console.info('当前环境:' + process.env.VUE_APP_APPID);
    },
    // 其他函数
    methods: {}
};
</script>

<style lang='scss'>
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
</style>

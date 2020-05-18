<template >
    <div id="SnackBar" >
        <v-snackbar
                :color="snackBarData.color"
                right
                top
                v-model="snackBarData.isShow"
        >
            {{ snackBarData.msg }}
        </v-snackbar >
    </div >
</template >

<script >
    import Bus from "./Bus";

    export default {
        name: "SnackBar",
        // 引用组件
        components: {},
        data() {
            return {
                snackBarData: {
                    isShow: false,
                    msg: "",
                    color: ""
                }
            };
        },

        // 初始化完成
        mounted() {
            let that = this;
            // 监听提示条事件
            Bus.$on("showSnackBar", (res) => {
                that.snackBarData.msg = res.msg;
                that.snackBarData.color = res.color == null ? 'primary' : res.color;

                that.snackBarData.isShow = true;
            })
        },

        // 其他函数
        methods: {}
    };
</script >

<style lang="scss" scoped >
    #SnackBar {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style >

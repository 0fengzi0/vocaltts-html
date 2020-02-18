<template >
    <div id="promptModel" >
        <div class="model" >
            <div class="title" >
                {{modelTitle}}
            </div >
            <div class="msg" >{{modelMsg}}</div >
            <div class="endButton" >
                <div class="closeButton" @click="closePrompt" >关闭</div >
            </div >
        </div >
    </div >
</template >

<script >
    export default {
        name: "promptModel",
        // 引用组件
        components: {},
        props: {
            modelTitle: {
                type: String,
                default: '标题'
            },
            modelMsg: {
                type: String,
                default: '内容'
            }
        },
        data() {
            return {};
        },

        // 初始化完成
        mounted() {

        },

        // 其他函数
        methods: {
            closePrompt() {
                this.$emit("close-prompt");
            }
        }
    };
</script >

<style scoped >
    #promptModel {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.8);
    }
    
    .model {
        width: 400px;
        height: 300px;
        background-color: white;
        margin: auto;
        border-radius: 15px;
    }
    
    .title {
        text-align: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 30px;
        /* 防止字数超长 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .msg {
        width: calc(100% - 50px);
        height: 200px;
        padding: 10px 25px;
    }
    
    .endButton {
        text-align: center;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
    }
    
    .closeButton {
        width: 100px;
        margin: auto;
    }
    
    .closeButton:hover {
        cursor: pointer;
    }

</style >

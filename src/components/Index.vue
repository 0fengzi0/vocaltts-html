<template >
    <div id="Index" >
        <PcIndex v-if="isPC" ></PcIndex >
        <PhoneIndex v-else ></PhoneIndex >
    </div >
</template >

<script >
    import PcIndex from './pc/PcIndex'
    import PhoneIndex from "./mobel/PhoneIndex";
    
    export default {
        name : "Index",
        // 引用组件
        components : { PcIndex, PhoneIndex },
        data() {
            return {
                isPC : true
            };
        },
        
        // 初始化完成
        mounted() {
            window.document.body.offsetWidth > 900 ? this.isPC = true : this.isPC = false;
        },
        
        // 其他函数
        methods : {}
    };
</script >

<style scoped lang="scss" >
    #Index {
        width: 100%;
        height: 100%;
    }
</style >

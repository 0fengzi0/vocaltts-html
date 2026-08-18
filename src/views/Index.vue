<template>
    <div id='Index'>
        <!--pc页面主体-->
        <PcIndex v-if='isPc'></PcIndex>
        <!--手机页面主体-->
        <PhoneIndex v-else></PhoneIndex>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue';

const PhoneIndex = defineAsyncComponent(() => import('../views/Phone/PhoneIndex.vue'));
const PcIndex = defineAsyncComponent(() => import('../views/Pc/PcIndex'));

export default {
    name: 'Index',
    // 引用组件
    components: {
        PhoneIndex,
        PcIndex,
    },
    data() {
        return {
            // 是否是电脑页面
            isPc: false,
        };
    },

    // 初始化完成
    mounted() {
        window.document.body.offsetWidth >= 900 ? this.isPc = true : this.isPc = false;
    },

    // 其他函数
    methods: {}
};
</script>

<style lang='scss' scoped>
#Index {
    width: 100%;
    height: 100%;
}
</style>

import Vue from 'vue';
import vuescroll from 'vuescroll';

const opts = {
    name: 'myScroll',
    ops: {
        scrollPanel: {
            scrollingX: false
        },
        bar: {
            hoverStyle: true,
            //是否只有滚动的时候才显示滚动条
            onlyShowBarOnScroll: false,
            // 滚动条颜色
            background: '#66CCFF'
        }
    }
}

Vue.use(vuescroll, opts);

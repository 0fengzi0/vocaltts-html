<template>
    <div id='PcNotice'>
        <div class='placard_div'>
            <div v-for='(list, index) in placard_list' v-show='list.show' :key='index'
                 :class="list.animation ? 'hide_placard_list_animation' : ''" class='placard_list'>
                <div class='placard_head'>
                    <div class='placard_title'>{{ list.title }}</div>
                    <div class='placard_time'>{{ list.create_date }}</div>
                    <div style='clear: both;'></div>
                </div>
                <div class='placard_body'>
                    <div class='placard_msg' v-html='list.msg'></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NoticeApi from '@/api/NoticeApi';

export default {
    name: 'PcNotice',
    data() {
        return {
            // 公告列表
            placard_list: [
                {
                    id: 0,
                    title: '',
                    msg: '',
                    time: '',
                }
            ],
        };
    },

    // 初始化完成
    mounted() {
        // 获取公告列表
        this.get_placard_list();
    },

    // 其他函数
    methods: {
        // 获取公告列表
        get_placard_list: function () {
            let that = this;
            NoticeApi.getPlacardList().then(res => {
                that.placard_list = [];
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].show = true;
                    res.data[i].animation = false;
                    that.placard_list.unshift(res.data[i]);
                }
                for (let i = 0; i < that.placard_list.length; i++) {
                    setTimeout(function () {
                        that.animation_hide_placard(i);
                    }, 5000 * (i + 1));
                }
            });
        },

        // 隐藏公告
        animation_hide_placard: function (item) {
            let that = this;
            that.placard_list[item].animation = true;
            setTimeout(function () {
                that.placard_list[item].show = false;
            }, 1500);
        },

    }
};
</script>

<style scoped>

.placard_div {
    position: absolute;
    top: 0;
    right: 10px;
    /* height: 235px; */
    overflow: hidden;
    z-index: 3;
}

.placard_list {
    background-color: white;
    width: 300px;
    margin: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 1px gray solid;
    box-shadow: 8px 8px 4px 0 rgba(0, 0, 0, 0.6);
}

.hide_placard_list_animation {
    transition: opacity 0.5s;
    opacity: 0;
}

.placard_title {
    float: left;
    width: 130px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    font-weight: 900;
}

.placard_time {
    float: right;
}

</style>

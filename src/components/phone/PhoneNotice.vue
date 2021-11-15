<template>
    <div id='PhoneNotice'>
        <v-card
            v-for='(item,index) in placardList'
            :key='index'
            class='ma-2 pa-0'
            color='rgba(255,255,255,0.8)'
            link
        >
            <v-card-text class='d-flex flex-column pa-3'>
                <div class='notice-top d-flex'>
                    <div class='notice-title'>{{ item.title }}</div>
                    <div class='notice-time'>{{ item.create_time }}</div>
                </div>
                <v-divider></v-divider>
                <div class='notice-body' v-html='item.msg'></div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import NoticeApi from '@/api/NoticeApi';

export default {
    name: 'PhoneNotice',
    data() {
        return {
            // 公告列表
            placardList: [
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
                that.placardList = [];
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].show = true;
                    res.data[i].animation = false;
                    that.placardList.unshift(res.data[i]);
                }
            });
        },
    }
};
</script>

<style lang='scss' scoped>
#PhoneNotice {
    width: 100%;
}

.notice-top {
    flex: 0 0 30px;

    .notice-title {
        flex: 1;
        font-size: 1.2rem;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .notice-time {
        flex: 0 0 150px;
        font-size: 1rem;
    }

}
</style>

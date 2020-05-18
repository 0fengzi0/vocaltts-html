<template >
    <div id="PhoneNotice" >
        <v-card
                :key="index"
                class="ma-2 pa-0"
                color="rgba(255,255,255,0.8)"
                link
                v-for="(item,index) in placardList"
        >
            <v-card-text class="d-flex flex-column pa-3" >
                <div class="notice-top d-flex" >
                    <div class="notice-title" >{{ item.title }}</div >
                    <div class="notice-time" >{{ item.time }}</div >
                </div >
                <v-divider ></v-divider >
                <div class="notice-body" v-html="item.msg" ></div >
            </v-card-text >
        </v-card >
    </div >
</template >

<script >
    import HttpClient from "../Utils/HttpClient";

    export default {
        name: "PhoneNotice",
        data() {
            return {
                // 公告列表
                placardList: [
                    {
                        id: 0,
                        title: "",
                        msg: "",
                        time: "",
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
                HttpClient.doHttp('/vocaltts/Placard/getplacard', 'get').then(res => {
                    if (res.code === 200) {
                        that.placardList = [];
                        for (let i in res.placrdList) {
                            res.placrdList[i].show = true;
                            res.placrdList[i].animation = false;
                            that.placardList.unshift(res.placrdList[i]);
                        }
                    }
                });
            },

        }
    };
</script >

<style lang="scss" scoped >
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
</style >

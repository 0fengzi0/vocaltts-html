<template >
    <div id="Notice" >
        <div class="placard_div" >
            <div class="placard_list" :class="list.animation ? 'hide_placard_list_animation' : ''" v-show="list.show"
                 v-for="(list, index) in placard_list" :key="index" >
                <div class="placard_head" >
                    <div class="placard_title" >{{ list.title }}</div >
                    <div class="placard_time" >{{ list.time }}</div >
                    <div style="clear: both;" ></div >
                </div >
                <div class="placard_body" >
                    <div class="placard_msg" v-html="list.msg" ></div >
                </div >
            </div >
        </div >
    </div >
</template >

<script >
    import config from "../assets/js/config";

    export default {
        name: "Notice",
        data() {
            return {
                // 公告列表
                placard_list: [],
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
                this.axios
                    .get(config.serviceApi + "/vocaltts/Placard/getplacard")
                    .then(function (res) {
                        that.placard_list = [];
                        for (let i in res.data.placrdList) {
                            res.data.placrdList[i].show = true;
                            res.data.placrdList[i].animation = false;
                            that.placard_list.unshift(res.data.placrdList[i]);
                        }
                        for (let i in that.placard_list) {
                            setTimeout(function () {
                                that.animation_hide_placard(i);
                            }, 5000 * (parseInt(i) + 1));
                        }
                    })
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
</script >

<style scoped >
    
    .placard_div {
        position: absolute;
        top: 0px;
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
        box-shadow: 8px 8px 4px 0px rgba(0, 0, 0, 0.6);
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

</style >

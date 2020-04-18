<template >
    <div id="PhoneIndex" >
        <!--头部状态栏-->
        <v-app-bar
            dense
            color="rgba(255,255,255,0.8)"
        >
            <v-avatar
                size="32"
                class="mr-2"
            >
                <img
                    src="https://s1.ax1x.com/2020/04/17/JVOam8.jpg"
                >
            </v-avatar >
            <v-toolbar-title >VOCALTTS-V家语音合成</v-toolbar-title >
            <v-spacer ></v-spacer >
            <v-app-bar-nav-icon @click="drawer=!drawer" ></v-app-bar-nav-icon >
        </v-app-bar >
        <!--右侧弹出菜单-->
        <v-navigation-drawer
            v-model="drawer"
            fixed
            clipped
            right
            temporary
        >
            <v-list >
                <v-list-item-group >
                    <v-list-item v-for="(item,index) in phoneMenuList" :key="index" @click="chikeMenu(item.id)" >
                        <v-list-item-icon >
                            <v-icon v-text="item.icon" ></v-icon >
                        </v-list-item-icon >
                        <v-list-item-content >
                            <v-list-item-title v-text="item.text" ></v-list-item-title >
                        </v-list-item-content >
                    </v-list-item >
                </v-list-item-group >
            </v-list >
        </v-navigation-drawer >
        <!--页面-->
        <div class="PhonePage" >
            <PhoneSynth v-if="phonePage===0" ></PhoneSynth >
            <PhoneNotice v-else-if="phonePage===1" ></PhoneNotice >
            <PhoneAbout v-else ></PhoneAbout >
        </div >
    </div >
</template >

<script >
    const PhoneSynth = () => import('./PhoneSynth');
    const PhoneNotice = () => import('./PhoneNotice');
    const PhoneAbout = () => import('./PhoneAbout');
    
    export default {
        name : "PhoneIndex",
        // 引用组件
        components : {
            PhoneSynth,
            PhoneNotice,
            PhoneAbout,
        },
        data() {
            return {
                drawer : false,
                // 选中手机分页
                phonePage : 0,
                phoneMenuList : [
                    {
                        id : 0,
                        text : '首页',
                        icon : 'mdi-voice'
                    },
                    {
                        id : 1,
                        text : '公告',
                        icon : 'mdi-bulletin-board'
                    },
                    {
                        id : 2,
                        text : '关于',
                        icon : 'mdi-information'
                    }
                ],
            };
        },
        
        // 初始化完成
        mounted() {
            let that = this;
        },
        
        // 其他函数
        methods : {
            // 切换页面
            chikeMenu(id) {
                this.phonePage = id;
                this.drawer = false;
            }
        }
    };
</script >

<style scoped lang="scss" >
    #PhoneIndex {
        width: 100%;
        height: 100%;
        background: url("https://s2.ax1x.com/2020/02/17/3ieg9U.jpg") no-repeat top -50px right -140px;
        
        .PhonePage {
            width: 100%;
            height: calc(100% - 48px);
            overflow-y: auto !important;
        }
    }

</style >

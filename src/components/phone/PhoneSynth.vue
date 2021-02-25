<template>
    <div id='PhoneSynth' class='d-flex flex-column'>
        <!--合成文本输入卡片-->
        <v-card class='mt-3 mb-1 ml-auto mr-auto' color='rgba(255,255,255,0.8)' width='94vw'>
            <v-card-text>
                <v-textarea v-model='ttsData.text' :counter='maxInput' clearable no-resize
                            placeholder='你好，语音时代'></v-textarea>
            </v-card-text>
        </v-card>
        <!--发音人选项卡-->
        <v-card class='mt-2 mb-2 ml-auto mr-auto' color='rgba(255,255,255,0.8)' width='94vw'>
            <v-card-text class='pl-1 pr-1 pt-0 pb-0'>
                <div class='vocal-list pb-2 pt-2'>
                    <v-card
                            v-for='(item, index) in vocalList'
                            v-show="item.status === 'true'"
                            :key='index'
                            :class="ttsData.voice === index ? 'chickBGC' : ''"
                            class='vocal ma-1 pa-1'
                            link
                            @click='chickVoice(index)'
                    >
                        <v-card-text class='vocal-info-card pa-0 pr-1'>
                            <div class='vocal-img'><img alt='item.name' :src='item.headimg'/></div>
                            <div class='vocal-msg'>
                                <div class='vocal-name'>{{ item.name }}</div>
                                <div class='vocal-text'>{{ item.presentation }}</div>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>
        <!--合成参数面板-->
        <v-card class='mt-2 mb-2 ml-auto mr-auto' color='rgba(255,255,255,0.8)' width='94vw'>
            <v-card-text>
                <v-slider v-model='ttsData.pit' :thumb-size='24' dense disabled label='音高' max='100' min='-100'
                          thumb-label='always'></v-slider>
                <v-slider v-model='ttsData.vel' :thumb-size='24' dense label='语速' max='100' min='-100'
                          thumb-label='always'></v-slider>
                <v-slider v-model='ttsData.vol' :thumb-size='24' dense label='音量' max='100' min='-100'
                          thumb-label='always'></v-slider>
            </v-card-text>
        </v-card>
        <!--合成按钮组-->
        <div class='button-list mt-2 mb-2 d-flex align-content-space-between'>
            <v-btn color='info' @click='downLoadTTSFile'>下载音频</v-btn>
            <v-btn class='ttsPlay' color='success' @click='playTts'>
                {{ audioStatus === 0 ? '合成中' : audioStatus === 1 ? '播放' : '停止' }}
            </v-btn>
            <v-btn color='error' @click='ResetTTSDate'>重置</v-btn>
        </div>
        <!--播放器-->
        <div v-show='false' class='audio'>
            <audio ref='audio' @pause='onPause' @play='onPlay'>
                <source controls preload='none' src='#' type='audio/wav'/>
                您的浏览器不支持音频播放。
            </audio>
        </div>
        <PhoneFooter></PhoneFooter>
    </div>
</template>

<script>
import PhoneFooter from './PhoneFooter';
import VocalApi from '@/api/VocalApi';
import SynthApi from '@/api/SynthApi';
import VaptchaService from '@/api/VaptchaService';
import file from '@/plugins/file';

export default {
    name: 'PhoneSynth',
    // 引用组件
    components: { PhoneFooter },
    data () {
        return {
            // 合成参数
            ttsData: {
                text : '',
                voice: 0,
                pit  : 0,
                vel  : 0,
                vol  : 0
            },
            // 历史合成参数
            oldTTSData: {
                text : '!`100',
                voice: 0,
                pit  : 0,
                vel  : 0,
                vol  : 0
            },
            // 发音人列表
            vocalList: [
                {
                    id          : '1',
                    code        : 'lty',
                    name        : '洛天依',
                    version     : 't2',
                    headimg     : 'https://s2.ax1x.com/2019/11/16/M0mbDS.png',
                    presentation: '该音源为T2音源',
                    status      : 'true'
                }
            ],
            // tts状态 0合成1播放2停止
            audioStatus: 1,
            // 合成后的音频数据
            waveData: '',
            // 最大输入字数
            maxInput: 100
        };
    },
    
    watch: {
        group () {
            this.drawer = false;
        }
    },
    
    // 初始化完成
    mounted () {
        let that = this;
        // 获取发音人列表
        that.getVocaList();
    },
    
    // 其他函数
    methods: {
        // 获取发音人列表
        getVocaList () {
            let that = this;
            VocalApi.getVocalList().then(res => {
                that.vocalList = res.data;
                that.chooseCanUseVoice();
            });
        },
        
        // 切换发音人
        chickVoice (index) {
            let that = this;
            that.ttsData.voice = index;
        },
        
        // 首次加载自动选择发音人
        chooseCanUseVoice () {
            let that = this;
            for (let i = 0; i < that.vocalList.length; i++) {
                if (that.vocalList[i].status === 'true') {
                    that.chickVoice(i);
                    break;
                }
            }
        },
        
        // 点击播放按钮
        playTts () {
            let that = this;
            if (that.ttsData.text !== '' && that.ttsData.text.length <= that.maxInput) {
                if (that.audioStatus === 1) {
                    if (JSON.stringify(that.oldTTSData) !== JSON.stringify(that.ttsData)) {
                        that.doSynth();
                    } else {
                        // 播放tts
                        that.startWave();
                    }
                } else if (this.audioStatus === 2) {
                    // 停止合成
                    that.PauseWave();
                }
            } else {
                // 提示合成文本为空
                that.$store.commit('snackBarShow', {
                    message: '合成文本为空,请重新输入',
                    color  : 'warning'
                });
            }
        },
        
        // 提交合成信息
        async doSynth () {
            let that = this;
            let vaptchaObj = await VaptchaService.getVaptchObj();
            // 显示合成状态
            that.onWait();
            await vaptchaObj.listen('pass', () => {
                SynthApi.doSynth(that.vocalList[that.ttsData.voice]['version'], that.vocalList[that.ttsData.voice]['code'], that.ttsData.text, vaptchaObj.getToken()).then(function (res) {
                    console.log('返回的数据' + res);
                    that.waveData = res.data;
                    // 深拷贝,记录历史合成数据
                    Object.assign(that.oldTTSData, that.ttsData);
                    // 播放声音
                    that.startWave();
                }).catch(() => {
                    // 出错时状态归位
                    that.onPause();
                }).finally(() => {
                    //重置验证码
                    vaptchaObj.reset();
                });
                
            });
            await vaptchaObj.validate();
        },
        
        // 下载合成的音频
        downLoadTTSFile () {
            if (this.waveData !== '' && this.waveData != null) {
                file.download(this.inputTtsText, this.waveData);
            } else {
                this.$store.commit('snackBarShow', {
                    message: '还没有合成音频哦',
                    color  : 'warning'
                });
            }
        },
        
        // 重置合成参数
        ResetTTSDate () {
            let that = this;
            // 重置发音状态
            that.onPause();
            // 重置参数
            that.ttsData = {
                text : '',
                voice: 0,
                pit  : 0,
                vel  : 0,
                vol  : 0
            };
            // 重置发音人
            that.chooseCanUseVoice();
        },
        
        // 播放
        startWave () {
            this.$refs.audio.src = 'data:audio/wav;base64,' + this.waveData;
            this.$refs.audio.play();
        },
        
        // 当播放等待合成
        onWait () {
            this.audioStatus = 0;
        },
        
        // 当播放停止
        onPause () {
            this.audioStatus = 1;
        },
        
        // 当播放开始
        onPlay () {
            this.audioStatus = 2;
        }
    }
};
</script>

<style lang='scss' scoped>
#PhoneSynth {
    width: 100%;
    height: 100%;
    position: relative;
}

.vocal-list {
    display: flex;
    flex-direction: row;
    overflow-y: auto !important;
    
    .vocal {
        flex: 0 0 50px;
    }
}

.vocal-info-card {
    display: flex;
    width: 150px;
    height: 50px;
    
    .vocal-img {
        flex: 0 0 50px;
        height: 50px;
        margin: auto 3px auto 0;
        
        img {
            width: 100%;
            height: 100%;
            display: block;
            padding: 0;
            margin: 0;
        }
    }
    
    .vocal-msg {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: calc(100% - 50px);
        
        .vocal-name {
            flex: 0 0 30px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 30px;
        }
        
        .vocal-text {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}

.button-list {
    width: 100%;
    
    button {
        flex: 0 0 80px;
        margin: 5px auto;
    }
    
    .ttsPlay {
        flex: 0 0 120px;
    }
}

.chickBGC {
    background-color: #abb2bf !important;
}

.pageEnd {
    width: 100%;
    margin-top: 10px;
    padding: 5px 10px;
    font-size: 0.8rem;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    
    a {
        text-decoration: none;
        color: #000000;
    }
    
    a:hover {
        color: #ee0000 !important;
    }
    
    p {
        padding: 0;
        margin: 5px auto;
    }
    
    .white-space {
        margin: 0 5px;
    }
}
</style>

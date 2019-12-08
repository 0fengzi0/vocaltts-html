<template>
    <div id="page">
        <div class="glass">
            <div class="ttsPage">
                <div class="ttsPage-left">
                    <div class="vocalList">
                        <div
                                class="vocal"
                                v-for="(list, index) in vocalList"
                                :class="list.status == 'true' ? (chickId == index ? 'chickId' : 'canChoose') : 'cantChoose'"
                                :key="index"
                                @click="chickVoice(index)"
                        >
                            <img :src="list.headimg" :alt="list.name" id="vocalHeadImg" />
                            <div class="vocalMsg">
                                <div id="vocalName">{{ list.name }}</div>
                                <div id="vocalPresentation">{{ list.presentation }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ttsPage-right">
                    <div class="textInput"><textarea id="ttsText" maxlength="60" placeholder="请输入要合成的文本"
                                                     @input="updateTtsText"></textarea></div>
                    <div class="ttsConfig">
                        <div class="ttsConfig-left cantChoose">
                            <div class="setting">
                                <span class="parameterName">语调:</span>
                                <input class="parameterInput" type="range" name="pit" step="10" min="-100" max="100"
                                       value="0" />
                            </div>
                            <div class="setting">
                                <span class="parameterName">语速:</span>
                                <input class="parameterInput" type="range" name="vel" step="10" min="-100" max="100"
                                       value="0" />
                            </div>
                            <div class="setting">
                                <span class="parameterName">音量:</span>
                                <input class="parameterInput" type="range" name="vol" step="10" min="-100" max="100"
                                       value="0" />
                            </div>
                            <div class="setting">
                                <span class="parameterName">尽请期待...</span>
                                <!-- <input class="parameterInput" type="range" name="more" step="0" min="0" max="100"   /> -->
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div class="ttsConfig-right">
                            <div class="ttsPlay">
                                <div id="ttsPlay" @click="playTts()">{{ audioStatus == 0 ? '合成中' : audioStatus == 1 ?
                                                                     '播放' : '停止' }}
                                </div>
                                <span id="white-space"></span>
                                <div id="ttsWaveDownload" @click="downLoadTTSFile()">
                                    <svg t="1575004811319" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="1976" width="50" height="25">
                                        <path
                                                d="M832 768v64H192v-64H128v128h768v-128zM822.624 438.624l-45.248-45.248L544 626.752V128h-64v498.752l-233.376-233.376-45.248 45.248L512 749.248z"
                                                fill="#ffffff"
                                                p-id="1977"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ttsDownloadPage"><a target="_Blank"
                                                            href="http://www.lastdream.net/forum.php?mod=viewthread&amp;tid=1081">点击下载PC版</a>
                            </div>
                        </div>
                    </div>
                    <div class="audio">
                        <audio ref="audio" @pause="onPause" @play="onPlay">
                            <source preload="none" controls src="#" type="audio/wav" />
                            您的浏览器不支持音频播放。
                        </audio>
                    </div>
                </div>
            </div>
        </div>
        <div class="pageEnd">
            <p>声明：本站内容为个人兴趣自制且仅供试听，严禁用于商业用途</p>
            <p>
				<span>
					制作与维护：
					<a target="_Blank" href="https://5ixf.cc">疯子</a>
				</span>
                <span id="white-space"></span>
                <span>
					B站：
					<a target="_Blank" href="https://space.bilibili.com/13938564">0疯_子0</a>
				</span>
                <span id="white-space"></span>
                <span>
					开源地址：
					<a target="_Blank" href="https://github.com/0fengzi0/vocaltts-html">Github</a>
				</span>
            </p>
            <p>
                友情合作：
                <a target="_Blank" href="http://www.lastdream.net/">语音时代</a>
                <span id="white-space"></span>
                <a target="_Blank" href="https://space.bilibili.com/42973598">VirtualVocal粉丝大会应援团</a>
                <span id="white-space"></span>
                <a target="_Blank" href="https://space.bilibili.com/134558">世界协奏之歌</a>
                <span id="white-space"></span>
                <a target="_Blank" href="https://space.bilibili.com/24921468">呆呆酱机器人</a>
                <span id="white-space"></span>
            </p>
            <p>本站建立时间{{ startDay }}，已提供服务{{ runDays }}天</p>
        </div>
        <transition name="modal">
            <div>
                <div class="pageWindow" v-show="msgModalShow">
                    <div class="pageWindowBack"></div>
                    <div class="pageWindowModal">
                        <div class="modalTitle">{{ msgModal.title }}</div>
                        
                        <div class="modalMsg">{{ msgModal.msg }}</div>
                        <div id="msgModalBotton" @click="msgModalShow = !msgModalShow">我知道了</div>
                    </div>
                </div>
                <div class="pageWindow" v-show="vcodeModalShow">
                    <div class="pageWindowBack"></div>
                    <div class="pageWindowModal">
                        <div class="modalTitle">
                            <div id="modalTitleText">请进行验证</div>
                            <div id="modalTitleClose" @click="vcodeModalShow = !vcodeModalShow">
                                <svg t="1575124566377" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" p-id="1981" width="30" height="30">
                                    <path
                                            d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384m0-832C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64"
                                            fill="#d81e06"
                                            p-id="1982"
                                    ></path>
                                    <path
                                            d="M665.376 313.376L512 466.752l-153.376-153.376-45.248 45.248L466.752 512l-153.376 153.376 45.248 45.248L512 557.248l153.376 153.376 45.248-45.248L557.248 512l153.376-153.376z"
                                            fill="#d81e06"
                                            p-id="1983"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div class="modalMsg" @click="updatevcode()"><img id="vcode" :src="vcodeImgUrl" alt="" /></div>
                        <div class="inputDiv">
                            <input id="vcodeInput" type="text" maxlength="4" @input="getInputVcode" />
                            <input id="vcodeSubmit" type="button" value="提交" @click="doSynth" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import config from '../../public/config.js';

    export default {
        data() {
            return {
                // 建站日期
                startDay: '2018-11-21',
                // 运行天数
                runDays: 0,
                // 发音人列表
                vocalList: [
                    {
                        id: '1',
                        code: 'lty',
                        name: '洛天依',
                        version: 't2',
                        headimg: 'https://s2.ax1x.com/2019/11/16/M0mbDS.png',
                        presentation: '该音源为T2音源',
                        status: 'true'
                    }
                ],
                // tts状态 0合成1播放2停止
                audioStatus: 1,
                // 合成后的音频文件名
                wavePath: 'http://tts.5ixf.cc/audio/helloLastDream.wav',
                // 输入的TTS文本
                inputTtsText: '',
                // 历史TTS文本
                oldTtsText: '',
                // 选中的发音人
                chickId: -1,
                // 消息弹窗是否显示
                msgModalShow: false,
                // 消息弹窗内容
                msgModal: {
                    title: '标题',
                    msg: '内容'
                },
                // 验证码图片地址
                vcodeImgUrl: '',
                // 验证码弹窗是否显示
                vcodeModalShow: false,
                // 输入的验证码
                inputVcode: ''
            };
        },

        // 初始化完成
        mounted() {
            // 计算运行天数
            this.countRunDays();
            // 获取发音人列表
            this.getVocaList();
        },

        // 其他函数
        methods: {
            // 计算运行天数
            countRunDays() {
                // 两个时间戳相差的毫秒数
                var usedTime = Date.parse(new Date()) - Date.parse(new Date(this.startDay));
                // 计算相差的天数
                this.runDays = Math.floor(usedTime / (24 * 3600 * 1000));
            },

            // 播放
            startWave() {
                this.$refs.audio.src = this.wavePath;
                this.$refs.audio.play();
            },

            // 停止播放
            PauseWave() {
                this.$refs.audio.pause();
            },

            // 当播放等待合成
            onWait() {
                this.audioStatus = 0;
            },

            // 当播放停止
            onPause() {
                this.audioStatus = 1;
            },

            // 当播放开始
            onPlay() {
                this.audioStatus = 2;
            },

            // 切换发音人
            chickVoice(index) {
                this.chickId = index;
                // 清除历史信息
                this.oldTtsText = '';
            },

            // 下载合成的音频
            downLoadTTSFile() {
                window.open(this.wavePath);
            },

            // 点击播放按钮
            playTts: function () {
                if (this.inputTtsText != '') {
                    if (this.audioStatus == 1) {
                        if (this.oldTtsText != this.inputTtsText) {
                            // 显示验证码
                            this.vcodeModalShow = true;
                            this.updatevcode();
                        } else {
                            // 播放tts
                            this.startWave();
                        }
                    } else if (this.audio_status == 2) {
                        // 停止合成
                        this.PauseWave();
                    }
                } else {
                    // 提示合成文本为空
                    this.msgModal = {
                        title: '提示信息',
                        msg: '合成文本为空,请输入文本后合成'
                    };
                    this.msgModalShow = true;
                }
            },

            // 更新验证码
            updatevcode() {
                this.vcodeImgUrl = config.serviceApi + 'vocaltts/synth/getvcode?app=web&uid=' + config.appid + "&time=" + new Date().getTime();
            },

            // 更新输入的合成文本
            updateTtsText(e) {
                this.inputTtsText = e.srcElement.value;
                this.oldTtsText = '';
            },

            // 提交合成信息
            doSynth() {
                let that = this;
                // 关闭弹窗
                that.vcodeModalShow = false;
                // 显示合成状态
                that.onWait();
                var qs = require('qs');
                this.axios.post(config.serviceApi + 'vocaltts/synth/dosynth', qs.stringify({
                    'app': 'web',
                    'uid': config.appid,
                    'version': that.vocalList[that.chickId]['version'],
                    'voice': that.vocalList[that.chickId]['code'],
                    'text': that.inputTtsText,
                    'vel': '0',
                    'vol': '0',
                    'pit': '0',
                    'time': new Date().getTime(),
                    'randstr': that.inputVcode,
                })).then(function (res) {
                    if (res.data.code == 200) {
                        that.wavePath = config.serviceApi + "vocaltts/synth/getwave/wave/" + res.data.fileName;
                        that.oldTtsText = that.inputTtsText;
                        // 播放声音
                        that.startWave();
                    } else {
                        that.onPause();
                        that.msgModal = {
                            title: '合成失败',
                            msg: res.data.msg
                        };
                        that.msgModalShow = true;
                    }
                }).catch(function (res) {
                    that.onPause();
                    that.msgModal = {
                        title: '合成失败',
                        msg: '出现未知错误'
                    };
                    that.msgModalShow = true;
                })
            },

            // 获取发音人列表
            getVocaList() {
                let that = this;
                var qs = require('qs');
                this.axios
                    .post(config.serviceApi + 'vocaltts/voca/getvocalist')
                    .then(function (res) {
                        if (res.data.code == 200) {
                            that.vocalList = res.data.data;
                            // 检测并选中第一个可用音源
                            that.chooseCanUseVoice();
                        } else {
                            console.log('发生错误:' + res.data);
                            that.msgModal = {
                                title: '获取发音人列表失败',
                                msg: res.data.msg
                            };
                            that.msgModalShow = true;
                        }
                    })
                    .catch(function (res) {
                        that.msgModal = {
                            title: '访问出错',
                            msg: '出现未知错误'
                        };
                        that.msgModalShow = true;
                    })
            },

            // 输入的验证码
            getInputVcode(e) {
                this.inputVcode = e.srcElement.value;
            },

            // 首次加载自动选择发音人
            chooseCanUseVoice() {
                for (let i = 0; i < this.vocalList.length; i++) {
                    if (this.vocalList[i].status == 'true') {
                        this.chickId = i;
                        break;
                    }
                }
            }

        }
    };
</script>

<style scoped>
    a {
        text-decoration: none;
        color: black;
    }
    
    a:hover {
        color: #ee0000;
    }
    
    #page {
        width: 100%;
        height: 100%;
        background: url(../assets/0.jpg) no-repeat center;
        position: fixed;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
    }
    
    .glass {
        width: 800px;
        height: 400px;
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: inherit;
        overflow: hidden;
        margin: 1% auto auto auto;
        border-radius: 15px;
        padding: 8px 15px 8px 10px;
        box-shadow: 15px 15px 7.5px rgba(0, 0, 0, 0.6);
    }
    
    .glass::before {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: inherit;
        background-attachment: fixed;
        filter: blur(10px);
    }
    
    .glass::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.25);
    }
    
    .ttsPage {
        z-index: 1;
        color: white;
        position: relative;
        margin: 0;
    }
    
    .pageEnd {
        width: 800px;
        position: absolute;
        top: 440px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        margin: auto;
        text-align: center;
    }
    
    #white-space {
        margin-left: 5px;
        margin-right: 5px;
    }
    
    .ttsPage-left {
        width: 200px;
        height: 400px;
        position: relative;
        overflow: hidden;
        float: left;
    }
    
    .vocalList {
        position: absolute;
        left: 0;
        top: 0;
        right: -17px;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-left: 5px;
    }
    
    .vocal {
        margin-right: 17px;
        border: 1px #bfbfbf none;
        border-radius: 5px;
        height: 50px;
        width: 181px;
        margin-top: 8px;
        margin-bottom: 8px;
        margin-right: 20px;
    }
    
    .canChoose {
        cursor: Pointer;
        border: 1px #bfbfbf solid;
    }
    
    .canChoose:hover {
        transform: scale(1.05);
        box-shadow: 4px 4px 2px rgba(0, 0, 0, 0.4);
    }
    
    .chickId {
        transform: scale(1.05);
        cursor: Pointer;
        border: 1px #bfbfbf solid;
        box-shadow: 4px 4px 2px rgba(0, 0, 0, 0.4);
    }
    
    #vocalHeadImg {
        width: 50px;
        height: 50px;
        float: left;
        margin: 0px;
        padding: 0px;
        margin-left: 5px;
        margin-right: 5px;
    }
    
    #vocalName {
        font-size: 20px;
        font-weight: 900;
    }
    
    #vocalPresentation {
        font-size: 15px;
        color: #abb2bf;
    }
    
    .ttsPage-right {
        float: left;
        border-left: solid 1px #bfbfbf;
        height: 400px;
    }
    
    .textInput {
        padding: 5px;
        height: 200px;
        width: 589px;
        padding-bottom: 10px;
        border-bottom: solid 1px #bfbfbf;
    }
    
    #ttsText {
        width: 570px;
        height: 180px;
        margin: 0px 0px 0px 5px;
        padding: 10px;
        resize: none;
        font-size: 23px;
        border: 0px;
        outline: none;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        color: white;
    }
    
    .cantChoose {
        filter: blur(5px);
    }
    
    .cantChoose:hover {
        cursor: no-drop;
    }
    
    .ttsConfig-left {
        width: 250px;
        float: left;
    }
    
    .setting {
        float: left;
        width: 230px;
        height: 45px;
        line-height: 50px;
        padding-left: 10px;
    }
    
    .parameterName {
        margin-right: 15px;
    }
    
    .parameterInput {
        margin: 0px;
        float: right;
        margin-top: 16px;
        width: 179px;
    }
    
    .ttsConfig-right {
        text-align: center;
        width: 349px;
        float: left;
        padding-top: 40px;
    }
    
    .ttsPlay {
        height: 50px;
        width: 214px;
        margin-left: auto;
        margin-right: auto;
        font-size: 30px;
        line-height: 50px;
    }
    
    .ttsPlay:hover {
        cursor: Pointer;
    }
    
    #ttsPlay {
        border: 1px solid #bfbfbf;
        border-radius: 10px 0px 0px 10px;
        width: 150px;
        height: 50px;
        float: left;
    }
    
    #ttsPlay:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
    
    #ttsWaveDownload {
        border: 1px solid #bfbfbf;
        border-radius: 0px 10px 10px 0px;
        width: 50px;
        height: 50px;
        float: left;
    }
    
    #ttsWaveDownload:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
    
    .ttsDownloadPage {
        margin-top: 20px;
    }
    
    .pageWindowBack {
        position: fixed;
        z-index: 2;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
    }
    
    .modal-enter-active,
    .modal-leave-active {
        transition: opacity 0.5s;
    }
    
    .modal-enter,
    .modal-leave-to {
        opacity: 0;
    }
    
    .pageWindowModal {
        position: fixed;
        z-index: 3;
        width: 400px;
        height: 200px;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        margin: auto;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        box-shadow: 15px 15px 7.5px rgba(0, 0, 0, 0.6);
    }
    
    .modalTitle {
        width: 100%;
        height: 50px;
        text-align: center;
        font-size: 26px;
        border-radius: 10px 10px 0px 0px;
        line-height: 50px;
        background-color: white;
    }
    
    #modalTitleClose {
        position: relative;
        top: -45px;
        left: 350px;
        width: 40px;
        height: 40px;
    }
    
    #modalTitleClose:hover {
        cursor: Pointer;
    }
    
    .modalMsg {
        width: 398;
        height: 100px;
        text-align: center;
        border: 1px solid #abb2bf;
        line-height: 20px;
        color: black;
    }
    
    #msgModalBotton {
        width: 100%;
        height: 50px;
        padding: 5px 0px 5px 0px;
        text-align: center;
        line-height: 50px;
        border-radius: 0px 0px 10px 10px;
        background-color: white;
        cursor: Pointer;
    }
    
    #vcodeInput {
        height: 30px;
        width: 150px;
        margin: 7px 30px 7px 30px;
        text-align: center;
        font-size: 26px;
        border: 1px gray solid;
    }
    
    #vcodeSubmit {
        height: 35px;
        width: 100px;
        float: right;
        margin: 6px 30px 6px 30px;
        line-height: 35px;
        border: 1px gray solid;
        cursor: Pointer;
    }
    
    #vcode {
        width: 200px;
        height: 60px;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        margin: auto;
    }
</style>

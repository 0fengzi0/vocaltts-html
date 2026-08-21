<template>
  <div id='PcIndex'>
    <div class='glass'>
      <div class='ttsPage'>
        <!--左侧发音人列表-->
        <div class='ttsPage-left'>
          <div class='vocalList'>
            <div
                v-for='(list, index) in vocalList'
                :key='index'
                :class="list.status === 'true' ? (ttsData.voice === index ? 'chickId' : 'canChoose') : 'cantChoose'"
                class='vocal'
                @click='chickVoice(index)'
            >
              <img id='vocalHeadImg' :alt='list.name' :src='list.headimg'/>
              <div class='vocalMsg'>
                <div id='vocalName'>{{ list.name }}</div>
                <div id='vocalPresentation'>{{ list.presentation }}</div>
              </div>
            </div>
          </div>
        </div>
        <!--右侧-->
        <div class='ttsPage-right'>
          <!--合成内容-->
          <div class='textInput'><textarea id='ttsText' v-model='ttsData.text' maxlength='60'
                                           placeholder='请输入要合成的文本'></textarea></div>
          <!--合成参数-->
          <div class='ttsConfig'>
            <div class='ttsConfig-left'>
              <div class='setting cantChoose'>
                <span class='parameterName'>语调:</span>
                <input v-model='ttsData.pit' class='parameterInput' max='100' min='-100' name='pit'
                       step='10'
                       type='range' value='0'/>
              </div>
              <div class='setting'>
                <span class='parameterName'>语速:</span>
                <input v-model='ttsData.vel' class='parameterInput' max='100' min='-100' name='vel'
                       step='10'
                       type='range' value='0'/>
              </div>
              <div class='setting'>
                <span class='parameterName'>音量:</span>
                <input v-model='ttsData.vol' class='parameterInput' max='100' min='-100' name='vol'
                       step='10'
                       type='range' value='0'/>
              </div>
              <div style='clear: both;'></div>
              <div class='modeSetting'>
                <span class='parameterName'>模式</span>
                <button :class="ttsData.mode === 'standard' ? 'modeActive' : ''" class='modeBtn'
                        @click='ttsData.mode = "standard"'>标准模式</button>
                <button :class="ttsData.mode === 'emotion' ? 'modeActive' : ''" class='modeBtn'
                        @click='ttsData.mode = "emotion"'>情感模式</button>
              </div>
              <textarea v-if="ttsData.mode === 'emotion'" v-model='ttsData.controlInstruction'
                        class='modeInput' rows='2' placeholder='控制指令，如：语速稍快、开心的语气'></textarea>
              <!-- 标准模式无需输入：转录文本由服务端硬编码 -->
            </div>
            <div class='ttsConfig-right'>
              <div class='ttsPlay'>
                <div id='ttsPlay' @click='playTts()'>{{
                    audioStatus === 0 ? '合成中' : audioStatus === 1 ? '播放' : '停止'
                  }}
                </div>
                <div id='ttsWaveDownload' @click='downLoadTTSFile()'>
                  <svg class='icon' height='25' p-id='1976' t='1575004811319' version='1.1'
                       viewBox='0 0 1024 1024'
                       width='50' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M832 768v64H192v-64H128v128h768v-128zM822.624 438.624l-45.248-45.248L544 626.752V128h-64v498.752l-233.376-233.376-45.248 45.248L512 749.248z'
                        fill='#ffffff'
                        p-id='1977'
                    />
                  </svg>
                </div>
              </div>
              <div class='ttsDownloadPage'><a
                  href='http://www.lastdream.net/forum.php?mod=viewthread&amp;tid=1081'
                  target='_Blank'>点击下载PC版</a></div>
            </div>
          </div>
          <!--播放器-->
          <div class='audio'>
            <audio ref='audio' @pause='onPause' @play='onPlay'>
              <source controls preload='none' src='#' type='audio/wav'/>
              您的浏览器不支持音频播放。
            </audio>
          </div>
        </div>
      </div>
    </div>
    <!--页面底部信息-->
    <PcFooter></PcFooter>
    <!--公告板-->
    <PcNotice></PcNotice>
  </div>
</template>

<script>
import {defineAsyncComponent} from 'vue';
import VocalApi from '@/api/VocalApi';
import SynthApi from '@/api/SynthApi';
import PcFooter from '@/components/pc/PcFooter';
import VaptchaService from '@/api/VaptchaService';
import file from '@/plugins/file';

const PcNotice = defineAsyncComponent(() => import('@/components/pc/PcNotice'));

export default {
  name: 'PcIndex',
  // 引用组件
  components: {
    PcNotice,
    PcFooter
  },
  data() {
    return {
      // 发音人列表
      vocalList: [
        {
          id: '1',
          code: 'lty',
          name: '洛天依·日常',
          version: 'V3',
          headimg: 'https://s2.ax1x.com/2019/11/16/M0mbDS.png',
          presentation: '默认音色',
          status: 'true'
        },
        {
          id: '2',
          code: 'lty_gan',
          name: '洛天依·元气',
          version: 'V3',
          headimg: 'https://s2.ax1x.com/2019/11/16/M0mbDS.png',
          presentation: '元气语气',
          status: 'true'
        },
        {
          id: '3',
          code: 'lty_91',
          name: '洛天依·Vocaloid',
          version: 'V3',
          headimg: 'https://s2.ax1x.com/2019/11/16/M0mbDS.png',
          presentation: 'Vocaloid 调教版',
          status: 'true'
        }
      ],
      // tts状态 0合成1播放2停止
      audioStatus: 1,
      // 合成后的音频文件名
      waveData: '',
      // 合成参数
      ttsData: {
        text: '',
        voice: 0,
        pit: 0,
        vel: 0,
        vol: 0,
        // 模式：standard 标准模式(默认) / emotion 情感模式
        mode: 'standard',
        // 可控克隆时的控制指令（极致克隆的转录文本由服务端硬编码，前端不提供）
        controlInstruction: ''
      },
      // 历史合成参数
      oldTTSData: {
        text: '!`100',
        voice: 0,
        pit: 0,
        vel: 0,
        vol: 0,
        mode: 'standard',
        controlInstruction: ''
      },
      // 最大输入字数
      maxInput: 100
    };
  },

  // 初始化完成
  mounted() {
    let that = this;
    // 获取声库列表
    that.getVocaList();
  },

  // 其他函数
  methods: {

    // 播放
    startWave() {
      this.$refs.audio.src = this.waveData;
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
      if (this.vocalList[index].status === 'true') {
        this.ttsData.voice = index;
      }
    },

    // 下载合成的音频
    downLoadTTSFile() {
      if (this.waveData !== '' && this.waveData != null) {
        file.download(this.ttsData.text, this.waveData);
      } else {
        this.$store.commit('snackBarShow', {
          message: '还没有合成音频哦',
          color: 'warning'
        });
      }
    },

    // 点击播放按钮
    playTts() {
      console.log(this.ttsData);
      console.log(this.oldTTSData);
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
          color: 'warning'
        });
      }
    },

    // // 提交合成信息
    // doSynth () {
    //     let that = this;
    //     // 显示合成状态
    //     that.onWait();
    //     SynthApi.doSynth(that.vocalList[that.chickId]['version'], that.vocalList[that.chickId]['code'], that.inputTtsText).then(function (res) {
    //         if (res.code === 200) {
    //             that.waveData = res.data;
    //             // 深拷贝,记录历史合成数据
    //             Object.assign(that.oldTTSData, that.ttsData);
    //             // 播放声音
    //             that.startWave();
    //         } else {
    //             this.onPause();
    //         }
    //     }).catch(function (res) {
    //         that.onPause();
    //     });
    // },
    //
    // 提交合成信息
    async doSynth() {
      let that = this;
      // let vaptchaObj = await VaptchaService.getVaptchObj();
      // 显示合成状态
      that.onWait();
      // await vaptchaObj.listen('pass', () => {
      SynthApi.doSynth(
          that.vocalList[that.ttsData.voice]['version'],
          that.vocalList[that.ttsData.voice]['code'],
          that.ttsData.text,
          // vaptchaObj.getToken()
          '',
          that.ttsData.mode,
          that.ttsData.controlInstruction
      ).then(function (res) {
        that.waveData = res.data;
        // 深拷贝,记录历史合成数据
        that.oldTTSData = Object.assign({}, that.ttsData);
        // 播放声音
        that.startWave();
      }).catch(() => {
        // 出错时状态归位
        that.onPause();
      }).finally(() => {
        //重置验证码
        // vaptchaObj.reset();
      });

      // });
      // await vaptchaObj.validate();
    },

    // 获取发音人列表
    getVocaList() {
      let that = this;
      VocalApi.getVocalList().then(res => {
        that.vocalList = res.data;
        // 检测并选中第一个可用音源
        that.chooseCanUseVoice();
      });
    },

    // 首次加载自动选择发音人
    chooseCanUseVoice() {
      for (let i = 0; i < this.vocalList.length; i++) {
        if (this.vocalList[i].status === 'true') {
          this.chickVoice(i);
          break;
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
a {
  text-decoration: none;
  color: black !important;
}

a:hover {
  color: #ee0000 !important;
}

p {
  margin: 10px 0 !important;
}

#PcIndex {
  width: 100%;
  height: 100%;
  background: url('https://s1.ax1x.com/2020/07/12/U851Ig.jpg') no-repeat center;
  position: fixed;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
}

.glass {
  width: 800px;
  height: 400px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: inherit;
  overflow: hidden;
  margin: 1% auto auto auto;
  border-radius: 15px;
  padding: 8px 10px;
  box-shadow: 15px 15px 7.5px rgba(0, 0, 0, 0.6);
}

.glass::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
}

.pageEnd {
}

.ttsPage-left {
  flex: 0 0 200px;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.vocalList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vocal {
  border: 1px #bfbfbf none;
  border-radius: 5px;
  margin: 5px;
  display: flex;
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
  margin: 0 5px 0 5px;
  padding: 0;
}

.vocalMsg {
  flex: 1;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 1;
  margin-left: 8px;
  border-left: solid 1px #bfbfbf;
}

.textInput {
  padding: 5px 5px 10px 5px;
  flex: 0 0 150px;
  width: 100%;
  border-bottom: solid 1px #bfbfbf;
}

#ttsText {
  width: 100%;
  height: 100%;
  margin: 0 0 0 5px;
  padding: 10px;
  resize: none;
  font-size: 23px;
  border: 0;
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

.ttsConfig {
  flex: 1;
  display: flex;
}

.ttsConfig-left {
  flex: 0 0 250px;
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
  margin: 16px 0 0 0;
  float: right;
  width: 160px;
}

.modeSetting {
  width: 230px;
  height: 34px;
  line-height: 34px;
  padding-left: 10px;
}

.modeBtn {
  width: 66px;
  height: 26px;
  margin: 4px 4px 0 0;
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  background: transparent;
  color: white;
  font-size: 13px;
  cursor: pointer;
}

.modeBtn:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.modeActive {
  background-color: rgba(255, 255, 255, 0.5);
}

.modeInput {
  width: 230px;
  height: 42px;
  margin: 2px 0 0 10px;
  padding: 4px 6px;
  resize: none;
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 13px;
  outline: none;
}

.modeInput::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.ttsConfig-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 50px 10px;
  text-align: center;
}

.ttsPlay {
  flex: 0 0 50px;
  margin: 0 auto;
  font-size: 30px;
  line-height: 50px;
}

.ttsPlay:hover {
  cursor: Pointer;
}

#ttsPlay {
  border: 1px solid #bfbfbf;
  border-radius: 10px 0 0 10px;
  width: 150px;
  height: 50px;
  float: left;
}

#ttsPlay:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

#ttsWaveDownload {
  border: 1px solid #bfbfbf;
  border-radius: 0 10px 10px 0;
  width: 50px;
  height: 50px;
  float: left;
}

#ttsWaveDownload:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.ttsDownloadPage {
  margin: 20px auto 0;
}

</style>

<template>
  <div class="d-flex flex-column" id="PhoneSynth">
    <!--合成文本输入卡片-->
    <v-card class="mt-3 mb-1 ml-auto mr-auto" color="rgba(255,255,255,0.8)" width="94vw">
      <v-card-text>
        <v-textarea :counter="maxInput" clearable no-resize placeholder="你好，语音时代" v-model="ttsData.text"></v-textarea>
      </v-card-text>
    </v-card>
    <!--发音人选项卡-->
    <v-card class="mt-2 mb-2 ml-auto mr-auto" color="rgba(255,255,255,0.8)" width="94vw">
      <v-card-text class="pl-1 pr-1 pt-0 pb-0">
        <div class="vocal-list pb-2 pt-2">
          <v-card
              :class="ttsData.voice === index ? 'chickBGC' : ''"
              :key="index"
              @click="chickVoice(index)"
              class="vocal ma-1 pa-1"
              link
              v-for="(item, index) in vocalList"
              v-show="item.status === 'true'"
          >
            <v-card-text class="vocal-info-card pa-0 pr-1">
              <div class="vocal-img"><img :src="item.headimg"/></div>
              <div class="vocal-msg">
                <div class="vocal-name">{{ item.name }}</div>
                <div class="vocal-text">{{ item.presentation }}</div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
    <!--合成参数面板-->
    <v-card class="mt-2 mb-2 ml-auto mr-auto" color="rgba(255,255,255,0.8)" width="94vw">
      <v-card-text>
        <v-slider :thumb-size="24" dense disabled label="音高" max="100" min="-100" thumb-label="always"
                  v-model="ttsData.pit"></v-slider>
        <v-slider :thumb-size="24" dense label="语速" max="100" min="-100" thumb-label="always"
                  v-model="ttsData.vel"></v-slider>
        <v-slider :thumb-size="24" dense label="音量" max="100" min="-100" thumb-label="always"
                  v-model="ttsData.vol"></v-slider>
      </v-card-text>
    </v-card>
    <!--合成按钮组-->
    <div class="button-list mt-2 mb-2 d-flex align-content-space-between">
      <v-btn @click="downLoadTTSFile" color="info">下载音频</v-btn>
      <v-btn @click="playTts" class="ttsPlay" color="success">
        {{ audioStatus == 0 ? '合成中' : audioStatus == 1 ? '播放' : '停止' }}
      </v-btn>
      <v-btn @click="ResetTTSDate" color="error">重置</v-btn>
    </div>
    <!--播放器-->
    <div class="audio" v-show="false">
      <audio @pause="onPause" @play="onPlay" ref="audio">
        <source controls preload="none" src="#" type="audio/wav"/>
        您的浏览器不支持音频播放。
      </audio>
    </div>
    <PhoneFooter></PhoneFooter>
  </div>
</template>

<script>
import HttpClient from '../../utils/HttpClient';
import Bus from '../../utils/Bus';
import PhoneFooter from './PhoneFooter';

export default {
  name: 'PhoneSynth',
  // 引用组件
  components: {PhoneFooter},
  data() {
    return {
      // 合成参数
      ttsData: {
        text: '',
        voice: 0,
        pit: 0,
        vel: 0,
        vol: 0
      },
      // 历史合成参数
      oldTTSData: {
        text: '!`100',
        voice: 0,
        pit: 0,
        vel: 0,
        vol: 0
      },
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
      wavePath: '',
      // 最大输入字数
      maxInput: 100
    };
  },

  watch: {
    group() {
      this.drawer = false;
    }
  },

  // 初始化完成
  mounted() {
    let that = this;
    // 获取发音人列表
    that.getVocaList();
    // 监听合成事件
    Bus.$on('returnToken', token => {
      that.doSynth(token);
    });
  },

  // 其他函数
  methods: {
    // 获取发音人列表
    getVocaList() {
      let that = this;
      HttpClient.doHttp('vocaltts/voca/getvocalist', 'post').then(res => {
        if (res.code == 200) {
          that.vocalList = res.data;
          that.chooseCanUseVoice();
        }
      });
    },

    // 切换发音人
    chickVoice(index) {
      let that = this;
      that.ttsData.voice = index;
    },

    // 首次加载自动选择发音人
    chooseCanUseVoice() {
      let that = this;
      for (let i = 0; i < that.vocalList.length; i++) {
        if (that.vocalList[i].status == 'true') {
          that.chickVoice(i);
          break;
        }
      }
    },

    // 点击播放按钮
    playTts() {
      let that = this;
      if (that.ttsData.text !== '' && that.ttsData.text.length <= that.maxInput) {
        if (that.audioStatus === 1) {
          if (JSON.stringify(that.oldTTSData) !== JSON.stringify(that.ttsData)) {
            // 显示验证码
            Bus.$emit('doVaptcha', {});
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
        Bus.$emit('showSnackBar', {
          msg: '合成内容长度错误',
          color: 'warning'
        });
      }
    },

    // 提交合成信息
    doSynth(token) {
      let that = this;
      // 显示合成状态
      that.onWait();
      HttpClient.doHttp('vocaltts/synth/dosynth', 'post', {
        version: that.vocalList[that.ttsData.voice]['version'],
        voice: that.vocalList[that.ttsData.voice]['code'],
        text: that.ttsData.text,
        vel: that.ttsData.vel,
        vol: that.ttsData.vol,
        pit: that.ttsData.pit,
        token: token
      })
          .then(function (res) {
            if (res.code === 200) {
              that.wavePath = HttpClient.serviceApi + 'vocaltts/synth/getwave/wave/' + res.fileName;
              // 深拷贝,记录历史合成数据
              Object.assign(that.oldTTSData, that.ttsData);
              // 播放声音
              that.startWave();
            } else {
              // 出错时状态归位
              that.onPause();
            }
          })
          .catch(res => {
            // 出错时状态归位
            that.onPause();
          });
    },

    // 下载合成的音频
    downLoadTTSFile() {
      if (this.wavePath != '' && this.wavePath != null) {
        window.open(this.wavePath);
      } else {
        Bus.$emit('showSnackBar', {
          msg: '还没有合成音频哦',
          color: 'warning'
        });
      }
    },

    // 重置合成参数
    ResetTTSDate() {
      let that = this;
      // 重置发音状态
      that.onPause();
      // 重置参数
      that.ttsData = {
        text: '',
        voice: 0,
        pit: 0,
        vel: 0,
        vol: 0
      };
      // 重置发音人
      that.chooseCanUseVoice();
    },

    // 播放
    startWave() {
      this.$refs.audio.src = this.wavePath;
      this.$refs.audio.play();
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
    }
  }
};
</script>

<style lang="scss" scoped>
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

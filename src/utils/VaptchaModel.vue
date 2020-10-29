<template>
  <div></div>
</template>
<script>
import Bus from "./Bus";

export default {
  name: "vaptchaModel",
  // 引用组件
  components: {},
  data() {
    return {
      vaptchaObj: null
    };
  },
  // 初始化完成
  mounted() {
    //配置参数
    let that = this;
    this.$nextTick(() => {
      Bus.$on("doVaptcha", (res) => {
        that.vaptcha(process.env.VUE_APP_CVID)
      });
    })

  },
  // 其他函数
  methods: {
    // 验证码
    vaptcha(cvid = '') {
      let that = this;
      if (cvid != '') {
        window.vaptcha({
          // 验证单元id
          vid: cvid,
          // 展现类型
          type: 'invisible',
          // 验证场景
          scene: 1,
          // 语言 默认zh-CN,可选值zh-CN,en,zh-TW
          lang: 'zh-CN',
          // 使用https 默认 true
          https: true,
          //离线模式服务端地址
          offline_server: 'https://5ixf.vip/',
        }).then(function (obj) {
          that.vaptchaObj = obj
          // 验证成功进行后续操作
          that.vaptchaObj.listen('pass', function () {
            console.log("验证成功");
            // 获取验证的token 并返回数据
            that.returnData(that.vaptchaObj.getToken());
            //重置验证码
            that.vaptchaObj.reset();
          });
        }).then(() => {
          //开始认证
          that.vaptchaObj.validate()
        });

      } else {
        Bus.$emit('showSnackBar', {
          msg: "手势验证码配置错误,请检查",
          color: "error"
        })
      }

    },

    // 返回数据
    returnData(token = '') {
      token !== '' ? Bus.$emit("returnToken", token) : '';
    }
  }
};
</script>

<style scoped>
</style>

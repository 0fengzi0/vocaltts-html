function getVaptchObj () {
    return window.vaptcha({
        // 验证单元id
        vid: process.env.VUE_APP_CVID,
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
    }).then(obj => {
        return obj;
    });
}

export default { getVaptchObj };
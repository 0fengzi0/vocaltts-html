class file {
    download(name, data) {
        // 后端 synth/doSynth 返回的是完整 data URL（如 data:audio/mpeg;base64,...），
        // 直接使用即可；兼容旧格式（裸 base64）时再补上前缀
        let dataStr = data;
        if (typeof data === 'string' && data.indexOf('data:') !== 0) {
            dataStr = 'data:audio/wav;base64,' + data;
        }
        // 按 data URL 里的 MIME 类型决定下载扩展名（VoxCPM 返回的是 MP3 而非 WAV）
        let ext = 'wav';
        const mimeMatch = /^data:audio\/(\w+)/.exec(dataStr);
        if (mimeMatch) {
            ext = mimeMatch[1] === 'mpeg' || mimeMatch[1] === 'mp3' ? 'mp3' : mimeMatch[1];
        }
        // 合成文本可能包含 / \ : * ? 等非法文件名字符，替换掉避免下载失败
        const safeName = String(name).replace(/[\\/:*?"<>|]/g, '_');
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', safeName + '.' + ext);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

export default new file();
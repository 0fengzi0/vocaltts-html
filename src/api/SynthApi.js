import HttpClient from '@/plugins/HttpClient';

class SynthApi {
    doSynth(voice_version = '', voice_name = '', text = '', token = '', mode = '', control_instruction = '') {
        return HttpClient.doHttp('synth/doSynth', 'post', {
            voice_version: voice_version,
            voice_name: voice_name,
            text: text,
            // 模式：standard 标准模式(默认) / emotion 情感模式
            mode: mode,
            // 情感模式时的控制指令，如"语速稍快、开心的语气"（标准模式的转录文本由服务端硬编码）
            control_instruction: control_instruction,
            vel: 0,
            vol: 0,
            pit: 0,
            token: token,
            rand_str: '123456'
        });
    }
}

export default new SynthApi();

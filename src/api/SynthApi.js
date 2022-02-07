import HttpClient from '@/plugins/HttpClient';

class SynthApi {
    doSynth(voice_version = '', voice_name = '', text = '', token = '') {
        return HttpClient.doHttp('synth/doSynth', 'post', {
            voice_version: voice_version,
            voice_name: voice_name,
            text: text,
            vel: 0,
            vol: 0,
            pit: 0,
            token: token,
            rand_str: '123456'
        });
    }
}

export default new SynthApi();

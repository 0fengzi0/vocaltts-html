import HttpClient from '@/plugins/HttpClient';

class VocalApi {
    getVocalList() {
        return HttpClient.doHttp('vocal/getVocalList', 'post');
    }
}

export default new VocalApi();

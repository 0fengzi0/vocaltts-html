import HttpClient from '@/plugins/HttpClient';

class VocalApi {
    getVocalList () {
        return HttpClient.doHttp('vocaltts/vocal/getAllVocal', 'post');
    }
}

export default new VocalApi();
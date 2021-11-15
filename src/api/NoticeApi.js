import HttpClient from '@/plugins/HttpClient';

class NoticeApi {
    getPlacardList() {
        return HttpClient.doHttp('/vocaltts/Placard/getplacard', 'get');
    }
}

export default new NoticeApi();
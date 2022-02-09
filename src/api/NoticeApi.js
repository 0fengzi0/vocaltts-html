import HttpClient from '@/plugins/HttpClient';

class NoticeApi {
    getPlacardList() {
        return HttpClient.doHttp('/placard/getPlacard', 'get');
    }
}

export default new NoticeApi();

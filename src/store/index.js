import {createStore} from 'vuex';
import snackBar from '@/store/snackBar';

export default createStore({
    modules: {
        snackBar: snackBar
    }
});

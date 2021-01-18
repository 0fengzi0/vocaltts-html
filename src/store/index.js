import Vue from 'vue';
import Vuex from 'vuex';
import snackBar from '@/store/snackBar';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        snackBar: snackBar
    }
});

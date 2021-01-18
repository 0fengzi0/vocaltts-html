let snackBar = {
    state    : () => ({
        model: {
            isShow : false,
            message: '',
            color  : 'success'
        }
    }),
    mutations: {
        snackBarShow (state, data = {
            message: '',
            color  : 'info'
        }) {
            state.model.isShow = false;
            setTimeout(() => {
                state.model.message = data.message;
                state.model.color = data.color;
                state.model.isShow = true;
            }, 100);
        },
        snackBarHide (state) {
            state.model.isShow = false;
        }
    },
    actions  : {},
    getters  : {}
};

export default snackBar;
const state = {
    /**
     * 已经存储了值，不刷新页面的时候，只会一直存在vuex
     * 刷新了页面，就会取session的值，赋值给变量
     */
    id: "" || sessionStorage.getItem("infoID"),
    title: "" || sessionStorage.getItem("infoTitle")
};

const getters = {
    infoId: state => state.id,
    infoTitle: state => state.title
};

const mutations = {
    SET_ID(state, value) {
        state.id = value
        sessionStorage.setItem("infoID", JSON.stringify(value));
    },
    SET_TITLE(state, value) {
        state.title = value
        sessionStorage.setItem("infoTitle", JSON.stringify(value));
    }
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

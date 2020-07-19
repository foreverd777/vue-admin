const state = {
  //isCollapse: JSON.parse(Cookie.get('isCollapse')) || false,
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  count: 10,
}

const  getters = {
  //相当于computed功能
  count: (state) => state.count + 10, //属性计算
}

const  mutations = {
  //同步  没有回调处理事件
  SET_COUNT(state, value) {
    state.count = value;
  },

  SET_COllAPSE(state) {
    state.isCollapse = !state.isCollapse;
    //Cookie.set('isCollapse', JSON.stringify(state.isCollapse));
    //html5本地存储
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
}

const actions = {
  setMenuStatus(content, data) {
    //第一个参数自定义名称，指向前三个方法
    //也可以用解构的写法调需要的，setMenuStatus({state,commit}, data)
    // content.state
    // content.getters
    // content.commit
    //content.commit('SET_COllAPSE');
  },
  //异步，请求接口返回数据后，接着去做别的事情
  login(content, requestData) {
    return new Promise((resolve, reject) => {
      //接口
      Login(requestData)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

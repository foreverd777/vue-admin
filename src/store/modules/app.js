import { Login } from "@/api/login";
import { setToKen, removeToKen, removeUserName, setUserName, getUserName } from "@/utils/app";

const state = {
  //isCollapse: JSON.parse(Cookie.get('isCollapse')) || false,
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  to_Ken: '',
  username: getUserName() || ''
}

const  getters = {
  //相当于computed功能
  count: (state) => state.count + 10, //属性计算

  isCollapse: state => state.username,
}

const  mutations = {
  //同步  没有回调处理事件
  
  SET_COllAPSE(state) {
    state.isCollapse = !state.isCollapse;
    //Cookie.set('isCollapse', JSON.stringify(state.isCollapse));
    //html5本地存储
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },

  SET_TOKEN(state, value) {
    state.to_Ken = value;
  },

  SET_USERNAME(state, value) {
    state.username = value;
  },
}

const actions = {
  //异步，请求接口返回数据后，接着去做别的事情
  login(content, requestData) {      //content可以进行结构  { commit }
    return new Promise((resolve, reject) => {
      //接口
      Login(requestData)
        .then((response) => {
          let data = response.data.data;
          content.commit('SET_TOKEN', data.token);
          content.commit('SET_USERNAME', data.username);
          setToKen(data.token);
          setUserName(data.username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  exit({ commit }) {
    return new Promise((resolve, reject) => {
      removeToKen();
      removeUserName();
      commit("SET_TOKEN", '');
      commit("SET_USERNAME", '');
      resolve();
    })
   
  
  },

  setMenuStatus(content, data) {
    //第一个参数自定义名称，指向前三个方法
    //也可以用解构的写法调需要的，setMenuStatus({state,commit}, data)
    // content.state
    // content.getters
    // content.commit
    //content.commit('SET_COllAPSE');
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

import { GetUserRole } from "@/api/login";
import { defaultRouterMap, asnyRouterMap } from "@/router/index";

function hasPremission(role, router) {
  if (router.meta && router.meta.role) {
    return role.some((item) => router.meta.role.indexOf(item) >= 0);
  }
}

const state = {
  allRouters: defaultRouterMap,
  addRouters: [],
};

const getters = {
  allRouters: (state) => state.allRouters,
  addRouters: (state) => state.addRouters,
};

const mutations = {
  //同步，没有回调

  SET_ROUTER(state, router) {
    state.addRouters = router;
    state.allRouters = defaultRouterMap.concat(router);
  },
};

const actions = {
  //可以回调处理事情
  //获取用户角色
  getRoles({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      GetUserRole().then((response) => {
        let data = response.data.data;
        resolve(data);
      });
    });
  },
  /**
   * 创建动态路由
   */
  createRouter({ commit }, data) {
    return new Promise((resolve, reject) => {
      let role = data;
      //超管状态
      let addRouters = [];
      if (role.includes("admin")) {
        addRouters = asnyRouterMap;
      } else {
        //普通管理员
        addRouters = asnyRouterMap.filter((item) => {
          if (hasPremission(role, item)) {
            //优先判断
            if (item.children && item.children.length > 0) {
              item.children = item.children.filter((child) => {
                if (hasPremission(role, child)) {
                  return child;
                }
              });
              return item;
            }
            return item;
          }
        });
        addRouters.push(asnyRouterMap[asnyRouterMap.length - 1])
      }

      //更新路由
      commit("SET_ROUTER", addRouters);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

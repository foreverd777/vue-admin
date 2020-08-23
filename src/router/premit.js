import router from "./index";
import store from "../store/index";
import { getToKen, removeToKen, removeUserName} from "@/utils/app"

const whiteRouter = ['/login']; //indexOf方法，判断数组中是否存在指定的某个对象,如果不存在，返回-1

//路由守卫
router.beforeEach((to, from, next) => {
    if (getToKen()) {
        //路由动态添加，分配菜单，每个角色分配不同的菜单
        if (to.path === '/login') {
            removeToKen();
            removeUserName();
            store.commit("app/SET_TOKEN", '');
            store.commit("app/SET_USERNAME", '');
            next();
        } else {
            //获取用户角色
            //动态分配路由权限
            if (store.getters['app/roles'].length === 0) {
                store.dispatch('permission/getRoles').then(response => {                  
                    let role = response.role;
                    let button = response.button;
                    let btnPerm = response.btnPerm;
                    store.commit("app/SET_ROLES", role);
                    //store.commit("app/SET_BUTTON", btnPerm);                    
                    store.dispatch('permission/createRouter',role).then(response => {
                        let addRouters = store.getters['permission/addRouters'];
                        let allRouters = store.getters['permission/allRouters'];
                        //路由更新
                        router.options.routes = allRouters;
                        //添加动态路由
                        router.addRoutes(addRouters);
                        next({ ...to, replace: true });
                         // es6扩展运算符，防止内容发生变化的情况
                        // 不被记录历史记录
                    })
                })

            } else {
                next();
            }
            
            //next();
        }
        
    } else {
        if (whiteRouter.indexOf(to.path) !== -1) {
            next();  //next不带参数即指向  to   
        } else {
            next('/login');  //路由指向
        }
       
    }
  })
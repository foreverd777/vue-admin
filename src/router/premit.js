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
            next();
        }
        
    } else {
        if (whiteRouter.indexOf(to.path) !== -1) {
            next();  //next不带参数即指向  to   
        } else {
            next('/login');  //路由指向
        }
       
    }
  })
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login/index.vue";
import Layout from "@/views/Layout/index.vue";
Vue.use(VueRouter);

/**
 * 1、默认路由
 * 2、动态路由
 */

/**
 * 默认路由
 */
export const defaultRouterMap = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页",
    },
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: Login,
    meta: {
      name: "登录",
    },
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台",
      icon: "console",
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "首页",
          icon: "el-icon-info",
        },
        component: () => import("../views/Console/index.vue"),
      },
    ],
  },
  //404页面
  {
    path: "/page404",
    meta: {
      name: "404",
      icon: "404",
    },
    hidden: true,
    component: Layout,
    children: [
      {
        path: "/404",
        meta: {
          name: "404",
        },
        component: () => import("../views/404.vue"),
      },
    ],
  },
 
];

/**
 * 动态路由
 * 角色：sale,technician,manager
 */
export const asnyRouterMap = [
  {
    path: "/info",
    name: "Info",
    meta: {
      keepAlive: true,
      role: ["sale"],
      name: "信息管理",
      icon: "info",
    },
    component: Layout,
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          keepAlive: true,
          role: ["sale", "manager", "technician"],
          name: "信息列表",
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          keepAlive: true,
          role: ["sale", "manager", "technician"],
          name: "信息分类",
        },
        component: () => import("../views/Info/category.vue"),
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          keepAlive: true,
          role: ["sale", "manager", "technician"],
          name: "信息详情",
        },
        component: () => import("../views/Info/detailed.vue"),
      },
    ],
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      role: ["sale"],
      name: "用户管理",
      icon: "user",
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          name: "用户列表",
          role: ["sale", "manager", "technician"],
        },
        component: () => import("../views/User/index.vue"),
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const router = new VueRouter({
  routes: defaultRouterMap,
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;

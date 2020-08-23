import service from "@/utils/request";
/**
 * 获取角色
 */
export function GetRole(data) {
    return service.request({
      method: "post",
      url: "/role/",
      data: data
      //data:data, 左边的data是变量名（key）后台接受的，右边的data是接受的参数，
      //如果两者同名的情况下，可以写成一个即可（ES6写法）
    });
}

/** 
 * 按钮权限
 */
export function GetPermButton(data) {
  return service.request({
    method: "post",
    url: "/permButton/",
    data: data
  });
}

/**
 * 系统列表
 */
export function GetSystem(data) {
  return service.request({
    method: "post",
    url: "/system/",
    data: data
  });
}
  
/**
 * 用户添加
 */
export function UserAdd(data) {
    return service.request({
      method: "post",
      url: "/user/add/",
      data: data
    });
}
  
 
/**
 * 删除用户
 */
export function UserDel(data) {
  return service.request({
    method: "post",
    url: "/user/delete/",
    data: data
  });
}

/**
 * 用户禁启用
 */
export function UserActives(data) {
  return service.request({
    method: "post",
    url: "/user/actives/",
    data: data
  });
}

/**
 * 用户编辑
 */
export function UserEdit(data) {
  return service.request({
    method: "post",
    url: "/user/edit/",
    data: data
  });
}
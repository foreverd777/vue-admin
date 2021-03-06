import service from "@/utils/request";
/**
 * 获取验证码
 */
export function GetSms(data) {
  return service.request({
    method: "post",
    url: "/getSms/",
    data: data
    //data:data, 左边的data是变量名（key）后台接受的，右边的data是接受的参数，
    //如果两者同名的情况下，可以写成一个即可（ES6写法）
  });
}

/**
 * 获取用户角色
 */
export function GetUserRole(data={}) {
  return service.request({
    method: "post",
    url: "/userRole/",
    data: data
  });
}

/**
 * 退出
 */
export function Logout(data) {
  return service.request({
    method: "post",
    url: "/logout/",
    data: data
  });
}

/**
 * 登录
 */
export function Login(data) {
  return service.request({
    method: "post",
    url: "/login/",
    data: data
  });
}

/**
 ** 注册
 */
export function Register(data) {
  return service.request({
    method: "post",
    url: "/register/",
    data: data
  });
}

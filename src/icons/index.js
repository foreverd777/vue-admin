import Vue from "vue";
import SvgIcon from "./SvgIcon.vue";

Vue.component('svg-icon', SvgIcon);

/**
 * 读取指定目录的所有文件
 * require.context(‘./svg’, false, /\.svg$/) 参数说明：
 * 第一个：目录
 * 第二个：是否遍历子级目录
 * 第三个：定义遍历文件规则
 */
const req = require.context('./svg', false, /\.svg$/) //$ 正则里表示结尾，读取结尾为.svg的文件
//ES6写法
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
//ES5
// const requireAll = function (requireContext) {
//   return requireContext.keys().map(requireContext)
// }
requireAll(req)

import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';
export default {
  install(Vue, options) {
    Vue.prototype.confirm = (params) => {
        MessageBox.confirm(params.content, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
        .then(() => {
          if(params.fn){params.fn(1111)}
          Message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消删除",
          });
        });
    };
  },
};

import { GetCategory } from "@/api/news";
const actions = {
    //异步，请求接口返回数据后，接着去做别的事情
    getInfoCategory(content, requestData) {
        return new Promise((resolve, reject) => {
          //接口
          GetCategory({})
            .then((response) => {
              resolve(response.data.data.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
  }
  
  export default {
    namespaced: true,
    actions
  };
  
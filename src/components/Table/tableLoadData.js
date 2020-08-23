import { reactive } from "@vue/composition-api";
import { requestUrl } from "@/api/requestUrl";
import { loadTableData } from "@/api/common";
export function loadData() {
  const tableData = reactive({
    item: [],
    total: 0,
  });
  const tableLoadData = (params) => {
    let requestJson = params;
    let requestData = {
      url: requestUrl[requestJson.url],
      method: requestJson.method,
      data: requestJson.data,
    };
    loadTableData(requestData)
      .then((response) => {
        let responseData = response.data.data.data;
        //后台返回数据时，并不是返回一个数组，有时返回一个null，最好统一返回数组，无论是否为空
        tableData.item = responseData;
        tableData.total = responseData.length === 0 ? 0 : response.data.data.total;
      })
      .catch((error) => {});
  };
  return {
    tableData,
    tableLoadData,
  };
}

/**
 * 说明业务逻辑是什么
 * tableData：存储表格数据，被监听后数据赋值给表格
 * tableLoadData：表格加载数据的方法
 * loadTableData：加载表格数据的接口
 */

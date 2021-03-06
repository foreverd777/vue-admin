import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";
import service from "@/utils/request";
export function common() {
    const categoryItem = reactive({
        item: []
    })
    /* 获取分类 */
    const getInfoCategory = (params) => {
        GetCategory({}).then(response => {
            categoryItem.item = response.data.data.data
        }).catch(error => {

        })
    }

     /* 获取全部分类 */
     const getInfoCategoryAll = (params) => {
        GetCategoryAll({}).then(response => {
            categoryItem.item = response.data.data
        }).catch(error => {

        })
    }
    return {
        getInfoCategory,
        getInfoCategoryAll,
        categoryItem    
    }
}

/**
 * 获取七牛云token
 */
export function QiniuToken(data) {
    return service.request({
        method: "post",
        url: "/uploadImgToken/",
        data
    })
}

/**
 * 获取表格数据
 */
export function loadTableData(params) {
    return service.request({
      method: params.method || "post",
      url: params.url,
      data: params.data || {}
    });
}
  

/**
 * 获取省市区街关联
 * @param {
    * 
    * }
 */
export function GetCityPicker(data) {
    return service.request({
      method: "post",
      url: "/cityPicker/",
      data
    });
}
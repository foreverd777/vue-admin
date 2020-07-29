<template>
  <div id="category">
    <el-button
      type="danger"
      size="medium"
      @click="addFirst({ type: 'category_first_add' })"
      >添加一级分类</el-button
    >
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div
              class="category"
              v-for="firstItem in category.item"
              :key="firstItem.id"
            >
              <!-- 一级分类 -->
              <h4>
                <svg-icon icon-class="plus"></svg-icon>
                {{ firstItem.category_name }}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="
                      editCategory({
                        data: firstItem,
                        type: 'category_first_edit',
                      })
                    "
                    round
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="
                      handlerAddChildren({
                        data: firstItem,
                        type: 'category_children_add',
                      })
                    "
                    >添加子级</el-button
                  >
                  <el-button
                    size="mini"
                    round
                    @click="deleteCategory(firstItem.id)"
                    >删除</el-button
                  >
                </div>
              </h4>
              <!-- 子级分类 -->
              <ul v-if="firstItem.children">
                <li
                  v-for="childrenItem in firstItem.children"
                  :key="childrenItem.id"
                >
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button size="mini" type="danger" round>编辑</el-button>
                    <el-button size="mini" round>删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="122px" class="form-wrap">
            <el-form-item label="一级分类名称：" v-if="category_first_input">
              <el-input
                v-model="formLabelAlign.name"
                :disabled="category_first_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" v-if="category_children_input">
              <el-input
                v-model="formLabelAlign.region"
                :disabled="category_children_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_loading"
                :disabled="submit_button_disabled"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { global } from "@/utils/global_V3.0";
import { common } from "@/api/common";
import {
  AddFirstCategory,
  GetCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory,
} from "@/api/news";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import "@/styles/config.scss";
export default {
  name: "infoCategory",
  setup(props, { root, refs }) {
    /* global */
    const { confirm } = global();
    const { getInfoCategory, getInfoCategoryAll, categoryItem } = common();
    /* ref */
    const submit_button_type = ref(""); //用来判断确定按钮所实现的是哪一个功能
    const category_first_input = ref(true); //一级输入框是否显示
    const category_children_input = ref(true); //子级输入框是否显示
    const submit_loading = ref(false); //按钮确认后等待状态
    const category_first_disabled = ref(true); //是否禁用
    const category_children_disabled = ref(true); //是否禁用
    const submit_button_disabled = ref(true); //确定按钮状态
    const deleteId = ref("");

    /* reactive */
    const formLabelAlign = reactive({
      name: "",
      region: "",
      type: "",
    });

    const category = reactive({
      item: [],
      current: [],
    });

    /*
     * methods
     */
    //“ 确定 ”按钮事件
    const submit = () => {
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      }
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
      if (submit_button_type.value == "category_children_add") {
        addChildrenCategory();
      }
    };

    const addFirstCategory = () => {
      if (!formLabelAlign.name) {
        root.$message({
          message: "分类名称不能为空",
          type: "warning",
        });
        return false;
      }
      //按钮加载状态
      submit_loading.value = true;
      AddFirstCategory({ categoryName: formLabelAlign.name })
        .then((response) => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success",
            });
            /**
             * 两种处理方法
             * 1、请求获取分类接口（缺点：浪费资源）
             * 2、直接push，请求接口后返回的数据
             */
            category.item.push(response.data.data);
          }
          clearInput();
        })
        .catch((error) => {
          clearInput();
        });
    };

    /* 添加一级分类按钮事件 */
    const addFirst = (params) => {
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
    };

    /**
     * 添加子级
     */
    const handlerAddChildren = (params) => {
      submit_button_type.value = params.type;
      category_first_disabled.value = true; //禁用一级输入框
      category_children_disabled.value = false; //启用子级输入框
      submit_button_disabled.value = false; //启用确定按钮
      category_children_input.value = true; //显示子级输入框
      //存储数据
      category.current = params.data;
      //显示一级分类文本
      formLabelAlign.name = params.data.category_name;
    };
    const addChildrenCategory = () => {
      if (!formLabelAlign.region) {
        root.$message({
          message: "名称不能为空!",
          type: "error",
        });
        return false;
      }
      let requestData = {
        categoryName: formLabelAlign.region,
        parentId: category.current.id,
      };
      AddChildrenCategory(requestData).then((response) => {
        let responseData = response.data;
        root.$message({
          message: "添加成功!",
          type: "success",
        });
        //刷新分类列表
        getInfoCategoryAll();
        //情况子级输入框
        formLabelAlign.region = "";
      });
    };
    /* 删除分类 */
    const deleteCategory = (firstCategoryID) => {
      deleteId.value = firstCategoryID;
      confirm({
        content: "此操作将永久删除该数据, 是否继续",
        fn: confirmDelete,
        catchFn: () => {
          deleteId.value = "";
        },
        tip: "警告",
        id: "",
      });
    };
    //数据删除操作
    const confirmDelete = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then((response) => {
          /* 1、操作数组  */
          /**
           * 两个参数是删除，三个参数是替换
           * splice('指定起始位置', number删除的个数, '替换的数据')
           * [{},{}]
           */
          /**
           * ES6 findIndex
           */
          let index = category.item.findIndex(
            (item) => item.id == deleteId.value
          );
          //删除数组指定元素
          category.item.splice(index, 1);

          /* 2、使用过滤filter,将过滤后的数据赋值给原数据 */
          // let newData = category.item.filter(item => item.id != deleteId.value);
          // category.item = newData;
        })
        .catch((error) => {});
    };

    /*
     * 修改数据
     */
    const editCategory = (params) => {
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      submit_button_type.value = params.type;
      //输入要修改的一级名称
      formLabelAlign.name = params.data.category_name;
      //储存当前数据对象
      category.current = params.data;
    };
    const editFirstCategory = () => {
      if (category.current.length == 0) {
        root.$message({
          message: "未选择分类!",
          type: "error",
        });
        submit_button_disabled.value = true;
        return false;
      }
      let requestData = {
        id: category.current.id,
        categoryName: formLabelAlign.name,
      };
      EditCategory(requestData)
        .then((response) => {
          let responseData = response.data;
          root.$message({
            message: responseData.message,
            type: "success",
          });
          category.current.category_name = responseData.data.data.categoryName;
          // let data = category.item.filter(
          //   (item) => item.id == category.current.id
          // );
          // data[0].category_name = responseData.data.data.categoryName;
          //清空输入框
          formLabelAlign.name = "";
          category.current = [];
        })
        .catch((error) => {});
    };
    /* 确定按钮暂停，清空输入框 */
    const clearInput = () => {
      submit_loading.value = false;
      formLabelAlign.name = "";
      formLabelAlign.region = "";
      formLabelAlign.type = "";
    };
    /**
     * 生命周期  挂载完成时执行
     */
    onMounted(() => {
      // getInfoCategory();
      getInfoCategoryAll();
    });
    /**
     * watch
     */
    watch(
      () => categoryItem.item,
      (value) => {
        category.item = value;
      }
    );

    return {
      //ref
      category_first_input,
      category_children_input,
      submit_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      //reactive
      formLabelAlign,
      category,
      //methods
      submit,
      addFirst,
      deleteCategory,
      confirmDelete,
      editCategory,
      handlerAddChildren,
      addChildrenCategory,
    };
  },
};
</script>

<style lang="scss" scoped>
//右侧
.menu-title {
  line-height: 34px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
//左侧
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 11px;
    }
  }
}
.category {
  line-height: 34px;
  position: relative;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 20px;
    top: 0px;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 13px;
    top: 10px;
    background-color: #fff;
  }
  li {
    padding-left: 40px;
    margin-left: 20px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.3s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 11px;
  top: -2px;
  z-index: 2;
  button {
    font-size: 12px;
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
.hr-e9e9e9 {
  width: calc(100% + 60px);
  margin-left: -30px;
  border: none;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e9e9e9;
}
</style>

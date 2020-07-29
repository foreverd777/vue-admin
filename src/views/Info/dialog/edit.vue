<template>
  <el-dialog
    title="修改"
    :visible.sync="dialog_info_flag"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form :model="form" ref="form">
      <el-form-item
        label="类别："
        :label-width="formLabelWidth"
        prop="category"
      >
        <el-select v-model="form.category" placeholder="请选择">
          <el-option
            v-for="item in categoryOption.item"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth" prop="content">
        <el-input
          type="textarea"
          v-model="form.content"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">取消</el-button>
      <el-button
        size="medium"
        type="danger"
        :loading="submitLoading"
        @click="submit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo, GetList, EditInfo } from "@/api/news";
import { reactive, ref, watchEffect } from "@vue/composition-api";
export default {
  name: "DialogEditInfo",
  //单向数据流， 父级->子级，不能反向修改
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit, root, refs }) {
    const dialog_info_flag = ref(true); //弹窗标记
    const formLabelWidth = ref("70px");
    const form = reactive({
      category: "",
      title: "",
      content: "",
    });
    const categoryOption = reactive({
      //分类下拉
      item: [],
    });
    const submitLoading = ref(false); //按钮等待状态

    //watch监听
    watchEffect(() => {
      dialog_info_flag.value = props.flag;
    });

    //取消按钮单击事件
    const close = () => {
      dialog_info_flag.value = false;
      emit("update:flag", false);
      //root.$emit('close', false);
      //回调时需要做逻辑处理时，就不能修饰器了。反之，只修改单个值可以用修饰器

      refs["form"].resetFields(); //重置表单
    };

    //窗口加载完成后事件
    const openDialog = () => {
      categoryOption.item = props.category;
      getInfo();
    };

    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: props.id,
      };
      GetList(requestData).then((response) => {
        let responseData = response.data.data.data[0];
        form.category = responseData.categoryId;
        form.title = responseData.title;
        form.content = responseData.content;
      });
    };

    //确定按钮单击事件
    const submit = () => {
      let requestData = {
        id: props.id,
        categoryId: form.category,
        title: form.title,
        content: form.content,
        imgUrl: " ",
        updateDate:"2020-02-02 12:00:00"
      };
      if (!form.category) {
        root.$message({
          type: "error",
          message: "类别不能为空",
        });
        return false;
      }
      submitLoading.value = true;
      EditInfo(requestData)
        .then((response) => {
          root.$message({
            type: "success",
            message: "修改成功",
          });
          submitLoading.value = false;
          /**
           * 两种刷新数据方式
           * 1、直接再次调用接口刷新数据
           * 2、返回列表，手动修改指定的数据
           */
          emit("getListEmit");
          //重置表单
          //refs["form"].resetFields();
        })
        .catch((error) => {
          submitLoading.value = false;
        });
    };

    return {
      //ref
      dialog_info_flag,
      formLabelWidth,
      submitLoading,
      //reactive
      form,
      categoryOption,
      //methods
      close,
      openDialog,
      submit,
    };
  },
};
</script>
<style scoped></style>

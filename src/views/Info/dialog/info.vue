<template>
  <el-dialog
    title="新增"
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
import { AddInfo } from "@/api/news";
import { reactive, ref, watchEffect } from "@vue/composition-api";
export default {
  name: "dialogInfo",
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
  },
  setup(props, { emit, root, refs }) {
    const dialog_info_flag = ref(true);  //弹窗标记
    const formLabelWidth = ref("70px");
    const form = reactive({
      category: "",
      title: "",
      content: "",
    });
    const categoryOption = reactive({    //分类下拉
      item: [],
    });
    const submitLoading = ref(false);    //按钮等待状态

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
    };

    //确定按钮单击事件
    const submit = () => {
      let requestData = {
        categoryId: form.category,
        title: form.title,
        imgUrl: "http://********",
        createDate: "2020-02-02 12:00:00",
        content: form.content,
      };
      if (!form.category) {
        root.$message({
          type: "error",
          message: "类别不能为空",
        });
        return false;
      }
      submitLoading.value = true;
      AddInfo(requestData)
        .then((response) => {
          root.$message({
            type: "success",
            message: "提交成功",
          });
          submitLoading.value = false;
          close();//关闭弹窗         
          emit("getListEmit");//更新信息列表
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

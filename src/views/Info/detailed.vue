<template>
  <el-form ref="form" :model="data.form" label-width="90px">
    <el-form-item label="信息分类：">
      <el-select v-model="data.form.categoryId">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="data.form.title"> </el-input>
    </el-form-item>

    <el-form-item label="缩略图：">
      <UploadImg :imgUrl.sync="data.form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>

    <el-form-item label="发布日期：">
      <el-date-picker
        v-model="data.form.createDate"
        type="date"
        placeholder="选择日期"
        disabled
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容：">
      <quillEditor
        v-model="data.form.content"
        ref="myQuillEditor"
        :options="data.editorOption"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" :loading="data.submitLoading"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import { GetList, EditInfo } from "@/api/news";
import { timestampToTime } from "@/utils/common";
import {
  reactive,
  ref,
  watch,
  onMounted,
  onActivated,
} from "@vue/composition-api";
//组件
import UploadImg from "@c/UploadImg/index";
/* 引入富文本编辑器 */
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "InfoDetailed",
  components: { quillEditor, UploadImg },
  setup(props, { root }) {
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml",
    });
    const data = reactive({
      id: root.$route.params.id || root.$store.getters["InfoDetailed/infoId"],
      category: [],
      editorOption: {},
      submitLoading: false,
      form: {
        categoryId: "",
        title: "",
        createDate: "",
        content: "",
        imgUrl: "",
      },
    });

    /**
     * 获取信息分类
     */
    const getInfoCategory = () => {
      root.$store.dispatch("common/getInfoCategory").then((response) => {
        data.category = response;
      });
    };

    /**
     * 获取当前ID信息
     */
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id,
      };
      GetList(requestData).then((response) => {
        let responseData = response.data.data.data[0];
        data.form.categoryId = responseData.categoryId;
        data.form.title = responseData.title;
        data.form.content = responseData.content;
        data.form.imgUrl = responseData.imgUrl;
        data.form.createDate = timestampToTime(responseData.createDate);
      });
    };

    /**
     * 提交数据
     */
    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: data.form.categoryId,
        title: data.form.title,
        updateDate: "",
        content: data.form.content,
        imgUrl: data.form.imgUrl,
      };
      data.submitLoadinge = true;
      EditInfo(requestData)
        .then((response) => {
          root.$message({
            type: "success",
            message: "修改成功",
          });
          data.submitLoading = false;
        })
        .catch((error) => {
          data.submitLoading = false;
        });
    };

    /**
     * 生命周期
     */
    onMounted(() => {
      getInfoCategory();
    });
    onActivated(() => {
      data.id = root.$route.params.id || root.$store.getters["InfoDetailed/infoId"];
      getInfo();
    });
    return {
      data,
      uploadImgConfig,
      submit,
    };
  },
};
</script>
<style scoped></style>

<template>
  <div>
    <!-- 头部字段 -->
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">类别：</label>
          <div class="wrap-content">
            <el-select
              v-model="data.categoryValue"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="label-wrap date">
          <label for="">日期：</label>
          <div class="wrap-content">
            <el-date-picker
              v-model="data.dateValue"
              type="datetimerange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              style="width:100%;"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="label-wrap key-word">
          <label for="">关键字：</label>
          <div class="wrap-content">
            <SelectVue :config="data.configOption" />
            <!--  <el-select v-model="data.search_Key" style="width:100%;">
              <el-option
                v-for="item in searchOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          style="width:100%;"
          v-model="data.search_keyword"
          placeholder="请输入内容"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          size="medium"
          style="width:100%;"
          @click="search"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          size="medium"
          class="pull-right"
          style="width:100%;"
          @click="data.dialog_info = true"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <div class="black-space-30"></div>

    <!-- 表格数据 -->
    <el-table
      :data="tableData.item"
      v-loading="data.loadingData"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width="370"> </el-table-column>
      <el-table-column
        prop="categoryId"
        label="类别"
        width="90"
        :formatter="toCategory"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="160"
        :formatter="toData"
      >
      </el-table-column>
      <el-table-column prop="user" label="管理员" width="115">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteItem(scope.row.id)"
            v-btnPerm="'info:del'"
            class="hiden-button"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="editInfo(scope.row.id)"
            v-btnPerm="'info:edit'"
            class="hiden-button"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="editDetailed(scope.row)"
            v-btnPerm="'info:detailed'"
            class="hiden-button"
            >编辑详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="black-space-30"></div>

    <!-- 底部分页 -->
    <el-row>
      <el-col :span="8">
        <el-button size="small" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="16">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.total"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <DialogInfo
      :flag.sync="data.dialog_info"
      @close="closeDialog"
      :category="options.category"
      @getListEmit="getList"
    />
    <!-- 修改弹窗 -->
    <DialogEditInfo
      :flag.sync="data.dialog_info_edit"
      @close="closeDialog"
      :id="data.infoId"
      :category="options.category"
      @getListEmit="getList"
    />
  </div>
</template>
<script>
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { global } from "@/utils/global_V3.0";
import { common } from "@/api/common";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common";
/* 组件 */
import SelectVue from "@c/Select";
export default {
  name: "infoIndex",
  components: { DialogInfo, DialogEditInfo, SelectVue },
  setup(props, { root }) {
    const { getInfoCategory, categoryItem } = common();
    const { confirm } = global();
    /**
     * 数据----------------------------------------------------------------
     */
    const data = reactive({
      dialog_info: false,
      categoryValue: "",
      dateValue: "",
      search_Key: "id",
      search_keyword: "",
      total: 0,
      loadingData: false,
      deleteInfoId: "",
      dialog_info_edit: false,
      infoId: "",
      configOption: {
        init: ["id", "title"],
      }, //select传参
    });

    const options = reactive({
      category: [],
    });

    //搜索关键字
    const searchOption = reactive([
      {
        value: "id",
        label: "ID",
      },
      {
        value: "title",
        label: "标题",
      },
    ]);

    //表格数据
    const tableData = reactive({
      item: [],
    });

    //页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10,
    });

    /**
     * 方法（相当于2.0的method）
     */

    //改变页面条数
    const handleSizeChange = (val) => {
      page.pageSize = val;
    };
    //改变当前页码
    const handleCurrentChange = (val) => {
      page.pageNumber = val;
      getList();
    };

    const closeDialog = () => {
      data.dialog_info = false;
      getList();
    };

    /**
     * 搜索
     */
    const search = () => {
      let requestData = formatData();
      getList();
    };

    /**
     * 搜索条件处理
     */
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize,
      };
      //分类ID
      if (data.categoryValue) {
        requestData.categoryId = data.categoryValue;
      }
      //日期
      if (data.dateValue.length > 0) {
        requestData.startTiem = data.dateValue[0];
        requestData.endTime = data.dateValue[1];
      }
      //关键字
      if (data.search_keyword) {
        requestData[data.search_Key] = data.search_keyword;
      }

      return requestData;
    };

    /**
     * 获取信息列表
     */
    const getList = () => {
      //单独处理数据
      let requestData = formatData();
      data.loadingData = true; //加载状态
      GetList(requestData)
        .then((response) => {
          let returnData = response.data.data;
          tableData.item = returnData.data;
          //更新页码
          data.total = returnData.total;
          data.loadingData = false;
        })
        .catch((error) => {
          data.loadingData = false;
        });
    };

    /**
     * 修改信息
     */
    const editInfo = (id) => {
      data.infoId = id;
      data.dialog_info_edit = true;
    };

    /**
     * 跳转详情页
     */
    const editDetailed = (editData) => {
      //预先存值
      root.$store.commit("infoDetailed/SET_ID", editData.id);
      root.$store.commit("infoDetailed/SET_TITLE", editData.title);

      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: editData.id,
          title: editData.title,
        },
      });
    };

    //删除单条数据
    const deleteItem = (id) => {
      data.deleteInfoId = [id];
      confirm({
        content: "此操作将永久删除该数据, 是否继续",
        fn: confirmDelete,
      });
    };

    //多选功能
    const handleSelectionChange = (val) => {
      let id = val.map((item) => item.id);
      data.deleteInfoId = id;
    };

    //批量删除
    const deleteAll = () => {
      if (!data.deleteInfoId || data.deleteInfoId.length == 0) {
        root.$message({
          message: "请选择要删除的数据!",
          type: "error",
        });
        return false;
      }
      confirm({
        content: "此操作将永久删除选中数据, 是否继续",
        fn: confirmDelete,
      });
    };

    /**
     * 删除功能实现
     */
    const confirmDelete = (value) => {
      DeleteInfo({ id: data.deleteInfoId })
        .then((response) => {
          data.deleteInfoId = "";
          getList();
        })
        .catch((error) => {});
    };
    /*
      获取分类
     */
    const getCategory = () => {
      GetCategory({})
        .then((response) => {
          let data = response.data.data.data;
          options.category = data;
        })
        .catch((error) => {});
    };
    /* 
      转换日期格式
     */
    const toData = (row, column, cellValue, index) => {
      return timestampToTime(row.createDate);
    };

    /* 
      转换类型格式 
    */
    const toCategory = (row) => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter((item) => item.id == categoryId)[0];
      if(!categoryData) { return false }
      return categoryData.category_name;
    };

    /**
     * 生命周期
     */
    onMounted(() => {
      /* 获取分类 */
      //1、使用定义global
      getInfoCategory();
      //2、使用vueX
      // root.$store.dispatch('common/getInfoCategory').then(response => {
      //   options.category=response;
      // })

      /* 获取列表 */
      getList();
    });

    /**
     * watch
     */
    watch(
      () => categoryItem.item,
      (value) => {
        options.category = value;
      }
    );

    return {
      data,

      //reactive
      options,
      searchOption,
      tableData,
      // function
      handleSizeChange,
      handleCurrentChange,
      closeDialog,
      deleteItem,
      deleteAll,
      confirmDelete,
      getCategory,
      toData,
      toCategory,
      handleSelectionChange,
      search,
      getList,
      editInfo,
      editDetailed,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-word {
    @include labelDom(right, 100, 40);
  }
}
</style>
<style>
button.hiden-button {display: none;}
button.show-button {display: inline-block;}
</style>

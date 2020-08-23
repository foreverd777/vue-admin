<template>
  <div>
    <el-row>
      <el-col :span="21">
        <div class="label-wrap">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-row :gutter="12">
              <el-col :span="3">

              <SelectVue
                  :config="data.configOption"
                  :selectData.sync="data.selectData"/>

              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="data.keyWord"
                  placeholder="请输入搜索的关键词"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button size="medium" type="danger" @click="search"
                  >搜索</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="3">
        <el-button
          type="danger"
          size="medium"
          class="pull-right"
          @click="data.dialog_add = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <div class="black-space-30"></div>

    <TableVue
      ref="userTable"
      :config="data.configTable"
      :tableRow.sync="data.tableRow"
    >
      <template v-slot:status="slotdata">
        <el-switch
          @change="handlerSwitch(slotdata.data)"
          v-model="slotdata.data.status"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>

      <template v-slot:operation="slotData">
        <el-button size="mini" type="danger" @click="handlerDel(slotData.data)"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="success"
          @click="handlerEdit(slotData.data)"
          >编辑</el-button
        >
      </template>

      <template v-slot:tableFooterLeft>
        <el-button size="mini" @click="handlerBatchDel">批量删除</el-button>
      </template>
    </TableVue>

    <DialogAdd
      :flag.sync="data.dialog_add"
      :editData="data.editData"
      @refreshTableData="refreshData"
    />
  </div>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
import { UserDel, UserActives } from "@/api/user";
import { global } from "@/utils/global_V3.0";
/* 组件 */
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";
export default {
  name: "userIndex",
  components: { SelectVue, TableVue, DialogAdd },
  setup(props, { root, refs }) {
    const { confirm } = global();
    const userTable = ref(null);
    const data = reactive({
      selectData: { label: "姓名", value: "truename" }, //select返回数据
      keyWord: "", //搜索关键字
      tableRow: {}, //tableSelection数据
      dialog_add: false,
      editData: {},
      configOption: {
        init: ["truename", "phone"],
      },
      //阻止状态
      updateUserStatusFlag: false,
      //table组件配置参数
      configTable: {
        //多选框
        selection: true,
        //翻页记录checkbox
        recordCheckbox: true,
        //表头
        tHead: [
          {
            label: "邮箱/用户名",
            field: "username",
          },
          {
            label: "姓名",
            field: "truename",
            width: 100,
          },
          {
            label: "手机号",
            field: "phone",
            width: 120,
          },
          {
            label: "地区",
            field: "region",
            width: 230,
          },
          {
            label: "角色",
            field: "role",
            width: 100,
          },
          {
            label: "禁启用状态",
            filed: "status",
            columnType: "slot",
            slotName: "status",
            width: 100,
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation",
          },
        ],
        //请求接口URL
        requestData: {
          url: "getUserList",
          data: {
            pageNumber: 1,
            pageSize: 10,
          },
        },
        pagination: true,
      },
    });

    /**
     *  methods
     */

    /* 搜索 */
    const search = () => {
      let requestData = {
        [data.selectData.value]: data.keyWord,
      };
      refs.userTable.paramsLoadData(requestData);
    };

    /* 批量删除 */
    const handlerBatchDel = () => {
      let userId = data.tableRow.idItem;
      if (!userId || userId.length === 0) {
        root.$message({
          message: "请勾选要删除的用户！",
          type: "error",
        });
        return false;
      }
      confirm({
        content: "此操作将永久删除选中数据, 是否继续",
        fn: userDelete,
      });
    };

    //删除用户
    const userDelete = () => {
      UserDel({ id: data.tableRow.idItem }).then((response) => {
        //第一种写法
        refreshData();
        //第二种写法
        //userTable.value.refreshData();  //userTable需要定义好
      });
    };

    const refreshData = () => {
      refs.userTable.refreshData();
    };

    /* 单个删除 */
    const handlerDel = (params) => {
      data.tableRow.idItem = [params.id];
      confirm({
        content: "此操作将永久删除选中数据, 是否继续",
        fn: userDelete,
      });
    };

    /* 
      Switch改变时触发 
    */
    const handlerSwitch = (params) => {
      if (data.updateUserStatusFlag) {
        return false;
      }
      data.updateUserStatusFlag = true;
      let requestData = {
        id: params.id,
        status: params.status,
      };
      UserActives(requestData)
        .then((response) => {
          root.$message({
            message: response.data.message,
            type: "success",
          });
          data.updateUserStatusFlag = false;
        })
        .catch((error) => {
          data.updateUserStatusFlag = false;
        });
    };

    /* 
      编辑 
    */
    const handlerEdit = (params) => {
      data.dialog_add = true;
      data.editData = Object.assign({}, params);
    };

    return {
      data,
      search,
      handlerBatchDel,
      handlerDel,
      refreshData,
      handlerSwitch,
      handlerEdit,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  @include labelDom(left, 60, 40);
}
</style>

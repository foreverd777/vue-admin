<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select v-model="data.provinceValue" @change="handlerProvince">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :value="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
          ></el-option> </el-select
      ></el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="data.cityValue" @change="handlerCity">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :value="item.CITY_CODE"
            :label="item.CITY_NAME"
          ></el-option></el-select
      ></el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="data.areaValue" @change="handlerArea">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :value="item.AREA_CODE"
            :label="item.AREA_NAME"
          ></el-option></el-select
      ></el-col>
      <el-col :span="6" v-if="init.street">
        <el-select v-model="data.streetValue" @change="handlerStreet">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :value="item.STREET_CODE"
            :label="item.STREET_NAME"
          ></el-option></el-select
      ></el-col>
    </el-row>
  </div>
</template>
<script>
import { GetCityPicker } from "@/api/common";
import { reactive, watch, onBeforeMount } from "@vue/composition-api";
export default {
  name: "cityPicker",
  props: {
    cityPickerLevel: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    //初始化省市区街联动
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false,
    });
    const data = reactive({
      provinceValue: "",
      cityValue: "",
      areaValue: "",
      streetValue: "",
      provinceData: [],
      cityData: [],
      areaData: [],
      streetData: [],
    });

    const resultData = reactive({
      provinceValue: "",
      cityValue: "",
      areaValue: "",
      streetValue: "",
    });

    /**
     * 初始化
     */
    const initCityPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length === 0) {
        for (let key in init) {
          init[key] = true;
        }
      } else {
        initData.forEach((item) => {
          init[item] = true;
        });
      }
    };

    /**
     * 获取省份
     */
    const getProvince = () => {
      getData({ type: "province" });
    };

    /**
     * 选择省份后，获取城市
     */
    const handlerProvince = (val) => {
      resetValue({ type: "city" });
      getData({ type: "city", province_code: val });
    };

    /**
     * 选择城市后，获取县区
     */
    const handlerCity = (val) => {
      resetValue({ type: "area" });
      getData({ type: "area", city_code: val });
    };

    /**
     * 选择区县后，获取街道
     */
    const handlerArea = (val) => {
      resetValue({ type: "street" });
      getData({ type: "street", area_code: val });
    };

    /**
     * 选择街道
     */
    const handlerStreet = (val) => {
      resetValue({ type: "" });
    };

    /**
     * 获取数据
     */
    const getData = (params) => {
      GetCityPicker(params).then((response) => {
        data[`${params.type}Data`] = response.data.data.data;
      });
    };

    /**
     * 重置选项
     */
    const resetValue = (params) => {
      const valueJson = {
        city: ["cityValue", "areaValue", "streetValue"],
        area: ["areaValue", "streetValue"],
        street: ["streetValue"],
      };
      //清空指定的key值
      const arrObj = valueJson[params.type];
      if (arrObj) {
        arrObj.forEach((item) => {
          data[item] = "";
        });
      }
      result();
    };

    /**
     * 返回数据集合
     */
    const result = () => {
      for (let key in resultData) {
        resultData[key] = data[key];
      }
    };

    /**
     * 监听
     */
    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue,
      ],
      ([province, city, area, street]) => {
        emit("update:cityPickerData", resultData);
      }
    );

    onBeforeMount(() => {
      //获取省份
      getProvince();
      //初始化
      initCityPicker();
    });

    return {
      data,
      init,
      resultData,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet,
      initCityPicker,
    };
  },
};
</script>
<style lang="scss" scoped></style>

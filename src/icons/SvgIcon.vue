<template>
   <svg :class="svgClass" aria-hidden="true">
       <use :xlink:href="iconName"></use>
   </svg>
   
</template>
<script>
import {  ref, onMounted, computed } from "@vue/composition-api";
export default {
    name: "SvgIcon",
    //props: ['iconClass', 'className'],
    props:{
        iconClass:{
            type: String,  //定义接收的值类型
            default: "defaut",
            //required: true,  //设置是否必须传值
            /* validator: (value)=>{
                return value >= 0   //验证传入的值是否符合规则
            } */
        },
        className:{
            type: String,  //定义接收的值类型
            default: "defaut",
            //required: true,  //设置是否必须传值
        }
    },
    setup(props){
       //计算属性，得出最终结果，并返回
       const iconName = computed(() => `#icon-${props.iconClass}`)
       const svgClass = computed(() => {
           if(props.className){
               return `svg-icon ${props.className}`
           }else{
               return `svg-icon`
           }
       })
        /**
         * computed 监听属性变化，并计算属性
         */
        //const number = ref(10);
        // const plusOne = computed(() => {
        //     return count.value + 1
        // })

        // const plusOne = computed({
        //     get: () => number.value +1,
        //     set: val => { number.value = val - 1 }
        // })

        return{      
            iconName,
            svgClass
        }
    }
}
</script>
<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    color: #fff;
    // &.font20{
    //     font-size: 20px;
    // } 
}
</style>

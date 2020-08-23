<template>
    <div id="main-wrap">
        <div class="main-content">
            <div class="content" include="infoIndex">
                <!-- 子路由显示区 -->
                <keep-alive>
                    <!-- 需要缓存 -->
                    <router-view />
                </keep-alive>              
                </div>
        </div>
    </div>    
</template>
<script>
import { ref, reactive } from "@vue/composition-api";
export default {
    name: 'layoutMain',
    setup(){
       /*  const str = ref('{"name":"gogogo", "title":"111"}');
        console.log(str.value);

        //字符串转对象
        const json = reactive(JSON.parse(str.value));
        console.log(json);
        console.log(json.title);

        //对象转字符串
        const toString = ref(JSON.stringify(json));
        console.log(toString.value); */

    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
    height: 100vh;
    width: 100%;
    //position: fixed;
    // left: $navMenu;
    // top: 75px;
    // right: 0;
    // bottom: 0;
    // border: 30px solid #f7f7f7;
    // border-bottom: none;
    // border-right: none;
    // -webkit-box-sizing: border; 
}

.main-content {
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 30;
    padding-right: 30px;
    @include webkit(box-sizing, border-box);
    @include webkit(transition, all .3s ease 0s);

}
.open {
    .main-content{  padding-left: $navMenu + 30; }
}
.close {
    .main-content{  padding-left: $navMenuMin + 30; }
}
.content {
    width: 100%;
    height: 100%;
    padding-top: 30px;
    padding-left: 30px;
    @include webkit(box-sizing, border-box);
    background-color: #fff;
}
</style>
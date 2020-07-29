<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="menu" className="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <div class="header-icon-left pull-left head-padding">
          <svg-icon iconClass="head" className="head" />
        </div>
        {{ username }}
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" className="exit" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.app.username);
    const navMenuState = () => {
      root.$store.commit("app/SET_COllAPSE");
    };

    //退出按钮事件
    const exit = () =>{
      root.$confirm('是否退出系统?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           root.$store.dispatch("app/exit").then(() =>{
            root.$router.push({
                name: 'Login'
            })
        })
        }).catch(() => {});
    
        
    }

    return {
      navMenuState,
      username,
      exit
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  height: 75px;
  background-color: #fff;
  line-height: 75px;
  @include webkit(shadow, 0 3px 16px 16px rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
.head-padding {
  padding: 0 12px;
  svg {
    margin-bottom: -8px;
    font-size: 30px;
    cursor: pointer;
  }
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
    color: green;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
}
</style>

<template>
  <div id="app">
    <div class="main-content">
      <main-menu @func="getSubNav" ref="menu"></main-menu>
      <div class="main-body">
        <main-header :subNav="subNav"></main-header>
        <div class="main-body-child">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "./components/header/index.vue";
import MainMenu from "./components/menu/index.vue";

export default {
  name: "app",
  data() {
    return {
      subNav: [],
    };
  },
  components: {
    MainHeader,
    MainMenu,
  },
  watch: {},
  mounted() {
    if (navigator.userAgent.indexOf("Mobile") === -1) {
      //  this.isMobile=true
      this.$store.commit("setIsMobile", true);
    } else {
      // this.isMobile=false
      this.$store.commit("setIsMobile", false);
    }
  },
  methods: {
    getSubNav(data) {
      this.subNav = data;
      console.log(data);
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  background-size: cover;
  font-family: "Microsoft YaHei", "PingFang SC", -apple-system, "Helvetica Neue",
    Helvetica, Arial, "Microsoft Jhenghei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .main-content {
    width: inherit;
    height: 100%;
    display: flex;
    align-items: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .main-body {
    width: 100%;
    height: 100%;
    margin: 0 10px 10px 0;
  }
  .main-body-child {
    height: calc(100vh - 50px);
    margin: 30px 15px;
    padding-bottom: 50px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    overflow-y: auto;
    overflow-x: auto;
  }
}
</style>
<style>
.breadcrumbBox {
  margin: 20px 0 15px 15px;
  font-size: 14px;
}
.el-breadcrumb__inner {
  color: #1c2e32 !important;
}
</style>
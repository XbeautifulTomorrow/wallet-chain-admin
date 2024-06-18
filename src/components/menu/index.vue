<template>
  <div class="main-menu">
    <div class="logoBox">
      <img src="@/assets/images/logo.png" alt="" />后台管理
    </div>
    <div class="menu-srcoll">
      <vuescroll :ops="ops">
        <el-menu :default-openeds="openeds" :default-active="defaultActive" background-color="#304156" text-color="#fff"
          class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <template v-for="(item, index) in menuList">
            <el-submenu :index="item.menuName" :key="index" v-if="item.children && item.children.length > 0">
              <template slot="title">
                <!-- <i :class="['el-icon-img', menuIcon(index)]"></i> -->
                <span>{{ item.menuName }}</span>
              </template>
              <template v-for="(i, indexs) in item.children">
                <el-menu-item :index="i.path" v-if="i.path && i.path != 'null'" :key="indexs" @click="goUrl(i.path)">{{
                  i.menuName }}</el-menu-item>
              </template>
            </el-submenu>
            <template v-else>
              <el-menu-item :index="item.path" :key="index" v-if="item.path" @click="goUrl(item.path)">
                <!-- <i class="el-icon-menu"></i> -->
                <span slot="title">{{ item.menuName }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </vuescroll>
    </div>
  </div>
</template>

<script>
import vuescroll from "vuescroll";
export default {
  data() {
    return {
      // menuList: [],
      menuList: [
        {
          id: 1,
          menuName: "用户管理",
          path: "userManage"
        },
        {
          id: 2,
          menuName: "平台管理",
          path: "platformManage"
        },
        {
          id: 3,
          menuName: "充提管理",
          children: [
            {
              id: 4,
              menuName: "网络管理",
              path: "networkManage",
            },
            {
              id: 5,
              menuName: "币种管理",
              path: "coinManage",
            },
            {
              id: 6,
              menuName: "金流管理",
              path: "moneyFlowManage",
            },
            {
              id: 6,
              menuName: "充值管理",
              path: "rechargeManage",
            },
            {
              id: 7,
              menuName: "提款管理",
              path: "withdrawalManage",
            },
          ],
        },
        {
          id: 8,
          menuName: "钱包管理",
          children: [
            {
              id: 9,
              menuName: "充值钱包",
              path: "walletRechargeManage",
            },
            {
              id: 10,
              menuName: "提款钱包",
              path: "walletWithdrawalManage",
            },
            {
              id: 11,
              menuName: "Gas钱包",
              path: "walletGasManage",
            },
            {
              id: 11,
              menuName: "归集钱包",
              path: "walletGatherManage",
            },
            {
              id: 12,
              menuName: "归集统计",
              path: "walletGatherStatistics",
            },
            {
              id: 12,
              menuName: "Gas统计",
              path: "walletGasStatistics",
            }
          ]
        },
        {
          id: 1,
          menuName: "广告管理",
          children: [
            {
              id: 1,
              menuName: "Banner管理",
              path: "bannerList",
            },
            {
              id: 2,
              menuName: "公告管理",
              path: "noticeList",
            },
          ],
        },
        {
          id: 1,
          menuName: "协议管理",
          children: [
            {
              id: 1,
              menuName: "协议列表",
              path: "userAgreementList",
            },
          ],
        },
        {
          id: 2,
          menuName: "系统管理",
          children: [
            {
              id: 1,
              menuName: "用户管理",
              path: "accountList",
            },
            {
              id: 1,
              menuName: "权限管理",
              path: "permissionAssign",
            },
            {
              id: 1,
              menuName: "角色管理",
              path: "roleList",
            },
          ],
        },
      ],
      ops: {
        bar: {
          background: "#ddd",
          keepShow: false,
          size: "3px",
          minSize: 0.2,
        },
      },
      defaultActive: "orderList",
      openeds: [],
    };
  },
  components: {
    vuescroll,
  },
  created() {
    this.openeds = this.menuList.map((x) => x.menuName);
    this.routeActiveFunc(this.$route);
    // this.getUserMenuFunc();
  },
  watch: {
    $route(val) {
      this.routeActiveFunc(val);
    },
  },
  methods: {
    handleOpen() { },
    handleClose() { },
    menuIcon(index) {
      let path = this.menuList[index].children[0].url;
      let icon = "";
      return icon;
    },
    async getUserMenuFunc() {
      let res = await this.$http.getMenuList();
      if (res) {
        this.menuList = res;
        this.openeds = this.menuList.map((x) => x.menuName);
        this.getSubNavFunc(this.$route.name);
      }
    },
    getSubNavFunc(path) {
      let arr = [];
      this.menuList.forEach((x) => {
        if (x.children && x.children.length > 0) {
          x.children.forEach((y) => {
            if (y.path == path) {
              arr = [
                { name: x.menuName, path },
                { name: y.menuName, path },
              ];
            }
          });
        } else {
          if (x.path == path) {
            arr = [{ name: x.menuName, path }];
          }
        }
      });

      this.$emit("func", arr);
    },
    routeActiveFunc(val) {
      let pathSplit = val.path.split("/");
      if (pathSplit.length > 2) {
        let path = pathSplit[0] + pathSplit[1];
        this.defaultActive = path;
      } else {
        this.defaultActive = val.name;
      }
    },
    goUrl(url) {
      if (this.$route.name !== url) {
        this.getSubNavFunc(url);
        this.$router.push({ name: url });
      }
    },
  },
};
</script>

<style lang="scss">
.main-menu {
  width: 220px;
  height: 100%;
  overflow: hidden;
  background: #304156;
  flex-shrink: 0;
  position: relative;

  .logoBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
    background: #2b2f3a;

    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
  }
}

.el-menu {
  border-right: 1px solid #304156;
}

.main-menu .menu-srcoll {
  height: calc(100% - 60px);
}

.el-submenu.is-active.is-opened .el-menu-item.is-active,
.el-menu>.el-menu-item.is-active {
  background: #209e91 !important;
  color: #fff;
}

.el-menu-item.is-active:hover {
  color: #fff !important;
}

.el-menu-item:hover {
  color: #209e91 !important;
}

.el-submenu.is-active.is-opened div,
.el-submenu.is-active.is-opened li {
  background-color: #1f2d3d !important;
}
</style>

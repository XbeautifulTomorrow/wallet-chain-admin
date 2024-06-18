import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
  },
  {
    path: "/",
    component: () => import("@/layar"),
    children: [
      // 用户管理
      {
        path: "/",
        name: "userManage",
        component: () => import("@/views/accounts/userList"),
      },
      // 用户管理
      {
        path: "/user-manage",
        name: "userManage",
        component: () => import("@/views/accounts/userList"),
      },
      // 平台管理
      {
        path: "/platform-manage",
        name: "platformManage",
        component: () => import("@/views/accounts/platformList"),
      },
      // 网络管理
      {
        path: "network-manage",
        name: "networkManage",
        component: () => import("@/views/Recharges/networkList"),
      },
      // 币种管理
      {
        path: "coin-manage",
        name: "coinManage",
        component: () => import("@/views/Recharges/coinList"),
      },
      // 金流管理
      {
        path: "money-flow-manage",
        name: "moneyFlowManage",
        component: () => import("@/views/Recharges/moneyFlowList"),
      },
      // 充值管理
      {
        path: "recharge-manage",
        name: "rechargeManage",
        component: () => import("@/views/Recharges/rechargeList"),
      },
      // 提款管理
      {
        path: "withdrawal-manage",
        name: "withdrawalManage",
        component: () => import("@/views/Recharges/withdrawalList"),
      },
      // 钱包充值管理
      {
        path: "wallet-recharge-manage",
        name: "walletRechargeManage",
        component: () => import("@/views/walletManager/rechargeList"),
      },
      // 钱包提款管理
      {
        path: "wallet-withdrawal-manage",
        name: "walletWithdrawalManage",
        component: () => import("@/views/walletManager/withdrawalList"),
      },
      // 钱包Gas管理
      {
        path: "wallet-gas-manage",
        name: "walletGasManage",
        component: () => import("@/views/walletManager/gasList"),
      },
      // 钱包归集管理
      {
        path: "wallet-gather-manage",
        name: "walletGatherManage",
        component: () => import("@/views/walletManager/gatherList"),
      },
      // 钱包归集统计
      {
        path: "wallet-gather-statistics",
        name: "walletGatherStatistics",
        component: () => import("@/views/walletManager/gatherStatistics"),
      },
      // 钱包Gas统计
      {
        path: "wallet-gas-statistics",
        name: "walletGasStatistics",
        component: () => import("@/views/walletManager/gasStatistics"),
      },
      // 公告中心
      {
        path: "/advertis/announcementList",
        name: "noticeList",
        component: () => import("@/views/configManage/noticeList"),
      },
      // 添加公告
      {
        path: "/advertis/addNotice",
        name: "addNotice",
        component: () => import("@/views/configManage/addNotice"),
      },
      // banner管理
      {
        path: "/advertis/bannerList",
        name: "bannerList",
        component: () => import("@/views/configManage/bannerList"),
      },
      {
        path: "/advertis/saveBanner",
        name: "addBanner",
        component: () => import("@/views/configManage/addBanner"),
      },
      // 系统管理
      {
        path: "/accountList",
        name: "accountList",
        component: () => import("@/views/system/accountList"),
      },
      {
        path: "/permissionAssign",
        name: "roleList",
        component: () => import("@/views/system/roleList"),
      },
      {
        path: "/sys/role/list",
        name: "permissionAssign",
        component: () => import("@/views/system/permissionAssign"),
      },
      // 版本管理
      {
        path: "/versionList",
        name: "versionList",
        component: () => import("@/views/system/versionList"),
      }
    ],
  },
];

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    window.scrollTo(0, 0);
    return { x: 0, y: 0 };
  },
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token");
  if (to.name == "login" || token) {
    next();
  } else {
    next({ name: "login" });
  }
});

export default router;

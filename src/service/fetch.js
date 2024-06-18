import http from "./apiService";

/**
 * @description 登录
 */
export const login = (obj) => http.post("/sys-user/login", obj);

/**
 * @description 修改密码
 */
export const updatePassword = (obj) => http.post("/sys-user/updatePassword", obj);

/**
 * @description 用户管理
 */
export const getUserList = (obj) => http.get("/businesses-user/pageList", obj); // 用户列表
export const getUserDetails = (obj) => http.get("/businesses-user/details", obj); // 用户资产详情
export const userLockOrUn = (obj) => http.get("/businesses-user/lockOrUn", obj); // 用户限制和解除
export const userUpAmount = (obj) => http.post("/businesses-user/upAndDown", obj); // 上下分


/**
 * @description 平台管理
 */
export const getPlatformList = (obj) => http.get("/businesses-info/pageList", obj); // 平台列表
export const getPlatformDownBox = (obj) => http.get("/businesses-info/downBox", obj); // 平台下拉
/**
 * @description 网络管理
 */
export const getChainConfigList = (obj) => http.get("/chain-config/pageList", obj); // 网络列表
export const getChainDownBox = (obj) => http.get("/chain-config/downBox", obj); // 网络下拉

/**
 * @description 币种管理
 */
export const getCoinConfigList = (obj) => http.get("/coin-config/pageList", obj); // 币种列表
export const getCoinDownBox = (obj) => http.get("/coin-config/downBox", obj); // 币种下拉


/**
 * @description 金流管理
 */
export const getAssetFlowList = (obj) => http.get("/asset-flow/pageList", obj); // 金流列表

/**
 * @description 充值管理
 */
export const getRechargeList = (obj) => http.get("/user-recharge/pageList", obj); // 充值列表

/**
 * @description 提款管理
 */
export const getWithdrawalList = (obj) => http.get("/user-withdrawal/pageList", obj); // 提款列表

/**
 * @description 钱包充值管理
 */
export const getWalletRechargeList = (obj) => http.get("/user-wallet/pageList", obj); // 钱包充值列表

/**
 * @description 钱包提款管理
 */
export const getWalletWithdrawalList = (obj) => http.get("/businesses-withdrawal-wallet/pageList", obj); // 钱包提款列表

/**
 * @description 钱包Gas管理
 */
export const getWalletGasList = (obj) => http.get("/businesses-gas-wallet/pageList", obj); // 钱包Gas列表

/**
 * @description 钱包归集管理
 */
export const getWalletGatherList = (obj) => http.get("/businesses-aggregation-wallet/pageList", obj); // 钱包归集列表

/**
 * @description 钱包归集统计
 */
export const getWalletGatherStatisticsList = (obj) => http.get("/coin-aggregation-record/pageList", obj); // 归集统计列表

/**
 * @description 钱包Gas统计
 */
export const getWalletGasStatisticsList = (obj) => http.get("/gas-record/pageList", obj); // Gas统计列表


// 权限管理
export const getCode = (obj) => http.get("/sys-user/getCode", obj);
export const userList = (obj) => http.get("/sys-user/user/list", obj);
export const userDelete = (obj) => http.get("/sys-user/deleteUser", obj);
export const userAdd = (obj) => http.post("/sys-user/addUser", obj);
export const userEdit = (obj) => http.post("/sys-user/updateUser", obj);
export const roleList = (obj) => http.get("/sys-user/role/downBox", obj);
export const roleAdd = (obj) => http.post("/sys-user/addRole", obj);
export const roleUpdate = (obj) => http.post("/sys-user/updateRole", obj);
export const menuList = (obj) => http.get("/sys-user/menuTreeList", obj);
export const addMenu = (obj) => http.post("/sys-user/addMenu", obj);
export const deleteMenu = (obj) => http.get("/sys-user/deleteMenu", obj);
export const updateMenu = (obj) => http.post("/sys-user/updateMenu", obj, true);
export const roleAuth = (obj) => http.post("/sys-user/addRoleMenuCorr", obj);
export const getMenuList = (obj) => http.get("/sys-user/menuTree", obj);
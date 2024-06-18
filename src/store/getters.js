const getters = {
  /*分页*/
  total: state => state.list.total, //分页的总条数
  start: state => state.list.start, //分页的开始条数
  limit: state => state.list.limit, //分页的结束条数
  rules: state => state.list.rules, //分页文字

  /**
 * @description: 获取币种列表
 * @param {*}
 * @return {*}
 */
  getCurrency(state) {
    if (state.user.currencys) return state.user.currencys;
    return null;
  },
  /**
   * @description: 获取账户信息
   * @param {*}
   * @return {*}
   */
  getAccount(state) {
    if (state.user.account) return state.user.account;
    return null;
  },
  /**
   * @description: 获取链接状态
   * @param {*}
   * @return {*}
   */
  getConnect(state) {
    return state.user.isConnect;
  },
  /**
   * @description: 获取当前链ID
   * @param {*}
   * @return {*}
   */
  getChainId(state) {
    return state.user.chainId;
  },

  /**
   * @description: 获取权限Bytes32
   * @param {*}
   * @return {*}
   */
  getApplyRole(state) {
    return state.user.applyRole;
  },
};
export default getters;

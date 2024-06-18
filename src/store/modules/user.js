import Vue from 'vue'
// import wallet from "@/utils/global.wallet.js";
// import contract from "@/utils/global.contract.js";
import { tokenAddrList, contractList } from "@/utils/chain";

const user = {
    state: {
        // 币种列表
        currencys: ['BTC', 'ETC', 'ETHF', 'ETHW', 'ETH', 'POM', 'PINK', 'KAS', 'ALEO', 'NEXA', 'CFX', 'CTXC', 'CKB', 'ERG', 'BCH', 'AE', 'FIRO', 'ALPH', 'RVN', 'RXD', 'IRON'],
        // 钱包地址
        account: null,
        //链接状态
        isConnect: false,
        //链id
        chainId: null,
        // 权限Bytes32
        applyRole: null
    },
    mutations: {
        /**
         * @description: 更新钱包地址
         */
        SET_ACCOUNT(state, payload) {
            state.account = payload;
        },
        /**
         * @description: 获取当前链Id
         */
        SET_CHAIN_ID(state, payload) {
            state.chainId = payload;
        },
        /**
         * @description: 更新钱包连接状态
         */
        SET_IS_CONNECT(state, payload) {
            state.isConnect = payload;
        },
        /**
         * @description: 更新权限Bytes32
         */
        SET_APPLY_ROLE(state, payload) {
            state.applyRole = payload;
        },
    },
    actions: {
        /**
         * @description: 链接状态更新
         */
        listening({ commit }, event) {
            if (event.isc) {
                commit("SET_IS_CONNECT", true);
                commit("SET_ACCOUNT", event.account);
            } else {
                commit("SET_IS_CONNECT", false);
                commit("SET_ACCOUNT", undefined);
            }
        },
        /**
         * @description: 链接钱包
         */
        walletConnect() {
            var wallet = Vue.prototype.$wallet;
            return new Promise((resolve, reject) => {
                wallet.connect().then((success) => {
                    resolve(success);
                }).catch((error) => {
                    console.log(error)
                    reject(error)
                })
            })
        },
        currentChainId({ commit },) {
            return new Promise((resolve, reject) => {
                if (window.ethereum) {
                    window.ethereum
                        .request({ method: 'eth_chainId' }).then((chainId) => {
                            commit("SET_CHAIN_ID", chainId);
                            window.sessionStorage["chain"] = parseInt(chainId, 16);
                            resolve(chainId)
                        });
                } else {
                    reject(false)
                }
            })
        },
        /**
         * @description: 断开钱包
         */
        disWalletConnect({ state }) {
            if (!state.isConnect) return
            var wallet = Vue.prototype.$wallet;
            wallet.close().then((success) => {
                if (!success) console.log("error");
                Vue.prototype.$contract = new contract();
            });
        },
        /**
         * @description: 授权
         */
        approve({ }, event) {
            var contract = Vue.prototype.$contract;
            return new Promise((resolve, reject) => {
                contract
                    .send("IERC20")
                    .action("approve", [contractList[event.chain], event.amount])
                    .then((res) => {
                        resolve(res)
                    }).catch((error) => {
                        console.log(error)
                        reject(error)
                    })
            })
        },
        /**
         * @description: 获取授权金额
         */
        allowance({ state }, event) {
            var contract = Vue.prototype.$contract;
            return new Promise((resolve, reject) => {
                contract
                    .call("IERC20")
                    .action("allowance", [state.account, contractList[event]])
                    .then((res) => {
                        resolve(res)
                    }).catch((error) => {
                        reject(error)
                    })
            })
        },
        /**
         * @description: 打款
         */
        makePayment({ }, event) {
            console.log(event)
            const { walletAddr, amount, chain, amountVal } = event;
            var contract = Vue.prototype.$contract;
            return new Promise((resolve, reject) => {
                if (chain == "ETHEREUM") {
                    console.log("Ethereum主链转账")
                    // Ethereum主链转账
                    contract
                        .send("MultiSenders")
                        .action("multisendEther", [walletAddr, amount], amountVal)
                        .then((res) => {
                            console.log(res);
                            resolve(res)
                        }).catch((error) => {
                            console.log(error)
                            reject(error)
                        });
                    return
                }

                console.log("其他链代币转账")
                // 其他链代币转账
                contract
                    .send("MultiSenders")
                    .action("multisendERC20", [tokenAddrList[chain], walletAddr, amount])
                    .then((res) => {
                        console.log(res);
                        resolve(res)
                    }).catch((error) => {
                        console.log(error)
                        reject(error)
                    });

            })
        }
    }
}
export default user
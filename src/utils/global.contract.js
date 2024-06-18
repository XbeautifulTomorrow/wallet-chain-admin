import Vue from "vue";

export default class {
  constructor() {
    this.abis = new Object();
    this.contracts = new Object();
    this.address = new Object();

    this.objCall = Object.prototype.hasOwnProperty;
  }

  _getContractABI = (name) => {
    if (this.objCall.call(this.abis, name)) {
      return this.abis[name];
    }

    this.abis[name] = require(
      "../contracts/" + name + ".json"
    );
    return this.abis[name];
  }

  _getContract = (name, address) => {
    if (!Vue.prototype.$wallet) {
      throw "Please connect your wallet first";
    }

    var wallet = Vue.prototype.$wallet;
    if (!wallet.account) {
      throw "Wallet address is invalid";
    }

    // if (this.objCall.call(this.contracts, name)) {
    //   return this.contracts[name];
    // }

    const abi = this._getContractABI(name);
    if (address) {
      return new wallet.web3.eth.Contract(
        abi.abi, address
      )
    }

    this.address[name] = abi.networks[wallet.chainId].address;

    this.contracts[name] = new wallet.web3.eth.Contract(
      abi.abi, abi.networks[wallet.chainId].address
    )

    return this.contracts[name];
  }

  init = (name, address, abi) => {
    if (!Vue.prototype.$wallet) {
      throw "Please connect your wallet first";
    }

    var wallet = Vue.prototype.$wallet;
    if (!wallet.account) {
      throw "Wallet address is invalid";
    }

    return new wallet.web3.eth.Contract(
      abi, address
    )
  }

  call = (name, address) => {
    const c = this._getContract(name, address);

    return {
      action: (method, parms) => new Promise((
        resolve, reject
      ) => {
        if (parms) {
          c.methods[method](...parms).estimateGas({
            from: Vue.prototype.$wallet.account
          }).then((estimateGas) => {
            c.methods[method](...parms).call({
              from: Vue.prototype.$wallet.account,
              gas: estimateGas
            }).then((result) => resolve(result)).catch((error) => reject(error));
          }).catch((error) => reject(error));
        } else {
          c.methods[method]().estimateGas({
            from: Vue.prototype.$wallet.account
          }).then((estimateGas) => {
            c.methods[method]().call({
              from: Vue.prototype.$wallet.account,
              gas: estimateGas
            }).then((result) => resolve(result)).catch((error) => reject(error));
          }).catch((error) => reject(error));
        }
      }),
      contract: c
    }
  }

  send = (name, address) => {
    const c = this._getContract(name, address);
    console.log(c)

    return {
      action: (method, parms = null, value = 0) => new Promise((
        resolve, reject
      ) => {
        if (parms) {
          c.methods[method](...parms).estimateGas({
            from: Vue.prototype.$wallet.account,
            to: c._address,
            value: value
          }).then((estimateGas) => {
            c.methods[method](...parms).send({
              from: Vue.prototype.$wallet.account,
              to: c._address,
              gas: estimateGas,
              value: value
            }).then((result) => resolve(result)).catch((error) => reject(error));
          }).catch((error) => reject(error));
        } else {
          c.methods[method]().estimateGas({
            from: Vue.prototype.$wallet.account,
            to: c._address,
            value: value
          }).then((estimateGas) => {
            c.methods[method]().send({
              from: Vue.prototype.$wallet.account,
              to: c._address,
              gas: estimateGas,
              value: value
            }).then((result) => resolve(result)).catch((error) => reject(error));
          }).catch((error) => reject(error));
        }
      }),
      contract: c
    }
  }
}
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import store from '@/store'

const infuraId = "ae25803f3d394a5da4c863280b651037";
export default class {
  constructor(listening, isVuex) {
    this.listening = undefined;
    this.isVuex = isVuex || false;
    if (!isVuex) this.listening = listening
    this.web3ModalParamters = {
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { infuraId }
        }, cacheProvider: true
      }
    }

    this.web3 = undefined;

    this.modal = undefined;
    this.provider = undefined;

    this.account = undefined;
    this.chainId = undefined;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.modal = new Web3Modal(
          this.web3ModalParamters
        );

        this.modal.on("connect", (proxy) => {
          this.account = proxy.selectedAddress;
          this.chainId = parseInt(proxy.chainId, 16);
          if (this.isVuex) {
            store.dispatch("listening", {
              isc: true,
              account: this.account
            });
          } else {
            this.listening(true, this.account);
          }
        });

        this.modal.connect().then((provider) => {
          if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
              window.ethereum.enable();
            } catch (error) {
              console.log("WEB3-INFO: " + error);
              return reject(error);
            }
          } else if (window.web3) {
            this.web3 = window.web3;
          } else {
            this.web3 = new Web3(
              new Web3.providers.HttpProvider(provider)
            );
          }

          provider.on("accountsChanged", (accounts) => {
            this.account = accounts[0];
            if (this.isVuex) {
              store.dispatch("listening", {
                isc: true,
                account: this.account
              });
            } else {
              this.listening(true, this.account);
            }
          });

          provider.on("chainChanged", (chainId) => {
            this.chainId = parseInt(chainId, 16);
          });

          this.provider = provider;
          return resolve(true);
        }).catch((error) => {
          return reject(error);
        });
      } catch (error) {
        console.log("CONNECT-INFO: " + error);
        return reject(error);
      }
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      try {
        this.account = undefined;
        this.chainId = undefined;
        if (this.isVuex) {
          store.dispatch("listening", {
            isc: false,
            account: undefined
          });
        } else {
          this.listening(false, undefined);
        }

        if (this.provider.close) {
          this.provider.close();
        }
        if (this.modal) {
          this.modal.clearCachedProvider();
        }

        return resolve(true);
      } catch (error) {
        console.log("CONNECT-INFO: " + error);
        return reject(error);
      }
    });
  }
}
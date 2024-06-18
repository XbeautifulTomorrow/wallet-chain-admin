import config from "@/config/env";
/**
 * @description: 链配置
 */
export const chainOptions = {
  test: {
    97: {
      name: 'BSC',
      chainId: '97',
      method: 'wallet_addEthereumChain',
      chainParmas: {
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        nativeCurrency: {
          name: 'tBNB',
          symbol: 'tBNB',
          decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
      },
    },
    4: {
      name: 'ETH',
      chainId: '4',
      method: 'wallet_switchEthereumChain',
      chainParmas: {
        chainId: '0x4',
      },
    },
    65: {
      name: 'OKEX',
      chainId: '65',
      method: 'wallet_addEthereumChain',
      chainParmas: {
        chainId: '0x41',
        chainName: 'OKExChain Testnet',
        nativeCurrency: {
          name: 'OKT',
          symbol: 'OKT',
          decimals: 18,
        },
        rpcUrls: ['https://exchaintestrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain-test'],
      },
    },
  },
  main: {
    56: {
      name: 'BSC',
      chainId: '56',
      method: 'wallet_addEthereumChain',
      chainParmas: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
    },
    1: {
      name: 'ETH',
      chainId: '1',
      method: 'wallet_switchEthereumChain',
      chainParmas: {
        chainId: '0x1',
      },
    },
    66: {
      name: 'OKEX',
      chainId: '66',
      method: 'wallet_addEthereumChain',
      chainParmas: {
        chainId: '0x42',
        chainName: 'OKExChain Mainnet',
        nativeCurrency: {
          name: 'OKT',
          symbol: 'OKT',
          decimals: 18,
        },
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain'],
      },
    },
  },
}[config.ENV == "dev" ? "test" : "main"]

/**
 * @description: 链列表
 */
export const chainList = {
  test: { BSC: 97, ETHEREUM: 4, OKC: 65 },
  main: { BSC: 56, ETHEREUM: 1, OKC: 66 },
}[config.ENV == "dev" ? "test" : "main"]



/**
 * @description: 代币地址
 */
export const tokenAddrList = {
  test: {
    BSC: "0xDF074b08910c38D7Cf6550a4A3fF4590080A1c33",
    ETHEREUM: "0x0000000000000000000000000000000000000000",
    OKC: "0xfA5d51aaBAf744cABEa5cF2F85Be25135c88b054"
  },
  main: {
    BSC: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    ETHEREUM: "0x0000000000000000000000000000000000000000",
    OKC: "0xef71ca2ee68f45b9ad6f72fbdb33d707b872315c"
  },
}[config.ENV == "dev" ? "test" : "main"]

/**
 * @description: 合约地址
 */
export const contractList = {
  test: {
    BSC: "0x81be4bfeE7D6c5F1374905B9E4FB37598e52E356",
    ETHEREUM: "0x00ede99e6AaDA1FA874e2c34D0294b8D23e0B869",
    OKC: "0x5B9582Eb1bb1d76079ef3f652c5aF0D5b35BB636"
  },
  main: {
    BSC: "0xEEB7B5e87249F2eA5bF8A08C36539318243Acd4e",
    ETHEREUM: "0x1dC02fAdD520e73eB2Fbb1589E3d4BE357665b81",
    OKC: "0x1dC02fAdD520e73eB2Fbb1589E3d4BE357665b81"
  },
}[config.ENV == "dev" ? "test" : "main"]
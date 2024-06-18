const config = {
  dev: {
    api: "http://222.214.219.202:3301/wallet-chain-admin",
  },
  prod: {
    api: "/wallet-chain-admin",
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
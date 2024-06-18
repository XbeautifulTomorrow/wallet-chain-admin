const Timestamp = new Date().getTime();
module.exports = {
  devServer: {
  },
  configureWebpack: { // webpack 配置
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.时间戳】
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`
    },
  },

}


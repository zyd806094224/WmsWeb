const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint校验
  lintOnSave: false,
  devServer: {
    port: 8086, // 这里就是设置端口号的地方
    // 其他配置
  }
})

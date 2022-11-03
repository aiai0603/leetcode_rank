const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: './',
  devServer: {
    proxy: {
      '/user': {
        target: "http://****************", // 代理地址(接口域名)
        changeOrigin: true,  		  // 是否跨域
      },
      '/graphql': {
        target: "https://leetcode.cn", // 代理地址(接口域名)
        logLevel:'debug',
        changeOrigin: true,  		  // 是否跨域
        
      }
    }
  }

});

// 执行webpack构建的入口
// 拿到webpack.config.js配置
const options = require('./webpack.config.js')
const Webpack = require('./lib/webpack.js')
// 实例化
new Webpack(options).run()
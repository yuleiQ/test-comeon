// webpack，基于nodejs，遵守commonjs规范
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const 
const path = require('path');
module.exports = {
  mode: 'development',
  // 项目打包的相对路径 必须是绝对路径 
  // context: process.cwd(),
  // 执行构建的入口，项目入口
  // 字符串 数组 对象
  entry: './src/index.js',
  // entry: ['./src/index.js', './src/other.js'], 
  // 多入口
  // entry: {
  //   main: './src/index.js',
  //   other: './src/other.js'
  // },
  // 多出口 不可以指定名称 使用占位符
  output: {
    // 存放构建文件资源   绝对路径
    // __dirname是nodejs全局变量
    path: path.resolve(__dirname, './dist'),
    // 生成文件名称
    // filename: 'main.js'
    filename: '[name]-[hash:6].js'
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin()
  ],
  // 处理不认识的模块
  module: {
    rules: [
      {
        test: /\.css$/,
        // loader的执行顺序从后往前
        // css-loader是把css模块的内容加到js模块中，即css in js方式
        // style-loader 从js中提取css的loader, 在html中创建style标签，把css内容放在这个style标签中
        use:  ['style-loader','css-loader']
      }
    ]
  }
}
// webpack，基于nodejs，遵守commonjs规范
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webapck = require('webpack');
// Vue Loader 的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

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
    filename: '[name]-[contenthash:8].js'
  },
  devtool:"cheap-inline-source-map",
  devServer: {    
    contentBase: "./dist",
    // open: true,
    // 开启hmr
    // hot: true,
    port: 8081,
    // 代理
    proxy: {
      '/api': {
        target: 'http://localhost:9092'
      }
    },
    // 几遍hmr没有生效，浏览器也不要自动刷新
    // hotOnly: true,
    // devServer中间件提供的钩子
    before(app, server){
      // 本地mock数据 跟node起的server是一个功能
      app.get('/api/mock.json', (req, res) => {
          res.json({
              hello: 'express'
          })
      })
    }
  },
  externals: {
    'jquery': 'jQuery'
  },
  resolve: {
      modules: [path.resolve(__dirname, './node_modules')],
      alias: {
        '@': path.resolve(__dirname, './src'),
        'vue': path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js') 
      },
      extensions:['.js','.json','.vue']
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ 
      filename: "css/[name]-[contenthash:8].css"
    }),
    new htmlWebpackPlugin({
      // 生成页面得title元素
      title: '首页',
      // 生成的文件名
      filename: 'index.html',
      // 指定模板
      template: './src/index.html'
    }),
    new VueLoaderPlugin()
    // new webpack.HotModuleReplacementPlugin()
  ],
  // 处理不认识的模块
  // loader很消耗性能的！！！！
  module: {
    rules: [
      {
        test: /\.css$/,
        // loader的执行顺序从后往前
        // css-loader是把css模块的内容加到js模块中，即css in js方式
        // style-loader 从js中提取css的loader, 在html中创建style标签，把css内容放在这个style标签中
        use:  ['style-loader','css-loader'],
        include: path.resolve(__dirname, "./src")
      },
      {
        test: /\.less$/,
        // loader的执行顺序从后往前
        // css-loader是把css模块的内容加到js模块中，即css in js方式
        // style-loader 从js中提取css的loader, 在html中创建style标签，把css内容放在这个style标签中
        // use: ["style-loader", "css-loader", "less-loader"]
        include: path.resolve(__dirname, "./src"),
        use: [
          // 'style-loader',  
          // 提取出独立的css文件, 记住它对hmr的支持不好，在使用hmr时不能使用它
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // 开启css 模块化
              modules: true
            }
          }, {
            loader: 'postcss-loader',
          }, 
          "less-loader"
        ]
      },
      {
       test: /\.(png|jpe?g|gif)$/,
       include: path.resolve(__dirname, "./src"),
       use: {
        //  loader: 'file-loader',
        // 推荐使用url-loader,因为支持limit
         loader: 'url-loader',
         options: {
          //  ext占位符
           name: '[name]_[hash:6].[ext]',
           outputPath: 'images/',
           //  小于2048，才转换成base64
           limit: 2048
         }
       }
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: 'url-loader'
      },
      // 首先监测到js模块, 通过babel使webpack跟babel-core做通信,使用@babel/preset-env做转换
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"),
        // 排除
        // exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        include: path.resolve(__dirname, "./src"),
        loader: 'vue-loader'
      }
    ]
  }
}
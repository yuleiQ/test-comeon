// webpack，基于nodejs，遵守commonjs规范

// 删除文件夹目录(默认删除 output 下 path 指定的目录)
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 会在打包结束后，自动生成一个 html 文件，并将打包生成的 js 自动引入到这个 html 文件中
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
// Vue Loader 的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

// 量化
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// dll
// const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

// happypack 解决loader的消耗
const HappyPack = require('happypack')

const config = {
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
    filename: '[name]-[contenthash:8].js',
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
  optimization: {
    usedExports: true, // 哪些导出的模块被使⽤了，再做打包
    // splitChunks: {
    //   chunks: 'all', // 所有的chunks代码公共的部分离出来成为⼀个单独的文件
    //   // minChunks: 2 // 打包生成的chunk文件最少有几个chunk引⽤了这个模块
    //   cacheGroups: {
    //     vue: {
    //       test: /vue/, // 正则规则验证，如果符合就提取 chunk,name:"vue"
    //       name: 'vue'
    //     },
    //     lodash: {
    //       test: /lodash/,
    //       name: 'lodash', // 要缓存的分隔出来的 chunk 名称
    //     }
    //   }
    // },
    concatenateModules: true
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ 
      filename: "css/[name]-[contenthash:8].css"
    }),
    new OptimizeCSSAssetsPlugin({
      // 引入cssnano配置压缩选项 cssnano是postcss的依赖
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {removeAll: true}
      }
    }),
    new htmlWebpackPlugin({
      // 生成页面的title元素
      title: '首页',
      // 生成的文件名
      filename: 'index.html',
      // 指定模板
      template: './src/index.html',
      minify: {        // 压缩HTML文件        
        removeComments: true, // 移除HTML中的注释        
        collapseWhitespace: true, // 删除空白符与换行符        
        minifyCSS: true // 压缩内联css      
      }
    }),
     // 清除无⽤
    new PurifyCSS({
      paths: glob.sync([// 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对html文件tree shaking
        path.resolve(__dirname, './src/*.js')      
      ])    
    }),
    // react借助DllReferencePlugin告诉webpack有那些依赖有对应的dll文件，使用动态链接库
    // 借助dllPlugin生成动态库文件
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname,"./dll/react-manifest.json")    
    }),
    // 动态导入到html中
    // new AddAssetHtmlWebpackPlugin({
    //   filepath: path.resolve(__dirname, './dll/react.dll.js') // 对应的 dll文件路径 
    // }),
    new HardSourceWebpackPlugin(),
    new HappyPack({
      id: 'css',
      loaders: ["style-loader", "css-loader"]
    }),
    new HappyPack({
      id: 'js',
      loaders: ["babel-loader"]
    })
    // new BundleAnalyzerPlugin()
    // new VueLoaderPlugin(),
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
        // use:  ['style-loader','css-loader'],
        use: ["HappyPack/loader?id=css"],
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
          }, 
          {
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
          //  配置打包后文件放置的路径位置  
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
        // loader: 'babel-loader',
        use: {
          loader: 'HappyPack/loader?id=js'
        }
      },
      {
        test: /\.vue$/,
        include: path.resolve(__dirname, "./src"),
        loader: 'vue-loader'
      }
    ]
  }
}

// module.exports = smp.wrap(config)
module.exports = config;
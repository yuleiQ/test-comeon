// 生产配置

const baseConfig = require('./webapck.config.base.js');

const {merge} = require("webpack-merge")
const path = require('path');

const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

const proConfig = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        // publicPath: ''
    },
    optimization: {
      usedExports: true// 哪些导出的模块被使⽤了，再做打包
    },
    plugins: [
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
            // 生成页面得title元素
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
        new PurifyCSS({
          paths: glob.sync([
            path.resolve(__dirname, './src/*.html'),
            path.resolve(__dirname, './src/*.js')      
          ])    
        })
    ],
    module: {
        rules: [
            {
              test: /\.less$/,
              include: path.resolve(__dirname, "./src"),
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
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
               loader: 'url-loader',
               options: {
                //  ext占位符
                 name: '[name]_[hash:6].[ext]',
                 outputPath: 'images/',
                 limit: 2048
               }
             }
            },
            {
              test: /\.(eot|ttf|woff|woff2|svg)$/,
              use: 'url-loader'
            },
            {
              test: /\.js$/,
              include: path.resolve(__dirname, "./src"),
              loader: 'babel-loader'
            }
        ]
    }
}

module.exports = merge(baseConfig, proConfig)
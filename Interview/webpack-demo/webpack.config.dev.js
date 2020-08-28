// 开发配置

const baseConfig = require('./webapck.config.base.js');
const {merge} = require("webpack-merge")


const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require("html-webpack-plugin");


const devConfig = {
    mode: 'development',
    devtool:"cheap-inline-source-map",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    devServer: {    
        contentBase: "./dist",
        open: true,
        // 开启hmr
        hot: true,
        port: 8081,
        proxy: {
          '/api': {
            target: 'http://localhost:9092'
          }
        },
        hotOnly: true,
        before(app, server){
          // 本地mock数据 跟node起的server是一个功能
          app.get('/api/mock.json', (req, res) => {
              res.json({
                  hello: 'express'
              })
          })
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            // 生成页面得title元素
            title: '首页',
            // 生成的文件名
            filename: 'index.html',
            // 指定模板
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
              test: /\.less$/,
              include: path.resolve(__dirname, "./src"),
              use: [
                'style-loader',  
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

module.exports = merge(baseConfig, devConfig)
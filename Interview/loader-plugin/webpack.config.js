const path = require('path')
const CopyRightWebpackPlugin = require('./myplugin/copyright-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js'
    },
    resolveLoader: {
        modules: ['node_modules','./myLoaders']
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     use: [
            //     // 多个loader 从后往前 
            //     //   path.resolve(__dirname, './myLoader2/index.js'), 
            //       'loader',
            //       {
            //         loader: 'loader.async',
            //         // loader: path.resolve(__dirname, './myLoader/index.js'),
            //         options: {
            //             name: 'qqq'
            //         }
            //       }
            //     ]
            // },
            {
                test: /\.less$/,
                use: [
                  'style.loader',
                  'less.loader'
                ]
            }
        ]
    },
    plugins: [
        new CopyRightWebpackPlugin()
    ]
}
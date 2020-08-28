const baseConfig = require('./webapck.config.base.js')
const devConfig = require('./webpack.config.dev.js')
const prodConfig = require('./webpack.config.pro.js')

console.log(process.env.NODE_ENV, 'cross-env环境变量')
const { default: merge } = require('webpack-merge');
module.exports  = (env) => {
    console.log(env, '环境变量')
    if(env && env.production) {
        return merge(baseConfig,prodConfig)
    } else {
        return merge(baseConfig,devConfig)
    }
}
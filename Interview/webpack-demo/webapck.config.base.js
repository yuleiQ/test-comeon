// 公共配置
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  resolve: {
      modules: [path.resolve(__dirname, './node_modules')],
      alias: {
        '@': path.resolve(__dirname, './src'),
        'vue': path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js') 
      },
      extensions:['.js','.json','.vue']
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 返回绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'        // 编译入口
  },
  output: {                     // 配置webpack输出路径和命名规则
    path: config.build.assetsRoot,  // 输出文件夹 路径 /dist
    filename: '[name].js',          // webpack输出bundle文件命名格式
    publicPath: process.env.NODE_ENV === 'production'       // webpack编译输出的发布路径
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {        //配置 resolve 规则
    extensions: ['.js', '.vue', '.json'],       // 自动resolve的扩展名
    // 创建路径别名，有了别名之后引用模块更方便，例如
    // import Vue from 'vue/dist/vue.common.js'可以写成 import Vue from 'vue'
    alias: {                
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {// 配置不同类型模块的处理规则
    rules: [
      {
        test: /\.(js|vue)$/,        // 对src和test文件夹下的.js和.vue文件使用eslint-loader
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,             // 对所有.vue文件使用vue-loader
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,              // 对src和test文件夹下的.js文件使用babel-loader
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,          // 对图片资源文件使用url-loader，query.name指明了输出的命名规则
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,            // 对字体资源文件使用url-loader，query.name指明了输出的命名规则
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

require('./check-versions')()       // 检查版本 nodejs, npm

process.env.NODE_ENV = 'production'

var ora = require('ora')        // 命令行环境的 loading效果
var rm = require('rimraf')      // The UNIX command rm -rf for node. unix 系统的 rm-rf
var path = require('path')
var chalk = require('chalk')    // 命令行彩色输出
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start() // 开启loading动画

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {        // 删除 旧的目录，
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {    // webpack编译
    spinner.stop()  // 停止loading动画
    if (err) throw err
    process.stdout.write(stats.toString({       // 没有出错则输出相关信息
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})

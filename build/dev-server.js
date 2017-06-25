// 注释参考文档 http://blog.csdn.net/hongchh/article/details/55113751

require('./check-versions')()           // 检查版本

var config = require('../config')       // 引入配置文件 /config/*.js
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')                // 用来打开当前系统 安装的 应用程序，比如npm run dev打开默认浏览器访问入口
var path = require('path')              // 路径转换
var express = require('express')        // express 框架    
var webpack = require('webpack')        // webpack 模块打包
var proxyMiddleware = require('http-proxy-middleware')      // 代理中间件
var webpackConfig = process.env.NODE_ENV === 'testing'      // 引入 webpack.dev 配置
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port      // 端口 8080
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser  // 是否自动打开浏览器
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable              // 定义 HTTP 代理表，代理到 API 服务器

var app = express()                                 // 创建一个 express 实例 
var compiler = webpack(webpackConfig)               // 根据webpack配置文件创建Compiler对象

// webpack-dev-middleware使用compiler对象来对相应的文件进行编译和绑定
// 编译绑定后将得到的产物存放在内存中而没有写进磁盘
// 将这个中间件交给express使用之后即可访问这些编译后的产品文件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// webpack-hot-middleware，用于实现热重载功能的中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

// force page reload when html-webpack-plugin template changes
// // 当html-webpack-plugin提交之后通过热重载中间件发布重载动作使得页面重载
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests   代理 api 请求
// 将 proxyTable 中的代理请求配置挂在到express服务器上
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {  // 格式化options，例如将'www.example.com'变成{ target: 'www.example.com' }
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 重定向不存在的URL，常用于SPA
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 使用webpack开发中间件
// 即将webpack编译后输出到内存中的文件资源挂到express服务器上
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将热重载中间件挂在到express服务器上
app.use(hotMiddleware)

// serve pure static assets
// 静态资源的路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 将静态资源挂到express服务器上
app.use(staticPath, express.static('./static'))

// 应用的地址信息，例如：http://localhost:8080
var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
// webpack开发中间件合法（valid）之后输出提示语到控制台，表明服务器已启动
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') { // 如果符合自动打开浏览器的条件，则通过opn插件调用系统默认浏览器打开对应的地址uri
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)// 启动express服务器并监听相应的端口（8080）

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}

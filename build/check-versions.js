var chalk = require('chalk')        // 打印出来红色 hello world  console.log(chalk.red("hello world"));
var semver = require('semver')      // 应用版本号 发布规则，主版本号.次版本号.修订号
var packageConfig = require('../package.json')      // 引入 package.json
var shell = require('shelljs')          // node中提供unix shell命令支持
function exec (cmd) {                   // 调用子进程执行 命令 并返回结果
  return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [         // 定义，版本需求
  {
    name: 'node',
    currentVersion: semver.clean(process.version),      // process模块用来与当前进程互动，不需要 require
    versionRequirement: packageConfig.engines.node
  },
]

if (shell.which('npm')) {
  versionRequirements.push({        // 在versionRequirements 数组追加 新的 元素，node 版本数组，npm 版本数组
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {      // 导出 本函数 require 调用执行此方法，判断版本是否符合要求
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {    // 依次判断版本是否符合要求
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {    // 比较版本
      warnings.push(mod.name + ': ' +                   // 保存错误信息
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {        // 如果有警告则将其输出到控制台
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)         // 退出进程
  }
}

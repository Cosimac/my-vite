/*
 * @Date: 2021-09-04 19:43:39
 * @LastEditors: Cosima
 * @LastEditTime: 2021-09-05 03:57:14
 * @FilePath: /my-vite/kvite/kvite.js
 */

const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const compilerSFC = require('@vue/compiler-sfc')
const compilerDOM = require('@vue/compiler-dom')

const app = new Koa()

app.use(async ctx => {
  const { url, query } = ctx.request
  if (url === '/') {
    ctx.type = 'text/html'
    ctx.body = fs.readFileSync(path.join(__dirname, './index.html'), 'utf8')
  } else if (url.endsWith('.js')) {
    const p = path.join(__dirname, url)
    // console.log(p, url, __dirname, 'p----');
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(fs.readFileSync(p, 'utf8'))
  } else if (url.startsWith('/@modules/')) {
    // 模块名称
    const moduleName = url.replace('/@modules/', '')
    // 模块绝对路径
    const prefix = path.join(__dirname, '../node_modules', moduleName)
    const module = require(prefix + '/package.json').module
    const filePath = path.join(prefix, module)
    const ret = fs.readFileSync(filePath, 'utf8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(ret)
  } else if (url.indexOf('.vue') > -1) {
    const p = path.join(__dirname, url.split('?')[0])
    const ret = compilerSFC.parse(fs.readFileSync(p, 'utf8'))
    if (!query.type) {
      // sfc 请求
      // 读取vue文件 解析为js
      // 获取脚本内容
      const scriptContent = ret.descriptor.script.content
      // 替换默认熬出常量方便修改
      const script = scriptContent.replace('export default ', 'const __script = ')
      ctx.type = 'application/javascript'
      ctx.body = `
        ${rewriteImport(script)}
        // 解析tpl
        import {render as __render} from '${url}?type=template'
        __script.render = __render
        export default __script
      `
    } else if (query.type === 'template') {
      const tpl = ret.descriptor.template.content
      const render = compilerDOM.compile(tpl, { mode: 'module' }).code
      console.log(render, 'render----')
      ctx.type = 'application/javascript'
      ctx.body = rewriteImport(render)
    }
  }
})

// 裸模块引入地址替换
function rewriteImport(content) {
  // 匹配 import xxx from 'vue'
  return content.replace(/ from ['"](.*)['"]/g, function (s1, s2) {
    if (s2.startsWith('/') || s2.startsWith('./' || s2.startsWith('../'))) {
      return s1
    } else {
      return ` from '/@modules/${s2}'`
    }
  })
}

app.listen(3000, () => {
  console.log('start------')
})
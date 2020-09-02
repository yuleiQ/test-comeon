// 分析入口和出口,有什么内容和依赖

const fs = require('fs');
// 引入babel/parser来进行AST转换
const parser = require('@babel/parser')
// 引入babel/traverse的默认导出 对AST进行过滤解析
const tarverse = require('@babel/traverse').default;
// 引入@babel/core中的transformFromAst API 把AST做转换
const { transformFromAst }  = require('@babel/core')

// 引入Path模块，对import的路径进行拼接 即把./hello.js拼接成./src/hello.js
const path = require('path')

module.exports = class Webpack {
    constructor(options) {
        // 拿到了webpack.config.js配置
        // console.log(options);
        const { entry, output } = options
        this.entry = entry;
        this.output = output;
        // 模块数组缓存
        this.modules = [];
    };
    // 启动函数
    run() {
       const info =  this.parse(this.entry)
        // 递归分析其他的模块，如hello.js有木有import的依赖
        // console.log(info)
       this.modules.push(info);

       for(let i = 0; i < this.modules.length; i++) {
            // 拿到info的信息
            const item = this.modules[i];
            // 拿到依赖
            const { dependencies } = item;
            if (dependencies) {
                for (const key in dependencies) {
                    this.modules.push(this.parse(dependencies[key]))
                }
            }
       }
       // console.log(this.modules)
       // 数组转换成对象的结构
       const obj = {};
       this.modules.forEach(item => {
        // 就是entryFile将作为key dependencied和code作为value
        obj[item.entryFile] = {
          dependencies: item.dependencies,
          code: item.code
        }
      })
    //   console.log(obj)
      this.file(obj)
    }
    // 分析函数
    parse(entryFile) {
        // console.log(entryFile) // 拿到入口路径
        // 开始分析src/index.js模块
        // 分析模块内容，可以借助fs,得到模块内容
        const content = fs.readFileSync(entryFile, 'utf-8');
        // console.log(content)
        // 分析内容
        const AST = parser.parse(content, {
            // ESModule形式导入的模块
            sourceType: 'module'
        })
        // console.log(AST, AST.program.body)
        // dependencies对象，可以保留相对路径和根路径
        const dependencies = {}
        tarverse(AST, {
            ImportDeclaration({node}) {
                // console.log(node);
                const dirname = path.dirname(entryFile);
                // console.log(dirname);
                // 新路径
                const newPathName = "./" + path.join(dirname, node.source.value)
                // console.log(newPathName);
                dependencies[node.source.value] = newPathName;
                // console.log(dependencies)

            }
        })

        // 将AST转换回代码
        const {code} = transformFromAst(AST, null, {
            presets: ['@babel/preset-env']
        })
        // console.log(code)

        return {
            entryFile,
            dependencies,
            code
        }
    }
    // 创建自运行函数，处理require module exports 根据配置信息生成相应文件夹和文件
    file(obj) {
        // 获取输出信息  拼接出输出的绝对路径
        const filePath = path.join(this.output.path, this.output.filename)
        // console.log(filePath);
        let newObj = JSON.stringify(obj)
        // 类似于打包后的自执行函数的函数
        // 处理require('./hello.js') exports
        const bundle = `(function(graph) {
            function require(module) {

                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath]);
                };

                var exports = {};
                (function(require, exports, code) {
                    eval(code);
                })(localRequire, exports, graph[module].code);
                return exports;
            };
            require('${this.entry}');
        })(${newObj})`

        
        // 创建dist目录
        let path1 = this.output.path
        fs.exists(this.output.path, function (exists) {
            if (exists) {
                // 如果有相应文件夹，直接写入文件
                // 在对应路径下创建文件 bundle为文件内容
                fs.writeFileSync(filePath, bundle, 'utf-8')
                return
            } else {
                // 如果没有相应文件夹，创建文件夹
                fs.mkdir(path1, (err) => {
                    if (err) {
                        console.log(err)
                        return false
                    }
                })
                // 借助fs，把bundle写到文件中去
                fs.writeFileSync(filePath, bundle, 'utf-8')
            }
        })
    }
}
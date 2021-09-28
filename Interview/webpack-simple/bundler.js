const fs = require('fs'); // 文件处理模块
const path = require('path');
const parser = require('@babel/parser'); // 用于AST转化
const tarverse = require('@babel/traverse').default; // 引入babel/traverse的默认导出 对AST进行过滤解析
const babel = require('@babel/core')

// 分析入口文件
const moduleAnalyser = (entryFile) => { // entryFile 入口文件路径
    // fs模块根据路径读取到了module的内容
    const content = fs.readFileSync(entryFile, 'utf-8');
    console.log(content);
    
    // 分析内容
    const AST = parser.parse(content, {
        // ESModule形式导入的模块
        sourceType: 'module'
    });
    // 使用@babel/traverse遍历了AST ，对每个ImportDeclaration节点做映射，把依赖关系拼装在 dependencies对象里
    const dependencies = {};
    tarverse(AST, {
        ImportDeclaration({node}) {
            console.log(node, 'node');
            const dirname = path.dirname(entryFile);
            // 新路径
            const newPathName = "./" + path.join(dirname, node.source.value)
            dependencies[node.source.value] = newPathName;
        }
    })
    
    // 使用@babel/core结合@babel/preset-env预设，将AST转换成了浏览器可以执行的代码
    const { code } = babel.transformFromAst(AST, null, { 
        presets: ["@babel/preset-env"] 
    }) 
    return {
        entryFile,
        dependencies,
        code
    }
}


const makeDependenciesGraph = (entryFile) => {
  const entryModule = moduleAnalyser(entryFile);
  const graphArray = [entryModule];
  for(let i = 0; i < graphArray.length; i++) {
      const item = graphArray[i];
      const { dependencies } = item;
      if (dependencies) {
          for(let j in dependencies) {
              graphArray.push(moduleAnalyser(dependencies[j]));
          }
      }
  }
  console.log(graphArray, 'graphArray');
  const graph = {}; 
  graphArray.forEach(item => { 
      graph[item.entryFile] = { 
          dependencies: item.dependencies, 
          code: item.code 
      } 
 }) 
 return graph;
};


const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  // 浏览器可执行的代码里有require方法，有exports对象，bundler.js打包后的代码需要提供一个require方法和exports对象。
  // localRequire 传入依赖相对于module的相对路径，根据graph对象，返回依赖相对于bundler.js的相对路径
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
        require('${entry}');
    })(${graph})`
    return bundle;
}

const code = generateCode('./src/index.js');
console.log(code)
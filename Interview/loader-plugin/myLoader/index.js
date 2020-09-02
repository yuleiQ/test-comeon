module.exports = function(source, map,  ast) {
    // loader 处理模块，拿到模块的内容做转化
    // 多个loader有顺序
    // 一定要有返回值
    // console.log(this.query);
    // const result = source.replace('hello', this.query.name);
    // console.log(result);
    // return result

    // loader存在异步如何处理,借助this.async

    const callback = this.async()
    setTimeout(()=> {
        const result = source.replace('hello', this.query.name);
        // return result;
        callback(null, result)
    }, 3000)

    // 多个loader怎么处理，新建myLoader2/index.js
    
    
    // this.callback可接收多个参数，返回多条信息
    // this.callback('', result);
    
}
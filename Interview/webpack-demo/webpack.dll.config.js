// 构建生成动态链接库文件
const path = require("path");
const { DllPlugin } = require("webpack");
module.exports= {
    mode: "production",
    entry: {
        react: ["react", "react-dom"] //! node_modules?  
    },
    output: {
        path: path.resolve(__dirname, "./dll"),
        // name是占位符，对应的是entry的key
        filename: "[name].dll.js",
        library: "reactQ"  
    },
    plugins: [
        // manifest.json文件的输出位置
        new DllPlugin({
            // 定义打包的公共vendor文件对外暴露的函数名
            path: path.join(__dirname, "./dll", "[name]-manifest.json"),
            name: "reactQ"    // 与library名称一致 
        })
    ]
};
// import "@babel/polyfill";
// console.log('webpack');

// css处理
// import './css/index.css'
// import './css/index.less'

console.log('test')
// 这是cdn暴露的全局变量，直接使用即可
// console.log($)

// jquery引入,排除打包
// import jquery from 'jquery'

// 图片文件资源处理
// import pic  from './images/dingkun.gif';
// var img = new Image()
// img.src = pic;
// img.classList.add('logo')
// var root = document.getElementById('root')
// root.append(img)

// 单单如此调用会出现跨域的问题，可以使用webpack proxy进行代理
// import axios from 'axios'
// axios.get('/api/info').then(res => {
//     console.log(res)
// })

//  css模块hmr案例   隔行变色
// var btn = document.createElement("button");
// btn.innerHTML = "新增";
// document.body.appendChild(btn);
// btn.onclick = function() {
//     var div = document.createElement("div");
//     div.innerHTML = "item";
//     document.body.appendChild(div);
// }

// // js模块hmr案例
// import counter from "./logic/counter";
// import number from"./logic/number";
// counter();
// number();

// // hmr模块的监测（原生）
// if (module.hot) {
//     // 监测哪些模块实现原生js的hmr
//     module.hot.accept("./logic/number", function() {
//         // 手动移除
//         document.body.removeChild(document.getElementById("number"));
//         // 再插入
//         number();  
//     });
// }

// vue的解决方案
// Vue Loader：此 loader 支持用于 vue 组件的 HMR

// // polyfill
// const arr= [new Promise(() => {
   
// }), new Promise(()=> {
    
// })];
// arr.map(item=> {
//     console.log(item);
// });

// // react
// // npm install react react-dom --save
// // npm install --save-dev @babel/preset-react
// import React, { Component } from "react";
// import ReactDom from "react-dom";
// class App extends Component {
//     render() {
//         return <div> hello world </div>;  
//     }
// }
// ReactDom.render(<App/>, document.getElementById("app"));

// vue

// import Vue from 'vue'
// const app = new Vue({
//     el: '#app',
//     render(h){return h('div','render')}
// });

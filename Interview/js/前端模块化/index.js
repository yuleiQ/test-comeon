// commonJS
var common = require('./common')
var sum = common.add(1,2)
console.log(common.num, 'num', sum, 'add', '----------------common')

// cmd
// 引用模块，将模块放在[]内
require(['require'],function( math){
  var sum = math.add(10,20);
  console.log(sum, '------------cmd')
});


// ES6 Module
// import { num, add } from './math';
import math from './math';
function test() {
  // var num = add(99 + num);
  var num = math.add(99 + math.basicNum);
  console.log(num, '---------------es6 Module')
}
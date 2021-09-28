// define定义模块,如果有依赖则放在[]中作为define的第一个参数
define(function() {
  var num = 0;
  var add = function(x,y) {
    return x+y;
  }
  return {
    num,
    add
  }
});
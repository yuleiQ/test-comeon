## 作用域和作用域链
作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突
1. 全局作用域和函数作用域
全局作用域：
```
最外层函数和在最外层函数外面定义的变量;
所有末定义直接赋值的变量自动声明为拥有全局作用域;
所有window对象的属性拥有全局作用域;
```
函数作用域:是指声明在函数内部的变量
2. 块级作用域(es6新加)
```
声明变量不会提升到代码块顶部；
禁止重复声明；

```
3. 作用域链定义：查找变量的一个过程，首先会在当前作用域内查找，如果没有找到就会向上层层查找，这个查找的过程就叫做作用域链
4. 自由变量：是指在函数中使用的，但既不是函数arguments参数也不是函数局部变量的变量
   关于自由变量取值:要到`创建`这个函数的域中取值，而不是调用
```
var x = 10
function fn() {
  console.log(x)
}
function show(f) {
  var x = 20
  (function() {
    f() 
  })()
}
show(fn)

结果是：10，切记切记！！！
```
## [执行上下文](https://www.cnblogs.com/echolun/p/11438363.html)
作用域和执行上下文之间最大的区别是： 执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变。

## 声明提升
变量会被提升，赋值不会
函数声明的提升高于变量提升

## [this指向](https://www.cnblogs.com/echolun/p/11962610.html)

优先级：
显式绑定 > 隐式绑定 > 默认绑定
new绑定 > 隐式绑定 > 默认绑定

1. 隐式调用
如果函数调用时，前面存在调用它的对象，那么this就会隐式的绑定在这个对象上
```
function fn() {
    console.log(this.name);
};
let obj = {
    name: '行星飞行',
    func: fn,
};
let obj1 = {
    name: '听风是风',
    o: obj
};
obj1.o.func() //行星飞行
```
如果函数调用前存在多个对象，this指向距离调用自己最近的对象
```
function fn() {
    console.log(this.name);
};
let obj = {
    name: '行星飞行',
    func: fn,
};
let obj1 = {
    name: '听风是风',
    o: obj
};
obj1.o.func() //行星飞行
```
隐式丢失：实际上就是函数调用时，并没有上下文对象，只是对函数的引用;最常见的是作为参数传递以及变量赋值


2. 显式绑定：call apply bind
3. new绑定：使用构造调用的时候，this会自动绑定在new期间创建的对象上。

   相比普通对象，new操作符的对象保存了构造函数上下文中的this指向，导致箭头函数并不会指向window。

4. 箭头函数的this
- 取决于外层作用域中的this，外层作用域或函数的this指向谁，箭头函数中的this便指向谁。
- 一旦箭头函数的this绑定成功，也无法被再次修改，有点硬绑定的意思

```
function fn() {
    return () => {
        console.log(this.name);
    };
}
let obj1 = {
    name: '听风是风'
};
let obj2 = {
    name: '时间跳跃'
};
let bar = fn.call(obj1); // fn this指向obj1
bar.call(obj2); //听风是风
```

## 闭包
通俗的说：A函数嵌套B函数，B函数使用了A函数的内部变量，且A函数返回B函数，这就是闭包
闭包的使用场景：ajax请求的成功回调，事件绑定的回调方法，setTimeout的延时回调
闭包注意：
1. 闭包的性能与内存占用
闭包是自带执行环境的函数，相比普通函数，闭包对内存的占用比普通函数大，毕竟外层函数的自由变量无法释放。
```
function bindEvent(){
    let ele = document.querySelector('.ele');
    ele.onclick = function () {
        console.log(ele.style.color);
    };
};
bindEvent(); // 点击事件中使用到了外层函数中的DOM ele，导致 ele 始终无法释放

修改后： 单独复制一份color属性，在外层函数执行完毕后手动释放ele

function bindEvent() {
    let ele = document.querySelector('.ele');
    let color = ele.style.color;
    ele.onclick = function () {
        console.log(color);
    };
    ele = null;
};
bindEvent();
2. setTimeout使用
3. let
```

## new的时候会做哪些事情？
```
构造器函数
let Parent = function (name, age) {
    this.name = name;
    this.age = age;
};
Parent.prototype.sayName = function () {
    console.log(this.name);
};
let newMethod = function(Parent, ...rest) {
    // 1. 以构造器的prototype属性为原型，创建新对象
    let child = Object.create(Parent.prototype);
    // 2. 将this(即新对象)和调用参数传给构造器执行
    let result = Parent.apply(child, rest);
    // 3. 如果构造器没有手动返回对象，则返回第一步创建的新对象，如果有，则舍弃掉第一步创建的新对象，返回手动return的对象。
    return typeof result === 'object' ? result : child;
}
// 创建实例，将构造函数Parent与形参作为参数传入
const child = newMethod(Parent, 'echo', 26);
child.sayName() //'echo';
```


## call apply bind



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
对应html文件

### 原型
1. 构造函数其实就是个普通函数，且函数都支持new调用和普通调用,es6有了class类的概念就不一样了，Class只支持new调用，如果直接调用会报错
2. 构造函数用来干啥？最基本的就是属性继承

基本和引用数据类型
```
基本数据类型：Number，String，Boolean，Undefined，Null，Symbol。
引用数据类型：Object，Function，Date，Array，RegExp等。
```

js中万事万物皆对象
举例String类型：
```
'qqq'.__proto__; // 打印得出方法还有__proto__属性
```

如何为字符串添加属性呢？
> 字符串同样也可以通过new创建 `console.log(new String('111'))`

包装对象？
> String、Number、Boolen属于包装对象，包装对象是一种声明周期只有一瞬的对象，创建与销毁都由底层实现。


3. 实例的__proto__指向的是创建自己的构造函数的prototype，prototype是一个对象
```
function Parent() {};
var son = new Parent();
son.__proto__ === Parent.prototype;//true
```
`注意：`所有的对象都有__proto__属性，只有函数才有prototype属性

原始构造函数Function()扮演着创世主女娲的角色，她创造了Object()、Number()、String()、Date()、function fn(){}等第一批人类（也就是构造函数），而人类同样具备了繁衍的能力（使用new操作符），于是Number()繁衍出了数据类型数据，String()诞生了字符串，function fn(){}作为构造函数也诞生了各种各样的对象后代。

### 原型链
当实例访问某个属性的时候，会先查找自己有没有，如果没有就通过`__proto__(访问器属性)`访问自己的构造函数的`prototype(原型对象)`,如果原型对象也没有，就继续顺着构造函数的prototype的__proto__继续查找到构造函数Object的原型，在看有没有，没有则返回undefined,再往上就是null


### constructor
4. 在不修改构造函数prototype前提下，所有实例__proto__属性中的constructor属性都指向创建自己的构造函数。

5. 原型链和作用域链有何区别？
```
所谓作用域链是在当前作用域查找某个变量时，如果没有就追溯到上层作用域，如果还没有则一直找到全局作用域，这个过程就是作用域链。区别就是，原型链顶端是null，作用域顶端是全局对象，原型链没找到某个属性返回undefined，而作用域链没找到会直接报错，告诉你未声明。
```
6. 判断对象是否有某条属性
```
var obj = {
    name: undefined
};
console.log('name' in obj);//true
console.log('age' in obj);//false
```
7. 怎么判断某条属性是否为对象自身属性而非原型属性？
```
function Fn() {
    this.name = 'lei';
};
Fn.prototype.age = 26;
var obj = new Fn();
console.log('name' in obj);//true
console.log('age' in obj);//true
console.log(obj.hasOwnProperty('name'));//true
console.log(obj.hasOwnProperty('age'));//false
```
### [继承](https://github.com/mqyqingfeng/Blog)
1. 原型链继承
缺点：不能传参 引用类型被实例共享
```
Child.prototype = new Parent()
```
2. 借用构造函数继承
```
Parent.call(this, xxx)
```
优点：可传参，引用类型不被实例共享
缺点：方法在构造函数内，每此创建实例都要去创造方法

3. 组合继承
融合以上继承，优点同上
缺点： 会调用两次父构造函数

4. 原型式继承
缺点同原型链继承应用类型被共享

5. 寄生式继承
```
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```
缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。
6. 寄生组合继承
```
Child.prototype = Object.create(Parent.prototype);
```
### 深浅拷贝

### 节流 防抖
本质都是以闭包的形式存在

防抖原理：
> 在事件被触发的n秒后再执行回调，如果在这n秒内又被触发，则重新计时
防抖的应用场景：
> 输入框的输入进行ajax校验时;给按钮加防抖防止表单的多次提交

```
function debounce(func, wait) {
    var timeout;
    var args = arguments;

    return function(timeout) {
        var context = this;
        clearTimeout(timeout);
        // 重新设置一个新的延时器
        timeout = setTimeout(function() {
            func.apply(context, args)
        }, wait);
    }
}
```

节流原理：如果你持续触发事件，每隔一段时间，只执行一次事件。
节流的应用场景：
> 滚动加载，加载更多或滚到底部监听
```
function throttle(fn, delay) {
    // 记录上一次函数出发的时间
    var lastTime = 0;
    return function() {
        // 记录当前函数触发的时间
        var nowTime = new Date().getTime()
        // 当当前时间减去上一次执行时间大于这个指定间隔时间才让他触发这个函数
        if(nowTime - lastTime > delay){
            // 绑定this指向
            fn.call(this)
            //同步时间
            lastTime = nowTime
       }
    }
};
```
### ES6
1. let const

不会被声明提升
重复声明报错
不绑定全局作用域
临时死区

循环中的块级作用域
for循环
```
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0]() // 0

// for()小括号内建立一个隐藏的作用域，每次迭代循环时都创建一个新变量，并以之前的迭代中同名变量的值将其初始化
// 如果let换成const 就会报错，原因：虽然每次都会创建一个新的变量，但是我们却在迭代中修改const的值
```

2. 模板字符串
3. 箭头函数与普通函数的区别：
- 箭头函数没有this,故需要通过查找作用域链来确定this的值，this 绑定的就是最近一层非箭头函数的 this。
- 没有arguments，但是箭头函数可以访问外围函数的arguments对象
```
function constant() {
    return () => arguments[0]
}

var result = constant(1);
console.log(result()); // 1
```
let nums = (...nums) => nums
- 不能通过 new 关键字调用
- 没有原型

4. 迭代器和for of

迭代器就是一个拥有next()方法的对象，每次调用next()都会返回一个结果对象，该结果对象有两个属性，value表示当前的值，done表示遍历是否结束
```
function createIterator(items) {
    var i = 0
    return {
        next: function() {
            var done = i >= item.length;
            var value = !done ? item[i++] : undefined;
            return {
                done: done,
                value: value
            }
        }
    }
}
var iterator = createIterator([1, 2, 3]);
console.log(iterator.next());
```

如果我们用for of遍历以上的iterator将提示iterator是不可遍历的对象

for of用来遍历实现迭代器接口的数据，如数组对象、类数组对象、Set、Map


5. 


### 跨域

### HTTP

#### HTTP状态码
2xx 响应的结果标明请求被正常的处理了
200 表示从客户端发来的请求在服务器端被正常处理了
204 no content 表示服务器接受的请求已经成功处理，但是在返回的响应报文中不含实体的主体部分，比如：当浏览器发出请求处理后，返回204,那么浏览器显示的页面不会发生任何更新
206 Partial Content 表示客户端进行了范围请求，而服务器成功执行了这部分的GET请求

3XX(Redirection 重定向状态码)

301 Moved permanently永久性重定向 
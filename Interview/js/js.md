### 作用域和作用域链
作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突
1. 全局作用域和函数作用域
全局作用域：
```
最外层函数和在最外层函数外面定义的变量;
所有末定义直接赋值的变量自动声明,拥有全局作用域;
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
   **关于自由变量取值:要到`创建`这个函数的域中取值，而不是调用**
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
### [执行上下文](https://www.cnblogs.com/echolun/p/11438363.html)
作用域和执行上下文之间最大的区别是： 执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变。
### 声明提升
变量会被提升，赋值不会
函数声明的提升高于变量提升
### [this指向](https://www.cnblogs.com/echolun/p/11962610.html)

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
### 闭包和垃圾回收机制
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
2. setTimeout使用 setTimeout(() => {})
3. let

```
### 内存泄露

什么是内存泄露？系统进程不再用到的进行没有被释放

垃圾回收机制：
如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收；如果两个对象互相引用，且不再被第三者引用，那么这两个互相引用的对象也会被回收
对于闭包来说 函数a被函数b引用，b又被a函数外的c变量引用，这就是a函数执行后不会被回收

现在各浏览器垃圾回收机制的方法：标记清除（目前经常用的），引用计数
标记清除：当变量进入环境会被标记“进入环境”，离开环境时被标记为“离开环境”，浏览器定时回收‘离开环境’的变量

造成内存泄露的主要原因：
1. 引用未声明的变量，会在全局对象中创建一个新变量
2. 闭包：闭包可以读取函数内部的变量，然后让这些变量始终保存在内存中。如果在使用结束后没有将局部变量清除，就可能导致内存泄露。闭包本身没错，因为使用不当造成内存泄露
3. 虽然别的地方删除了，但是对象中还存在对 dom 的引用。
```
// 在对象中引用DOM
var elements = {
  btn: document.getElementById('btn'),
}
function doSomeThing() {
  elements.btn.click()
}

function removeBtn() {
  // 将body中的btn移除, 也就是移除 DOM树中的btn
  document.body.removeChild(document.getElementById('button'))
  // 但是此时全局变量elements还是保留了对btn的引用, btn还是存在于内存中,不能被GC回收
}
```
4. 被遗忘的定时器或者回调: 定时器中有 dom 的引用，即使 dom 删除了，但是定时器还在，所以内存中还是有这个 dom

5. 监听事件没有解绑: window.addEventListener 之类的时间监听，绑在 EventBus 的事件.
### 前端模块化：CommonJS,AMD,CMD,ES6

commonJS(同步的方式加载模块)

`module exports require global` 实际使用时，`module.exports`定义模块对外输出的接口，用`require`加载模块,例子见`common.js`

AMD和require.js(异步的方式加载模块)

用`require.config()`指定引用路径等，用`define()`定义模块

CMD和sea.js(异步的方式加载模块)


ES6Module 

`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。
### new的时候会做哪些事情？
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

### call apply bind
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
对应html

### 事件循环!!!!

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
        // 如果存在定时器 清除定时器
        if(timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
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
    // 记录上一次函数发出的时间
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
### 数组的方法，关注改变原数组的方法和不改变原数组的方法
改变原数组
pop 移除数组的最后一项，返回最后一项，改变原数组
shift 移除数组的第一项，返回移除的项，改变原数组
push 数组后添加一个元素，返回数组新长度，改变原数组
unshift 数组的第一项前面添加一元素，返回数组的长度
splice 数组中添加或者删除项目，返回被删除的项目。改变原数组！！！！！！
reverse 颠倒数组，返回颠倒后的数组，改变原数组
sort 数组排序，返回排序后的数组，改变原数组

不改变原数组
concat 连接两个数组，返回新数组 a.concat(b)
join 数组变字符串 返回改变后的字符串 
slice 截取指定的数组(start,end)注意不包含end，返回截取后的元素，不改变原数组

### forEach和map的区别

### reduce
array.reduce(function(accumulator, currentValue, currentIndex, array), initialValue)

reduce第一个值是累加器
      第二个值是当前value值
      第三个是跟随第二个值的索引值
      第四个是当前正在被循环的数组。

      initialValue是初始值

注意点：如果initalValue有值，循环从索引0开始，此时accumulator就是initialValue，currentValue值就是arr[0]；如果reduce未提供初始值，则arr[0]作为初始值赋予给accumulator，循环从索引1开始，currentValue值就是arr[1]了；


### for of和for in区别
for...in 主要用于遍历对象

for...in可以遍历到原型方法和属性,如果不想遍历到,可以用`hasOwnProperty`判断某属性是都是该对象的实例属性

for in遍历数组的缺点:
- index索引为字符串型数字,不能直接进行几何计算
- 会遍历数组上所有可枚举的属性,包括原型
- 遍历顺序可能不是按照实际数组的内部顺序

for...of 主要用于遍历数组,不能遍历对象(没有迭代器),


### 浏览器渲染过程

1. HTML通过HTML Parser解析为Dom树
2. Style样式通过CSS Parser解析为CSSOM
3. 将DOM与CSSOM整合形成RenderTree（rendertree时浏览器是不知道div这种标签该放在什么位置的，根据生成的渲染树，进行回流(Layout)，得到节点的几何信息（位置，大小））
4. 根据RenderTree开始渲染展示
5. 注意遇到script会阻塞渲染

### [回流重绘](https://juejin.cn/post/6844903779700047885#heading-7)

回流：当RenderTree中部分或全部，因元素的布局，尺寸、隐藏等改变需要重新构建，浏览器重新渲染的过程
1. 页面首次渲染
2. 浏览器窗口大小改变
3. 元素尺寸或者位置变化
4. 元素字体大小变化
5. 添加或者删除可见的dom元素


重绘:当元素样式改变并不影响布局的时候，浏览器会将新样式赋予给元素并重新绘制它

如何避免？

针对css: 
1. 直接改变className，把要修改的样式集中到class内统一修改
2. 避免使用table
3. 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局）

针对js
1. 尽量将需要改变DOM的样式操作一次完成
2. 尽量避免频繁操作DOM


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


5. class
```
class Point {

}
// class默认带constructor方法

```
```
// 如果要给class类原型添加方法，es5直接往原型上添加并不会生效，但是我们也可以通过assign实现
class Point {
    constructor() {};
};

Object.assign(Point.prototype, {
    toString() {},
    toValue() {}
});
```
class创建实例必须使用new

class类内部定义的方法无法枚举

6. Set
```
数组去重
[...new Set([1,2,3,1,1,5])]
Array.from(new Set([1,2,3,1,1,5]))
并集
new Set([...a, ...b]);
交集
new Set([...a].filter(x => b.has(x)))
差集
new Set([...a].filter(x => !b.has(x)))
```
set实例的增删改查方法
```
add
let s = new Set();
s.add(1).add(2);

has 查找set结构是否包含某值，返回布尔
s.has(1)

delete 删除某个值 返回一个布尔值
s.delete(1)

clear 清除整个set
s.clear()

set的遍历方法

keys方法：遍历元素的键名
values方法：遍历元素的键值
entries方法：遍历元素的键值对
forEach方法：用的贼多，回调函数遍历每个元素
```

7. Map

8. Reflect 


### 异步编程串行的解决方案
4种---nodejs async/serial文件

### async defer
script什么都不加的条件下：html先解析，script脚本下载并立即执行指定脚本，脚本执行不成功，dom加载就给我等着

async html解析， 遇见script脚本，因为脚本下载是异步行为，script脚本下载过程会并行html解析，但一旦脚本下载完毕就会立即同步执行脚本，dom加载还是等着

defer  html先解析，遇到script标签 浏览器继续解析，并且并行下载script脚本，脚本下载完成不会立即执行，等解析完dom，在执行脚本


### HTTP

/**
 *  request headers

    PUT /v3/application/definitions/version/content/update HTTP/1.1  ------ 方法 + 路径 + http版本
    Host: 10.136.104.83:31172
    Connection: keep-alive
    Content-Length: 4041  -----包体长度
    Pragma: no-cache
    Cache-Control: no-cache
    Accept: application/json, text/plain,  -----对于接收端，报文body部分的数据类型
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36
    Content-Type: application/json;charset=UTF-8
    Origin: http://dev.moebius.gridsum.com
    Referer: http://dev.moebius.gridsum.com/
    Accept-Encoding: gzip, deflate ------压缩方式：gzip/defalte/br
    Accept-Language: en,en-US;q=0.9,zh-CN;q=0.8,zh;q=0.7 --------支持语言
 **/ 

/**
  * response headers

    HTTP/1.1 200 OK  ----------- http版本+状态码+原因
    Access-Control-Allow-Origin: * -----可以允许请求的源，可以填具体的源名，也可以填*表示允许任意源请求。
    Access-Control-Expose-Headers: Content-Length --给 XMLHttpRequest 对象赋能，让它可以拿到基本的 6 个响应头字段
    Content-Type: application/json; charset=utf-8 -----对于发送端，报文body部分的数据类型；对于charset是字符集
    Vary: Origin
    X-Krakend: Version 1.0.0
    X-Krakend-Completed: true
    Date: Mon, 05 Jul 2021 06:34:11 GMT
    Content-Length: 279 -----包体长度
**/


### HTTP/2
1. 头部压缩
2. 多路复用


### 跨域

1. CORS(跨域资源共享)

简单请求:请求方法为 GET、POST 或者 HEAD;请求头的取值范围: Accept、Accept-Language、Content-Language、Content-Type(只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain)

请求发出去之前，浏览器做了什么？

它会自动在请求头当中，添加一个Origin字段，用来说明请求来自哪个源。服务器拿到请求之后，在回应时对应地添加Access-Control-Allow-Origin字段，如果Origin不在这个字段的范围中，那么浏览器就会将响应拦截。因此，Access-Control-Allow-Origin字段是服务器用来决定浏览器是否拦截这个响应，这是必需的字段。

Access-Control-Allow-Credentials。这个字段是一个布尔值，表示是否允许发送 Cookie，对于跨域请求，浏览器对这个字段默认值设为 false，而如果需要拿到浏览器的 Cookie，需要添加这个响应头并设为true, 并且在前端也需要设置withCredentials属性
```
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

非简单请求

预检请求

/**
    OPTIONS /v3/user/organization/tenant/all?tenant_id=60647056227e590001971ea4 HTTP/1.1
    Host: 10.136.104.83:31172
    Connection: keep-alive
    Pragma: no-cache
    Cache-Control: no-cache
    Accept: */*
    Access-Control-Request-Method: GET
    Access-Control-Request-Headers: content-type,x-sso-fullticketid
    Origin: http://localhost:9002
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36
    Sec-Fetch-Mode: cors
    Referer: http://localhost:9002/
    Accept-Encoding: gzip, deflate
    Accept-Language: en,en-US;q=0.9,zh-CN;q=0.8,zh;q=0.7

**/

预检请求的方法是OPTIONS，同时会加上Origin源地址和Host目标地址，同时也会加上两个关键的字段:
Access-Control-Request-Method, 列出 CORS 请求用到哪个HTTP方法
Access-Control-Request-Headers，指定 CORS 请求将要加上什么请求头

响应字段
/**
    HTTP/1.1 200 OK
    Access-Control-Allow-Headers: Content-Type, X-Sso-Fullticketid -----表示允许发送的请求头字段
    Access-Control-Allow-Methods: GET -------表示允许的请求方法列表
    Access-Control-Allow-Origin: * --------表示可以允许请求的源，可以填具体的源名，也可以填*表示允许任意源请求
    Access-Control-Max-Age: 43200 ----预检请求的有效期，在此期间，不用发出另外一条预检请求
    Vary: Origin
    Vary: Access-Control-Request-Method
    Vary: Access-Control-Request-Headers
    Date: Mon, 05 Jul 2021 09:05:56 GMT
    Content-Length: 0
**/


2. JSONP
3. Nginx

### URI

    scheme :// user:passwd@ host:port path ?query #fragment

    scheme 协议名（http https file）
    host:port 主机名 端口
    path 请求路径，标记资源所在位置
    query 查询参数

### GET POST区别

    从参数的角度： get把参数放在url中,正因为放在url中传递，故不安全不能用来传递敏感的消息，而post通过request body传递参数
    从长度的角度： get请求在url中传送的长度有限，而post没有
    从编码的角度： get只能进行url编码，而post支持多种编码方式
    从缓存的角度： get请求可以被浏览器缓存，参数会被完整保留在浏览器历史记录里，而post中的参数不会被保留。
    从TCP的角度： GET产生一个TCP数据包；POST产生两个TCP数据包。即对于GET请求，浏览器会把http header和data一并发送，服务器响应200；对于POST，浏览器先发送header,服务器响应100 continue,浏览器再发送data,服务器响应200。也就是说，GET只需要汽车跑一趟就把货送到了，而POST得跑两趟，第一趟，先去和服务器打个招呼“嗨，我等下要送一批货来，你们打开门迎接我”，然后再回头把货送过去。


### [http缓存](https://juejin.im/post/5b70edd4f265da27df0938bc#heading-7)

    区别：myapp and nodejs/cache实战

    [http的强制缓存](https://user-gold-cdn.xitu.io/2017/11/29/16007be6f64ff7f7?imageslim)
    当缓存数据库中有已有所请求的数据时。客户端直接从缓存数据库中获取数据。
    当缓存数据库中没有所请求的数据时，客户端才会从服务器获取数据。

    [http的协商缓存](https://user-gold-cdn.xitu.io/2017/11/29/16007d1c835d5461?imageslim)
    又称对比缓存，客户端会先从缓存数据库获取一个缓存数据标志，得到标志后请求服务端验证是否失效，如果没有失效，服务端会返回304，此时客户端直接从缓存中获取所请求的获取所请求的数据，如果标识失效，服务端会返回更新后的数据

    缓存的方案
    对于强制缓存：会有两个字段表明：Expires和cache-Control

    cache-Control
    ```
    private: 客户端可以缓存
    public: 客户端和代理服务器都可以缓存
    max-age=t：缓存内容在t秒后失效
    no-cache： 需要使用协商缓存来验证验证缓存
    no-store：所有内容都不会缓存
    ```

    对于协商缓存：
    Last-Modified: 服务器在响应请求时，会告诉浏览器资源的`最后修改时间`。
    if-Modified-Since: 浏览器再次请求服务器的时候，请求头会包含此字段，后面跟着在缓存中获得最后修改的时间。服务器收到此请求
    发现有if-Modified-Since，则与被请求的资源的最后时间进行对比，如果一致则返回304和响应报文头，浏览器只需要从缓存中获取信息即可。（从某个时间节点算起，是否文件被修改了）

    如果真的被修改：那么开始传输响应一个整体，服务器返回：200 OK
    如果没有被修改：那么只需传输响应header，服务器返回：304 Not Modified

    if-Unmodified-Since:（从某个时间点算起, 是否文件没有被修改）

    如果没有被修改:则开始`继续'传送文件: 服务器返回: 200 OK
    如果文件被修改:则不传输,服务器返回: 412 Precondition failed (预处理错误)
    ---------------------------------
    Etag:服务器响应请求时，通过此字段告诉浏览器当前资源在服务器生成的唯一标识
    If-None-Match：
    再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。服务器接收到次报文后发现If-None-Match则与被请求资源的唯一标识进行对比。

    不同，说明资源被改动过，则响应整个资源内容，返回状态码200。
    相同，说明资源没有修改，则响应header，浏览器直接从缓存中获取数据信息。返回状态码304.

    Cache-Control > Expires > ETag > Last-Modified

### HTTP状态码

### cookie localstorage sessionstorage
cookie最早被设计是弥补HTTP在状态管理上的不足，比如：客户端向服务端发请求，服务端返回响应，连接关闭，下次发请求如何让服务端知道客户端是谁，Cookie 的作用就是用于解决这个问题

cookie
容量缺陷，cookie的体积上限只有4kb,用来存储少量的信息
性能缺陷，cookie紧跟域名，不管域名下面的某一个地址需不需要，请求都会携带，这样会造成资源浪费
安全缺陷，以明文的方式在浏览器与服务器之间传递


localStorage：
容量：上限为5M
只存在客户端，默认不参与与服务端的通信。这样就很好地避免了 Cookie 带来的性能问题和安全问题。
接口封装。通过localStorage暴露在全局，并通过它的 setItem 和 getItem等方法进行操作，非常方便。

应用场景
利用localStorage的较大容量和持久特性，可以利用localStorage存储一些内容稳定的资源，比如官网的logo，存储Base64格式的图片资源，因此利用localStorage


sessionStorage同localStorage
只是会话级别的存储，并不是持久化存储。会话结束，也就是页面关闭，这部分sessionStorage就不复存在了。

应用场景
可以用它对表单信息进行维护，将表单信息存储在里面，可以保证页面即使刷新也不会让之前的表单信息丢失。
可以用它存储本次浏览记录。如果关闭页面后不需要这些记录，用sessionStorage就再合适不过了


相同点： 都保存在浏览器端，都是同源的
不同点：

（1）传递方式不同

cookie数据始终在同源的http请求中携带(即使不需要)，即cookie在浏览器和服务器间来回传递。
sessionStorage和loaclStorage不会自动把数据发给服务器，仅在本地保存。

（2）数据大小不同

cookie数据还有路径(path)的概念，可以限制cookie只属于某个路径下。
存储大小限制也不同，cookie数据不能超过4k，同时因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标时。
sessionStorage和localStorage虽然也有存储大小的限制,但比cookie大得多，可以达到5M或者更大。

（3）数据有效期不同

sessionStorage:仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；
localStorage:始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；
cookie只在设置cookie过期时间之前一直有效，即使窗口或浏览器关闭。

（4）作用域不同

sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；
localStorage在所有同源窗口中都是共享的；
cookie也是在所有同源窗口中都是共享的。


### 实现一个event

发布订阅模式：eve实例就是一个事件调度中心，发布者通过事件调度中心发布事件，订阅者通过事件调度中心订阅事件，两者谁也不关心谁是解耦的，他们关注的是时间本身

观察者模式：耦合度更高，通常用来实现一些响应式的效果，在观察者模式中：只有两个主体，分别是目标对象Subject 观察者Observer

观察者实现一个update，在目标对象通知更新时被调用

目标对象要维护一个观察者列表， 在自身状态改变时，通过notify遍历观察者列表，通知所有观察者

由此看出他的耦合度比较高，角色很明确，没有事件调度中心作为中间者



## (二叉树的遍历)[https://leetcode-cn.com/problems/binary-tree-postorder-traversal/]

### 二叉树的先序遍历
扩展二叉树：将二叉树的每个结点的空指针引出一个虚结点，其值为一个特定值，比如“#”

先序遍历：中左右

- 递归方式实现前序遍历
1. 先访问根节点
2. 再序遍历左子树
3. 最后序遍右子树

```
let preorderTraversal = (root) => {
    if(root == null) return []
    let result = []
    let preOrderTraverseNode = (node) => {
        if (node) {
            // 根节点
            result.push(node.val);
            // 遍历左子树
            preOrderTraverseNode(node.left);
            // 遍历右子树
            preOrderTraverseNode(node.right)
        } 
    }
    preOrderTraverseNode(root);
    return result;
}

```

- 迭代方式实现
利用栈记录遍历过程，实际上，递归就使用了调用栈，所以我们可以使用栈模拟递归


1. 根入栈
2. 根节点出栈，将根节点值放入结果数组
3. 遍历左子树，右子树，（栈先入后出），所以我们先右子树入栈，再左子树入栈
4. 继续出栈 依次循环出栈遍历入栈，直到栈为空，遍历完成

```
 const preorderTraversal = (root) => {
    const list = [];
    const stack = [];

    // 当根节点不为空，根节点进栈
    if(root) {stack.push(root)}
    while(stack.length > 0) {
        // 返回栈顶的值
        const curNode = stack.pop();
        // 先访问根节点
        list.push(curNode.val);
        // 
        if (curNode.right!==null) {
            stack.push(curNode.right)
        }
        if (curNode.left!==null) {
            stack.push(curNode.left)
        }
    }
    return list
}
```


中序遍历：左中右

- 递归实现
1. 先中序遍历左子树
2. 再访问根节点
3. 最后中序遍历右子树

```
const inorderTraversal = (root) => {
    let result = [];
    const inorderTraversal = (node) => {
        if (node) {
            // 遍历左子树
            inorderTraversal(node.left);
            // 根节点
            result.push(node.val);
            // 遍历右子树
            inorderTraversal(node.right);
        }
    }
    inorderTraversal(root);
    return result;
}
```

- 非递归实现
1. 从根节点开始，先将根节点压入栈
2. 然后再将所有左子结点压入栈，取出栈顶节点，保存节点值
3. 再将当前指针移到其右子节点上，若存在右子节点，则下次循环又可将其所有左子结点压入栈中

```
const inorderTraversal = (root) => {
    let list = [];
    let stack = [];// 申请一个栈
    let node = root; // 变量node初始化为根节点
    // 1、 先把node节点压入栈中，对以node节点为头的整棵树来说，依次把整棵树的左子树压入栈中，即不断令node=node.left，循环直到node为空
    // 2、 取出栈顶节点，将值存到list，再让node=node.right，若存在right节点，重复1、
    // 3、直到stack为空，node为空结束
    while(node || stack.length) {
        // 遍历左子树
        while(node) {
            stack.push(node);
            node = node.left;
        }
        node = stack.pop();
        list.push(node.val);
        node = node.right;
    }
    return list;
}
```

后序遍历：左右中

- 递归

1. 先后序遍历左子树
2. 再后序遍历右子树
3. 最后访问根节点

const postorderTraversal = (root) => {
    let result = [];
    const postorderTraversal = (node) => {
        if (node === null) return;
        // 先遍历左子树
        postorderTraversal(node.left);
        // 遍历右子树
        postorderTraversal(node.right);
        // 根节点
        result.push(node.val);
    }
    postorderTraversal(root);
    return result;
}

- 非递归

后序遍历与前序遍历不同的是：

后序遍历是左右根,而前序遍历是根左右

1. 把前序遍历的push改为unshift，此时遍历顺序由根左右变为了右左根
2. 只需要把右左根变为左右根即可完成后序遍历

```
const postorderTraversal = (root) => {
    const list = [];
    const stack = [];

    // 当根节点不为空，根节点进栈
    if(root) stack.push(root)
    while(stack.length > 0) {
        // 返回栈顶元素
        const curNode = stack.pop();
        // 根左右=>右左根
        list.unshift(curNode.val);
        // 将右左根=》左右根
        // 栈的特性：先进后出，所以先左子树入栈，再右子树入栈，出栈的顺序就变更为先右后左
        if (curNode.left !== null) {
            stack.push(curNode.left)
        }
        if (curNode.right !== null) {
            stack.push(curNode.right)
        }
    }
    return list
}
```





## 优化

css和js优化
1. 获取元素宽高尺寸和位置信息会触发回流，如offsetTop、offsetLeft等，用变量存一下
2. 减少循环次数
3. 合理return



## 项目脚手架的搭建

1. bin/www文件下指定`#!/usr/bin/env node`,指定脚本的运行环境
2. 使用commander作为命令行的解决方案，可以借助此工具注册指令
    2.1 用户通过命令行检查创建的项目名称
    2.2 检查目录是否已经存在，如果存在则覆盖，如果没有则新建
    2.3 拉取template
    2.4 拷贝template文件到目标文件夹，即用户输入的目录
    2.5 更新package.json
    2.6 初始化git仓库
    2.7 安装项目依赖
3. 使用inquirer进行命令行交互
4. 使用download-git-repo拉取template文件，可以使用ora实现终端Spinner等待动画


##  性能优化
代码方面
1. 将offsetTop、offsetLeft等方法用变量存储
2. 减少循环次数 如filter+map 可以使用reduce替换
```
const rangeArr = res.map(ele => ele.name).filter(ele => typeof ele === 'number');

const rangeArr = res.reduce((total, { name }) => {
    if(typeof name === 'number') {
        total.push(name)
    }
    return total;
}, [])

```

reduce的其他妙用-解决异步操作
```
const rangeArr = res.reduce(async (total, {name}) => {
    const lastVal = await total; // total是个promise
    if(typeof name === 'number') {
        const data = await getData(name);
        lastVal.push(data);
    }
    return lastVal;
}, Promise.resolve([]));
```

3. (computed使用局部变量优化)[https://juejin.cn/post/6922641008106668045#heading-2]
```
data: {
    start: 0,
},
computed: {
    base () {
      return 42
    },
    result () {
      let result = this.start;
      for (let i = 0; i < 1000; i++) {
        result += Math.sqrt(Math.cos(Math.sin(this.base))) + this.base * this.base + this.base ;
      }
      return result;
    },
}

```

因为result在调用的时候同时会调用this.base，他会频繁的调用，所以会比较消耗性能，优化方案是每次调用this.base的时候，将this.base定义成一个局部变量，缓存this.base,后面直接访问

```
data: {
    start: 0,
},
computed: {
    base () {
      return 42
    },
    result ({ base, start }) {
      let result = start;
      for (let i = 0; i < 1000; i++) {
        result += Math.sqrt(Math.cos(Math.sin(base))) + base * base + base ;
      }
      return result;
    },
}

```
4. vue样式使用了scoped， 但是@import 'xxx.css'，此时的作用域是全局的
```
修改：
<style src="./xxx.css" scoped></style>
```
5. 懒加载
6. 开启gzip
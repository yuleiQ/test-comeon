## 作用域和作用域链
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

## 闭包和垃圾回收机制
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
垃圾回收机制：
如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收；如果两个对象互相引用，且不再被第三者引用，那么这两个互相引用的对象也会被回收
对于闭包来说 函数a被函数b引用，b又被a函数外的c变量引用，这就是a函数执行后不会被回收

现在各浏览器垃圾回收机制的方法：标记清除，引用计数
标记清除：当变量进入环境会被标记“进入环境”，离开环境时被标记为“离开环境”，浏览器定时回收‘离开环境’的变量




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
对应html

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
### 数组的方法，关注改变原数组的方法和不改变原数组的方法

### forEach和map的区别

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

### 异步编程串行的解决方案
4种---nodejs async/serial文件

### async defer
script什么都不加的条件下：html先解析，script脚本下载并立即执行指定脚本，脚本执行不成功，dom加载就给我等着

async html解析， 遇见script脚本，因为脚本下载是异步行为，script脚本下载过程会并行html解析，但一旦脚本下载完毕就会立即同步执行脚本，dom加载还是等着

defer  html先解析，遇到script标签 浏览器继续解析，并且并行下载script脚本，脚本下载完成不会立即执行，等解析完dom，在执行脚本


### 跨域




### HTTP


http缺点:
请求信息明文传输，容易被窃听截取
数据的完整性未校验，容易被篡改
没有验证对方身份，存在冒充危险

HTTPS的缺点
HTTPS协议多次握手，导致页面的加载时间延长近50%；
HTTPS连接缓存不如HTTP高效，会增加数据开销和功耗；
申请SSL证书需要钱，功能越强大的证书费用越高。
SSL涉及到的安全算法会消耗 CPU 资源，对服务器资源消耗较大。


HTTPS和HTTP的区别
HTTPS是HTTP协议的安全版本，HTTP协议的数据传输是明文的，是不安全的，HTTPS使用了SSL/TLS协议进行了加密处理。
http和https使用连接方式不同，默认端口也不一样，http是80，https是443。



#### GET POST区别
```
get把参数放在url中,正因为放在url中传递，故不安全不能用来传递敏感的消息，而post通过request body传递参数
get请求在url中传送的长度有限，而post没有
get只能进行url编码，而post支持多种编码方式
get请求参数会被完整保留在浏览器历史记录里，而post中的参数不会被保留。
get请求可以被浏览器缓存，POST不能

```

通俗点比喻TCP就像汽车，用来运输数据，但是如果路上跑的全是一模一样的汽车，将会很乱。故交通规则HTTP出现，HTTP给汽车运输叮了好几个服务类别，即请求方法

不同的浏览器（发起http请求）和服务器（接受http请求）就是不同的运输公司。虽然理论上get请求放在url上，但是要有长度限制，浏览器限制在2k,服务器在64k左右，超出我就不处理，或者get你偷偷的传递了数据，不同服务器的处理也是不同的，有些服务器就读有的就不读

```
GET产生一个TCP数据包；POST产生两个TCP数据包。即对于GET请求，浏览器会把http header和data一并发送，服务器响应200

对于POST，浏览器先发送header,服务器响应100 continue,浏览器再发送data,服务器响应200

```
也就是说，GET只需要汽车跑一趟就把货送到了，而POST得跑两趟，第一趟，先去和服务器打个招呼“嗨，我等下要送一批货来，你们打开门迎接我”，然后再回头把货送过去。


#### [http缓存](https://juejin.im/post/5b70edd4f265da27df0938bc#heading-7)

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
------------------------------
if-Unmodified-Since:（从某个时间点算起, 是否文件没有被修改）

如果没有被修改:则开始`继续'传送文件: 服务器返回: 200 OK
如果文件被修改:则不传输,服务器返回: 412 Precondition failed (预处理错误)
---------------------------------
Etag:服务器响应请求时，通过此字段告诉浏览器当前资源在服务器生成的唯一标识
If-None-Match：
再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。服务器接收到次报文后发现If-None-Match则与被请求资源的唯一标识进行对比。

不同，说明资源被改动过，则响应整个资源内容，返回状态码200。
相同，说明资源没有修改，则响应header，浏览器直接从缓存中获取数据信息。返回状态码304.

Pragma > Cache-Control > Expires > ETag > Last-Modified

#### HTTP状态码
2xx 响应的结果标明请求被正常的处理了

200 表示从客户端发来的请求在服务器端被正常处理了
204 no content 表示服务器接受的请求已经成功处理，但是在返回的响应报文中不含实体的主体部分，比如：当浏览器发出请求处理后，返回204,那么浏览器显示的页面不会发生任何更新
206 Partial Content 表示客户端进行了范围请求，而服务器成功执行了这部分的GET请求

3XX(Redirection 重定向状态码)

301 Moved permanently永久性重定向 
302 Moved Temporarily 请求临时重定向。
303 See Other   临时性重定向，且总是使用 GET 请求新的 URI。
304 Not Modified 自从上次请求后，请求的网页未修改过，可以直接使用缓存的文件。
307 临时重定向。该状态码与302有相同的含义。尽管302标准禁止post变化get，但实际使用时大家不遵守。 307会遵照浏览器标准，不会从post变为get。

4xx : 客户端错误，请求包含语法错误或者无法完成请求。

400 Bad Request 由于客户端请求有语法错误，不能被服务器所理解。
401 Unauthorized 请求未经授权，无法访问，需要验证。
403 Forbidden 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因（禁止访问）。
404 Not Found 请求的资源不存在，找不到如何与 URI 相匹配的资源,比如输入了错误的URL。

5xx : 服务器错误，服务器在处理请求的过程中发生了错误。
500 Internal Server Error 最常见的服务器端错误,服务器发生不可预期的错误，导致无法完成客户端的请求。
502 错误通常不是客户端能够修复的，而是需要由途径的 Web 服务器或者代理服务器对其进行修复
503 Service Unavailable 服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常(可能是过载或维护)。

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



### (二叉树的遍历)[https://leetcode-cn.com/problems/binary-tree-postorder-traversal/]

#### 二叉树的先序遍历
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

### 洗牌算法

### 函数柯里化

### 单例模式

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


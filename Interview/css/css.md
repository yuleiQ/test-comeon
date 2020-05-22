## 页面导入样式@import和link区别
1. @import是css语法规则，只能导入样式表；link是html提供的标签，不仅可以加载css，还可以定义rss,rel连接属性
2. link引入的css被同时加载；；@import页面加载完成才加载。

## html5文件离线缓存怎么用
def: 对部分资源或者页面进行缓存，达到没网也能展示的效果
方法：在html中引入manifest文件，用来存储服务器希望缓存的文件列表

### 未定义高度元素的垂直居中（index1.html/index2.html）
## html5新增标签
canvas/audio、video/nav、header、footer、aside、section等布局元素

## em单位 rem
em相对父元素来计算的，是一个相对长度单位
rem相对于根元素来计算大小

rem计算原理：
js动态获取窗口的宽度w，然后w/设计稿宽度*要设置的跟字体的大小+'px';

使用 rem 布局三种主流方法实现自适应布局？
1. 媒介查询调整根元素的字体大小
`根元素字体大小=换算比例*(视口尺寸/设计稿尺寸)`
假设设计稿750尺寸，并且设定换算比例1rem=100px;
```
html{font-size: 62.5%;}
@media only screen and (min-width: 481px) {
    html {
        font-size: 400.83%; // 100*(481/750)/16*100%
    }
}
```
以上虽简单，但是不能适配所有的移动设备，设备种类多了，需要设计更多媒介查询条件才能更好适应

2. 通过视口的宽度动态计算根元素字体大小

原理跟第一种一样，区别是视口大小是通过js动态获取的
```
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (clientWidth > 750) {
        clientWidth = 750;
      }
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
```
这种方法：不同的屏幕大小的设备看到的页面元素会根据相同的比例进行缩放展示

3. 通过设备的dpr动态改变缩放值并动态计算根元素字体大小？？？？
dpr物理像素与逻辑像素的比


## viewport设置
设置viewport进行缩放 
initial-scale 页面首次被显示是可视区域的缩放级别
maximum-scale 用户可将页面放大的程度
user-scalable 是否可对页面进行缩放，no 禁止缩放
```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

## 盒模型BFC
ie盒模型：margin、border、padding、content，content部分包含了padding和border.`box-sizing:border-box`
w3c盒子模型的范围包括margin、border、padding、content,并且content部分不包含其他部分。`box-sizing:content-box`

## flex基本属性(flex.html)
(https://blog.csdn.net/m0_37058714/article/details/80765562)[flex布局区别]

父元素属性：
justify-content:center/space-between/space-around/flex-start/flex-end            子元素水平排列方式
align-items:center/flex-start/flex-end                                           子元素垂直排列 
flex-direction:row/row-reverse/column/column-reverse                             排列方式
flex-wrap:no-wrap/wrap/wrap-reverse                                              排行
flex-flow: <flex-direction> <flex-wrap> 默认值：row nowrap
align-content:center                                                             多行的时候，垂直排列
子元素属性：
flex: 0 1 auto;   <flex-grow>, <flex-shrink> 和 <flex-basis>
flex-grow:1  定义子元素的放大比例(当父元素大于所有子元素之后且父元素有剩余)
flex-shrink: 1 定义项目缩小比例（当父元素小于所有元素之和且超出父元素宽度）
flex-basis:auto  用来设置元素的宽度
align-self: center/flex-start/flex-end                                           用来覆盖父级align-items垂直排列
order                                                                            规定子元素顺序，排序(数值越小，越靠前)
 
## 开发过程中怎样避免css class类名相互污染。
- 首先需要了解css的规则是全局的，任何的组件的样式规范都使整个du页面有效，产生`局部作用域`的方式就是起一个独一无二的名字，这就是(http://www.ruanyifeng.com/blog/2016/06/css_modules.html)[css Modules]的做法。CSS Modules 提供各种插件，这里基于webpack的css-loader,通过哈希计算，所以每次引用都会生成新的哈希，多人开发不会出现类名冲突
- Vue下：可以使用scoped避免污染
- vue-loader提供了CSS Modules的一流集成，可以作为模拟scoped css的替代方案
用法：具体看官网
CSS Modules 必须通过向 `css-loader` 传入 `modules: true` 来开启
```
{
  module: {
    rules: [
      // ... 其它规则省略
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启 CSS Modules
              modules: true,
              // 自定义生成的类名
              localIdentName: '[local]_[hash:base64:8]'
            }
          }
        ]
      }
    ]
  }
}

然后在你的style上加`module`,这个 module 特性指引 Vue Loader 作为名为 $style 的计算属性，向组件注入 CSS Modules 局部对象
<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
```

## sass的使用
1. 变量：所有变量以$开头;如果变量需要镶嵌在字符串之中，就必须需要写在#{}之中。
```
$side : left;
.rounded {
　border-#{$side}-radius: 5px;
}
```
2. 计算功能
3. 嵌套：在嵌套的代码块内，可以使用&引用父元素

代码的重用
4. 继承：@extend
```
.class1 {
　border: 1px solid #ddd;
}
.class2 {
　　@extend .class1;
　　font-size:120%;
}

```
5. Mixin
```
使用@mixin定义一个代码块

@mixin left {
　　float: left;
　　margin-left: 10px;
}
使用@include命令，调用这个mixin。
div {
　　@include left;
}
```
mixin的强大之处，在于可以指定参数和缺省值。
```
@mixin left($value: 10px) {
　float: left;
　margin-right: $value;
}
div {
　 @include left(20px);
}
```
6. 颜色函数
7. @import命令，用来插入外部文件。

高级用法

8. 条件语句
@if表判断
9. 循环语句
```
@for $i from 1 to 10 {
　　.border-#{$i} {
　　　　border: #{$i}px solid blue;
　　}
}
```
10. 自定义函数
```
@function double($n) {
　　@return $n * 2;
}

#sidebar {
　　width: double(5px);
}
```
## 实现页面滚动某段距离后某个元素吸顶（吸顶导航）
1. 利用position的sticky属性 粘性定位： 注意:设定元素任意父节点overflow: visible，否则不会生效；父节点定位设置为relative/absolute/fixed,则元素相对父元素进行定位，不会相对视口
2. position: fiexed 固定定位

position: relative; 相对定位，相对于自己的初始位置，不脱离文档流
position: absolute; 绝对定位的元素的位置相对于最近的已定位祖先元素,绝对定位脱离文档流 
position: fixed；固定定位，元素脱离正常的文档流

## 解决谷歌浏览器最小字号12px 。       
`-webkit-text-size-adjust: none; ` // 禁用Webkit内核浏览器的文字大小调整功能

## 回流和重绘
回流必将引起重绘，而重绘不一定会引起回流。
回流：当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。
重绘：当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘。

何时会发生回流：
1. 页面初始化
2. 操作dom
3. 元素的尺寸变化（padding/border/width）
4. css属性发生变化（display: none）
5. 内容改变（文本改变或图片改变而引起的的计算值的宽高改变）
6. 浏览器窗口尺寸改变（当resize事件发生时） 

如何减少reflow/repaint
1. 批量修改DOM或者样式
2. 对于复杂动画效果,使用绝对定位让其脱离文档流
3. 不要使用table布局，因为可能很小的一个改动都会造成整个table的重新布局
4. 如果要对一个元素进行复杂的操作，可以先隐藏它（display：none），操作完成后再显示

## 清除浮动方式
1. 给父元素加height
2. 浮动元素后使用一个空元素clear:both
3. 给浮动元素的容器添加overflow:hidden;
4. 万能清除浮动
.clearfix:after {
    content: '';
    display: block;
    clear: both;
    height:0;
    line-height:0;
    visibility:hidden;//允许浏览器渲染它，但是不显示出来
  }

## c3新特性
阴影： box-shadow、text-shadow
圆角:  border-radius
flex布局：css多栏布局
grid布局：网格布局
图片边框：border-image
rgba
动画：animations和transitions


## [两栏，三栏布局](https://github.com/zwwill/blog/issues/11) 
对应例子html
圣杯布局的问题： 当浏览器无限缩小，圣杯将被破坏掉，所以最好设置一个min-width 设置方案“left-width * 2 + rigth-width”，原因：由于设置了相对定位，当left和right位置产生重叠，由于浮动的原因一行放不下，布局自然被打乱。双飞翼解决此问题

布局 | 优点 | 缺点
---|---|---
圣杯 | 结构简单，无多余 dom 层 | 中间部分宽度小于左侧时布局混乱
双飞翼		  |支持各种宽高变化，通用性强 | dom结构多余层，增加渲染树生成的计算量
绝对定位 |结构简单，且无需清理浮动 | 两侧高度无法支撑总高度


### 移动端的1px


### transform用法


### 主流浏览器的内核
1. trident内核/IE内核（IE）
2. blink内核（Chrome） 
3. gecko内核(FireFox)
4. Webkit内核(Safari)
5. Preston内核(Opera)
### v-for和v-if谁的优先级高？应该如何正确使用避免性能问题
源码级别：compiler/codegen/index.js  64行条件判断for在if前面
1. v-for的优先级高于v-if 
2. 如果同时出现，每次循环都会先执行循环，在判断条件，无论如何，循环不可避免
3. 如要避免这种情况，则在外层嵌套template,在这一层进行v-if判断，在内层循环
4. 如果条件出现在循环内部，可通过计算属性过滤掉不需要显示的项

### Vue组件data为什么必须是个函数而Vue的根实例则没有此限制
源码级别：src/core/instance/state.js

数据初始化是在initState方法中，找到initData方法，查看定义的data变量，告诉我们如果data是函数则执行并将其结果作为data选项的值，否则每次初始化拿到的data选项指向的都是同一个地方，导致一个组件间不同实例之间用的数据会共享，产生数据污染
```
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    ....
}
```

Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们公用一个对象，那么状态变更将会影响所有实例，这是不合理的；采用函数形式定义，在initData时会将其作为工厂函数返回全新data对象，有效规避多实例之间状态污染问题。而在Vue根实例创建过程中则不存在该限制，也是因为根实例只能有一个，不需要担心这种情况。

### vue循环中的key的作用以及原理
src\core\vdom\patch.js - updateChildren()

作用主要是为了高效的更新虚拟dom，其原理是vue在patch过程中通过key可以精确判断两个节点是否是同一个，从而避免频繁更新不同的元素，使得整个patch过程减少dom操作量，提高性能

在patch的过程中，会执行patchVnode,patchVnode过程中回执行updateChildren方法，他会更新所有的两个新旧的子元素，那么在这个过程中，通过key就可以精准的判断，当前在循环的这两个节点不是一个节点

如果不加key，永远会认为是相同的节点，所以会强制更新，这样的话就没法避免频繁更新的过程，需要额外做dom操作

如果添加key,可以通过内部的优化算法，比如首尾结构的相似性，在一般情况下，元素不会发生大量的位置变化，所以会高效的结束循环。


### (基于数据劫持实现的双向绑定的特点)[https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf#heading-0]
1. 什么是数据劫持

利用`object.defineProperty`劫持对象的访问器，在属性值发生变化时获取变化，进行下一步操作
Vue的操作就是加入了发布订阅模式，结合Object.defineProperty的劫持能力，实现了可用性很高的双向绑定。

2. proxy相比defineProperty的优势
- Object.defineProperty()的问题
1. 不能监听数组的变化
2. 必须监听对象的每个属性
3. 必须深层遍历嵌套的对象

proxy优势：
1. 可以直接监听对象的某个属性
2. 可以直接监听数组
3. proxy的第二个参数有10几种劫持方法
4. Proxy作为新标准将受到浏览器厂商重点持续的性能优化


### vue数据响应式原理以及实现

### vuex实现原理，如何使用

### vue-router原理以及实现

### vue react区别

### 组件的通信方式

- props
- eventBus
- vuex
- 自定义事件

边界情况：$parent $children $root $refs provide/inject 
非属性特性：$attrs $listeners


### 生命周期钩子函数
- 三个阶段：
  - 初始化
  - 更新
  - 销毁

- 获取异步数据到底是写在created还是mounted?
  本质上是没有差别的。我们异步获取数据的时间其实远远大于初始化创建挂载的时间的。
  - created 组件实例已创建，data数据可以访问了，但没挂载，当前数据还没转化为真实dom元素，由于未挂载所以dom元素不存在
  - mounted 已挂载，将虚拟dom转化为真实dom，dom元素可以访问。
- 页面初始化时触发什么？
  beforeCreate => created => beforeMount => mounted
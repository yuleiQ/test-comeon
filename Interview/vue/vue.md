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

### vuex实现原理，如何使用

### vue循环中的key的作用以及原理

作用主要是为了高效的更新虚拟dom，其原理是vue在patch过程中通过key可以精确判断两个节点是否是同一个，从而避免频繁更新不同的元素，使得整个patch过程减少dom操作量，提高性能

在patch的过程中，会执行patchVnode,patchVnode过程中回执行updateChildren方法，他会更新所有的两个新旧的子元素，那么在这个过程中，通过key就可以精准的判断，当前在循环的这两个节点不是一个节点

如果不加key，永远会认为是相同的节点，所以会强制更新，这样的话就没法避免频繁更新的过程，需要额外做dom操作

如果添加key,可以通过内部的优化算法，比如首尾结构的相似性，在一般情况下，元素不会发生大量的位置变化，所以会高效的结束循环。



### vue-router原理以及实现

### vue react区别


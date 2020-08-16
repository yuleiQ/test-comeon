// 递归dom树
// 判断节点类型，如果为文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性是否是指令或者事件，然后递归
class Compiler{
 constructor(el, vm) {
  // el 宿主元素 vm Kvue实例
  this.$vm = vm
  this.$el = document.querySelector(el);

  if (this.$el) {
    // 执行编译
    this.compiler(this.$el)
  }

 }
 compiler(el) {
  // 遍历el树
  const childNodes = el.childNodes;
  Array.from(childNodes).forEach(node => {
    // 判断是否是元素
    if (this.isElement(node)) { 
      console.log("编译元素" + node.nodeName);
      this.compileElement(node)
    } else if (this.isInterpolation(node)) { 
      console.log("编译插值文本" + node.textContent);
      this.compileText(node)
    }

    if (node.childNodes && node.childNodes.length > 0) {
      this.compiler(node);
    }
  });
 }

 isElement(node) {
    return node.nodeType == 1;
  }
  isInterpolation(node) {
    // 正则{{}}
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  // 调用update函数执插值文本赋值
  compileText(node) {
      console.log(RegExp.$1);
      // node.textContent = RegExp.$1;
      this.update(node, RegExp.$1, 'text')
  }

  compileElement(node) {
    // 遍历属性集合
    let nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
          let attrName = attr.name; // k-text
          let exp = attr.value; // counter
          if (this.isDirective(attrName)) {
              let dir = attrName.substring(2);
              // 执行指令
              this[dir] && this[dir](node, exp);
          }
    });
  }
  // 规定以k-xx
  isDirective(attr) {
      return attr.indexOf("k-") == 0;
  }
  // k-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.update(node, exp,'text')
  }

  html(node, exp) {
    // node.innerHTML =  this.$vm[exp]
    this.update(node, exp,'html')
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
  
  textUpdater(node, value) {
    node.textContent = value;
  }
  // 更新处理，可以更新对应dom
  update(node, exp, dir) {
    // 初始化
    // 指令对应的更新函数xxUpdater
    const fn = this[dir+'Updater'];
    fn&&fn(node, this.$vm[exp])
    // 更新
    new Watcher(this.$vm, exp, function(val) {
      fn&&fn(node, val)
    })
  }
}

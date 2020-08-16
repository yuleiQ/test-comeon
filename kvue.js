function defineReactive(obj, key, val) {
  // 递归
  observer(val)
  // 创建一个Dep和当前的key一一对应

  const dep = new Dep()
  

  Object.defineProperty(obj, key, {
    get() {
      console.log('get '+ key)
      // 依赖收集主要在这里 Dep.target就是个watcher
      Dep.target && dep.addDep(Dep.target);

      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set '+ key + ':' + newVal)
        observer(newVal)
        val = newVal

        // 通知更新
        // watchers.forEach(w => {
        //   w.update()
        // })
        dep.notify() // 通知相关watchers更新
        
      }
    }
  }) 
}

function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  // observer实例
  new Observer(obj)
}

// 代理函数，方便用户直接访问$data中的数据
function proxy(vm, _key) {
  Object.keys(vm[_key]).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[_key][key]
      },
      set(newVal) {
        vm[_key][key] = newVal
      }
    })
  })
}

class KVue{
  constructor(options) {
    this.$options = options
    this.$data = options.data

     // 响应化处理
    observer(this.$data);

    // 代理
    proxy(this, '$data')

    new Compiler(options.el, this)
  }
 
}

class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value)
  }

  // 对象数据的响应化
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
  // 数组数据的响应化
}

// 观察者 保存更新函数 值发生变化调用更新函数
// const watchers = []
class Watcher{
  constructor(vm, key, updateFn) {
    this.vm = vm;
    // 依赖key
    this.key = key;
    // 更新函数
    this.updateFn = updateFn;

    // 临时放入watchers数组
    // watchers.push(this)

    // Dep.target静态属性上设置为当前watcher实例???
    Dep.target = this;
    this.vm[this.key] // 读取触发了getter
    // 置收集完空
    Dep.target = null;
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// 依赖收集 管理某个key相关的所有watchers实例
class Dep{
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}
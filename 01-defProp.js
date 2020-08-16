function defineReactive(obj, key, val) {
  // 递归
  observer(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get '+ key)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set '+ key + ':' + newVal)
        if(typeof newVal === 'object') {
          observer(newVal)
        }
        val = newVal
        
      }
    }
  }) 
}

function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {foo: 'foo', baz: {a: 1}}
observer(obj)
obj.foo;
obj.foo='aaaa'
obj.baz.a = 10
obj.baz = {
  a: 100
}
obj.baz.a = 100000

// obj.dong = 'dong';
set(obj, 'dong', 'doing')
obj.dong
// defineReactive(obj, 'foo', 'foo')
// obj.foo;
// obj.foo="aaaaaaaaaaa";

let Vue;


class VueRouter{
  constructor(options) {
    this.options = options
    //
    this.routeMap = {}

    // 
    // 
    this.app = new Vue({

    })
  }

  init() {

  }
}

VueRouter.install = function(_Vue) {
  Vue = _Vue; // 这里保存，上面使用

  // 混入任务
  Vue.mixin({
    beforeCreate() {// ?
      // 这里的代码将来会在外面初始化时被调用

      Vue.prototype.$router = this.$options.router;
    },
  })
}
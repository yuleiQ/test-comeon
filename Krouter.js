let Vue = null;
class KRouter{
  constructor(options) {
    this.$options = options
    this.routeMap = {}

    // 路由响应式
    this.app = new Vue({
      // 实例化vue使用data来绑定地址栏
      data: {
        current: '/'
      }
    })
  }

  init() {
    // 监听地址栏url的变化
    this.bindEvents();
    // 解析路由配置
    this.createRouteMap(this.$options);
    // 实现router-view 和router-link
    this.initComponent();
  }

  bindEvents() {
    window.addEventListener("load", this.onHashChange.bind(this));
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.app.current = window.location.hash.slice(1) || '/';
  }

  createRouteMap(options) {
    // 创建路由和组件的映射关系
    options.routes.forEach(item => {
      this.routeMap[item.path] = item.component;
    })
  }
  
  initComponent() {
      Vue.component('router-view', {
        render: h=> {
          // 通过Vue实例化中监听的url地址，使用路由和组件映射关系获取组件，通过render渲染
          const comp = this.routeMap[this.app.current];
          return h(comp);
        }
      })

      Vue.component('router-link', {
        props: {
          // 使用to属性设置跳转地址
          to: String
        },
        render(h) {
          return h('a', {
            attrs: {
              href: "#" + this.to
            }
            // 匿名插槽获取文本
          }, [this.$slots.default])
        },
      })
  }
}

// 

KRouter.install = function(_Vue) {
  Vue = _Vue; // 这里保存，上面使用
  // 混入任务
  Vue.mixin({
    beforeCreate() {
      // 这里的代码将来会在外面初始化时被调用
      Vue.prototype.$router = this.$options.router;
      this.$options.router.init();
    }
  })
}



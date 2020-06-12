class Bus {
    constructor() {
        this.cb = {}
    }
    $on(name, fn) {
        this.cb[name] = this.cb[name] || []
        this.cb[name].push(fn)
    }
    $emit(name, args) {
       if(this.cb[name]) {
           this.cb[name].forEach(cb => {
                cb(args)
           });
       }
    }
}
export default new Bus()
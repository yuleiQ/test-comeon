var count = 1;
var container = document.getElementById('container');

function getUserAction() {
    console.log(this)
    container.innerHTML = count++;
};

container.onmousemove = debounce(getUserAction, 3000);


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
// this 指向
// event 对象


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
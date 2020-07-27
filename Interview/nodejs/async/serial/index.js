// 异步编程几种方式
// 异步操作的串行执行

const logName = (name) => {
    console.log(`log...${name}   ` + new Date().toLocaleDateString())
};

// 回调地狱
exports.callback = () => {
    setTimeout(() => {
        logName('callback1');
        setTimeout(() => {
            logName('callback2')
        }, 100);
    }, 100);
};

// promise
const promise = (name, delay = 100) => new Promise((resolve, reject) => {
    setTimeout(() => {
        logName(name)
        resolve()
    }, delay)
})

exports.promise = () => {
    promise('promise1')
        .then(promise('promise2'))
}

exports.generator = () => {
    const generator = function* (name) {
        yield promise(name + 1)
        yield promise(name + 2)
        yield promise(name + 3)
    }
    let co = generator => {
        if(it === generator.next().value) {
            it.then(res => {
                co(generator)
            })
        } else {
            return 
        }
    }
    co(generator('co-generator'))
}


exports.asyncAwait = async () => {
    await promise('asyncAwait1')
    await promise('asyncAwait2')
    await promise('asyncAwait3')
}

// 事件监听方式处理(不常用)

// 采用事件驱动
exports.event = async () => {
    // 函数柯里化
    const asyncFun = name => event => {
        setTimeout(() => {
            logName(name);
            event.emit('end')
        }, 100)
        return event;
    }

    const array = [asyncFun('event1'), asyncFun('event2'), asyncFun('event3')]
    const {EventEmitter} = require('events');
    const event = new EventEmitter();
    let i = 0;
    // i < array.length 判断是否越界 没有越界 执行array[i++](event)  
    event.on('end', () => i < array.length &&  array[i++](event));
    event.emit('end')
}
// const { callback } = require("../index");
// const { promise } = require("../index");
// test('callback', done => {
//     callback();
//     // 延迟一秒结束
//     setTimeout(done, 1000);
// })



// test('promise', done => {
//     promise();
//     // 延迟一秒结束
//     setTimeout(done, 1000);
// })

// test('generator', done => {
//     const { generator } = require('../index')
//     generator();
//     setTimeout(done, 1000);
// })

// test('Async/Await', done => {
//     const { asyncAwait } = require('../index');
//     asyncAwait()
//     setTimeout(done, 1000);
// })


test('Event', done => {
    const { event } = require('../index');
    event()
    setTimeout(done, 1000);
})



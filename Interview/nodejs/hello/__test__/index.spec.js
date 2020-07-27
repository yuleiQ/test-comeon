test('测试hello', () => {
    var ret = require('../index.js');
    // console.log(hello, '我测试下jest')
    expect(ret).toBe('hello')
})
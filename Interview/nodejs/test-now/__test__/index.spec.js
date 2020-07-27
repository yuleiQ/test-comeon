test('测试文件名生成', () => {
    const src = new (require('../index.js'))();
    const ret = src.getTextFileName('/a/class.js');
    console.log('getTextFileName', ret)
    expect(ret).toBe('/a/__test__/class.spec.js')
})
module.exports = function(source) {
    // console.log(source + 'style-loader')
    return `const ele = document.createElement('style')
        ele.innerHTML = ${JSON.stringify(source)}
        document.head.appendChild(ele)
    `
}
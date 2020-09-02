module.exports = function(source, map,  ast) {
    const callback = this.async()
    setTimeout(()=> {
        const result = source.replace('hello', this.query.name);
        callback(null, result)
    }, 3000)
}
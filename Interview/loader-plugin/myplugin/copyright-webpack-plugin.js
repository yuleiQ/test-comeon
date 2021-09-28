class CopyRightWebpackPlugin {
  apply(complier) {
    // complier.hooks.compile.tap('CopyRightWebpackPlugin', (compilation) => {
		// 	console.log(compilation);
		// })

    complier.hooks.emit.tapAsync('CopyRightWebpackPlugin', (compilation, cb) => {
      console.log(compilation, 'compilation')
			compilation.assets['copyright.txt']= {
				source: function() {
					return 'copyright by hello'
				},
				size: function() {
					return 18;
				}
			};
			cb();
		})
  }

}

module.exports = CopyRightWebpackPlugin;
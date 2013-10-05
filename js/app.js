/* Setup RequireJS */
requirejs.config({
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
	paths: {
		bw: 'bower_components',
		vn: 'js/vendor',
		js: 'js'
	}
});

// Hexahedrone
var hexahedrone = angular.module('hexahedrone', ['ng']);

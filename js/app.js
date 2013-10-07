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

Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);
// Hexahedrone
var hexahedrone = angular.module('hexahedrone', ['ng', 'ui.router', 'ParseServices', 'ExternalDataServices']);

hexahedrone.config(function($stateProvider, $urlRouterProvider) {

	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/sim");

	// $stateProvider.state('home', {
	// 	url: "/",
	// 	templateUrl: "views/home.html"
	// });
	$stateProvider.state('sim', {
		url: "/sim",
		templateUrl: "views/sim.html"
	});
});

hexahedrone.run(['ParseSDK', 'ExtendParseSDK', '$rootScope', '$state', '$stateParams', function(ParseService, ExtendParseSDK, $rootScope,   $state,   $stateParams) {

	// Parse is initialised by injecting the ParseService into the Angular app
	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;



    // loading animation
    $rootScope.setLoading = function() {
	    $rootScope.isViewLoading = true;
	};
	$rootScope.unsetLoading = function() {
	    $rootScope.isViewLoading = false;
	};

	$rootScope.isViewLoading = false;

	$rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
		// $rootScope.setBigLoading();
		$rootScope.contentLoaded = false;
	})

	$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		$rootScope.unsetLoading();
		$rootScope.contentLoaded = true;
	});

}]);
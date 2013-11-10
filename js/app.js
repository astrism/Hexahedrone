define([
	'angular',
	'parse',
	'underscore',
	'grid'
	], 
	function (angular, Parse, _, ParseServices, _ParseObjects, ParseQueryAngular) {

		Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);
		// Hexahedrone
		var app = angular.module('app', ['ng', 'ui.router', 'ngGrid']);
		console.log('starting app')
		app.run(['$rootScope', '$state', '$stateParams', function($rootScope,   $state,   $stateParams) {
			console.log('running app');
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

		return app;
});

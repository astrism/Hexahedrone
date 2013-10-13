define([
	'angular',
	'app'
	],
	function(angular, app) {
	'use strict';

	return app.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/sim");

		// $stateProvider.state('home', {
		// 	url: "/",
		// 	templateUrl: "views/home.html"
		// });
		$stateProvider.state('sim', {
			url: "/sim",
			templateUrl: "views/simView.html",
			resolve: {
				require: function($q, $rootScope) {
					var deferred = $q.defer();
					require([
						'vn/phaser',
						'BasicBox'
						],
						function(phaser, BasicBox) {
							$rootScope.$apply(function() {
								deferred.resolve('Hello!');
							});
						}
					);
					return deferred.promise;
				}
			}
		});
		$stateProvider.state('stats', {
			url: "/stats",
			templateUrl: "views/statsView.html"
		});
	}]);

});
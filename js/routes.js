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
		$urlRouterProvider.otherwise("/stats");

		// $stateProvider.state('home', {
		// 	url: "/",
		// 	templateUrl: "views/home.html"
		// });
		$stateProvider.state('sim', {
			url: "/sim",
			templateUrl: "views/simView.html"
		});
		$stateProvider.state('stats', {
			url: "/stats",
			templateUrl: "views/statsView.html"
		});
	}]);

});
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
			templateUrl: "views/simView.html",
			controller: 'sim'
		});

		// STATs
		$urlRouterProvider.when('/stats', '/stats/latest');
		$stateProvider.state('stats', {
			url: "/stats",
			templateUrl: "views/statsView.html",
			controller: 'stats'
		});

		$stateProvider.state('stats.latest', {
			url: "/latest",
			templateUrl: "views/statsViewDetail.html",
			controller: 'stats.latest'
		});

		$stateProvider.state('stats.best', {
			url: "/best",
			templateUrl: "views/statsViewDetail.html",
			controller: 'stats.best'
		});

		$stateProvider.state('stats.worst', {
			url: "/worst",
			templateUrl: "views/statsViewDetail.html",
			controller: 'stats.worst'
		});
	}]);

});
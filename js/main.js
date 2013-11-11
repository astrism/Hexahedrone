require( [
	'angular',
	'parse',
	'underscore',
	'app',
	'routes',
	'router',
	'vw/sim',
	'vw/stats',
	'vw/stats.latest',
	'vw/stats.best',
	'vw/stats.worst'
	], 
	function(angular, Parse, _, app) {
		'use strict';
		var $html = angular.element(document.getElementsByTagName('html')[0]);

		$html.addClass('ng-app');
		angular.bootstrap($html, [app.name]);
	}
);
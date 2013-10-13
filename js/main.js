require( [
	'angular',
	'parse',
	'underscore',
	'app',
	'routes',
	'router',
	'cp/sim',
	'cp/stats'
	], 
	function(angular, Parse, _, app) {
		'use strict';
		var $html = angular.element(document.getElementsByTagName('html')[0]);

		$html.addClass('ng-app');
		angular.bootstrap($html, [app.name]);
	}
);
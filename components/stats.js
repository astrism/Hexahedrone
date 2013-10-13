define([
	'app',
	'dt/Match'
	], 
	function(app) {

		app.directive('stats', ['MatchService', function(MatchService) {
			console.log('register directive')
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/sim.html',
				replace: true,
				link: function($scope, $element) {
					requirejs([
						'grid'
						], function() {
							var matches = new MatchService.collection();
							var matchesPromise = matches.load();
							matchesPromise.then($scope.onMatchesLoaded);
						}
					);
				},
				controller: function($scope, $element) {
					$scope.onMatchesLoaded = function(matches) {
						console.log('matches:', matches);
					}
				}
			}
		}]);
	}
);
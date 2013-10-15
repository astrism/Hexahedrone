define([
	'angular',
	'app',
	'dt/Match'
	], 
	function(angular, app) {

		app.directive('stats', ['$compile', 'MatchService', function($compile, MatchService) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/stats.html',
				replace: true,
				scope: true,
				link: function($scope, $element) {
					var matches = new MatchService.collection();
					var matchesPromise = matches.load();
					matchesPromise.then($scope.onMatchesLoaded);
				},
				controller: function($scope, $element) {
					$scope.matches = [];
					$scope.gridOptions = {
						data: 'matches',
						enableRowSelection: false,
						columnDefs: [
						{
							field: 'attributes.winnerName',
							displayName: 'Winner'
						}, {
							field: 'attributes.userNames.0',
							displayName: 'Left Corner',
							headerClass: 'headerLeftCorner',
							cellClass: 'cellLeftCorner'
						}, {
							field: 'attributes.hexNames.0',
							displayName: 'Fighter',
							headerClass: 'headerLeftCorner',
							cellClass: 'cellLeftCorner'
						}, {
							field: 'attributes.health.0',
							displayName: 'Health',
							headerClass: 'headerLeftCorner',
							cellClass: 'cellLeftCorner'
						}, {
							field: 'attributes.userNames.1',
							displayName: 'Right Corner',
							headerClass: 'headerRightCorner',
							cellClass: 'cellRightCorner'
						}, {
							field: 'attributes.hexNames.1',
							displayName: 'Fighter',
							headerClass: 'headerRightCorner',
							cellClass: 'cellRightCorner'
						}, {
							field: 'attributes.health.1',
							displayName: 'Health',
							headerClass: 'headerRightCorner',
							cellClass: 'cellRightCorner'
						}]
					};

					$scope.onMatchesLoaded = function(matches) {
						var matchesArr = matches.toArray();
						var hexes = [];
						var match;
						for(var i = 0; i < matchesArr.length; i++) {
							match = matchesArr[i];
							$scope.matches.push(match);
						}

						console.log('matches:', $scope.matches);
					}
				}
			}
		}]);
	}
);
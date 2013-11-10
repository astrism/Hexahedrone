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
					var Match = Parse.Object.extend('Match');
					var MatchCollection = Parse.Collection.extend({
						model: Match
					});
					var query = new Parse.Query(Match);
					query.limit(100);
					var collection = query.collection();
					var promise = collection.fetch();
					promise.then($scope.onMatchesLoaded);
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
						$scope.matches = matches.models.slice();
						console.log('matches:', $scope.matches);
						$scope.$digest();
					}
				}
			}
		}]);
	}
);
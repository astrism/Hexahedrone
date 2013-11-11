define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.controller('stats.latest', function($scope) {
				$scope.matches =[];
				$scope.gridOptions = {
					data: 'matches',
					enableRowSelection: false,
					columnDefs: [
					{
						field: 'attributes.winner.attributes.username',
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
						field: 'attributes.health.1',
						displayName: 'Health',
						headerClass: 'headerRightCorner',
						cellClass: 'cellRightCorner'
					}, {
						field: 'attributes.hexNames.1',
						displayName: 'Fighter',
						headerClass: 'headerRightCorner',
						cellClass: 'cellRightCorner'
					}, {
						field: 'attributes.userNames.1',
						displayName: 'Right Corner',
						headerClass: 'headerRightCorner',
						cellClass: 'cellRightCorner'
					}, {
						field: 'createdAt',
						cellFilter: 'date:"d/M ha"',
						displayName: 'Time'
					}]
				};

				// public
				$scope.onMatchesLoaded = function(matches) {
					$scope.matches = matches.models.slice();
					console.log('matches:', $scope.matches);
					$scope.$digest();
				}

				// init
				var Match = Parse.Object.extend('Match');
				var query = new Parse.Query(Match);
				query.limit(25);
				query.include('winner');
				query.descending('createdAt');
				var collection = query.collection();
				var promise = collection.fetch();
				promise.then($scope.onMatchesLoaded);
			}
		);
	}
);
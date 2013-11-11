define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.controller('stats.worst', function($scope) {
				$scope.gridOptions = {
					data: 'hexes',
					enableRowSelection: false,
					columnDefs: [
					{
						field: 'attributes.owner.attributes.username',
						displayName: 'Breeder'
					}, {
						field: 'attributes.name',
						displayName: 'Name'
					}, {
						field: 'attributes.wins',
						displayName: 'Wins'
					}, {
						field: 'attributes.losses',
						displayName: 'Losses'
					}]
				};

				// public
				$scope.onHexesLoaded = function(hexes) {
					$scope.hexes = hexes.models.slice();
					console.log('hexes:', $scope.hexes);
					$scope.$digest();
				}

				// init
				var Hex = Parse.Object.extend('Hex');
				var query = new Parse.Query(Hex);
				query.limit(100);
				query.include('owner');
				query.descending('losses');
				var collection = query.collection();
				var promise = collection.fetch();
				promise.then($scope.onHexesLoaded);
			}
		);
	}
);
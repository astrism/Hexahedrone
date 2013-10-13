// reference the module we declared earlier
angular.module('ExternalDataServices')

// add a factory
.factory('MatchService', ['ParseQueryAngular', function(ParseQueryAngular) {

	var Match = Parse.Object.extendAngular({
		className:"Match",
		setFighters: function(newFighters) {
			var fighters = [],
			fighter;
			for(var i = 0; i < newFighters.length; i++)
			{
				fighter = newFighters[i];
				fighters.push(fighter.id);
			}
			this.set('fighters', fighters);
			return this;
		},
		setHealth: function(newFighters) {
			var health = {},
			fighter;
			for(var i = 0; i < newFighters.length; i++)
			{
				fighter = newFighters[i];
				fighters[fighter.id] = fighter.health;
			}
			this.set('health', fighters);
			return this;
		},
		parseDestroy:function(){
			return ParseQueryAngular(this,{functionToCall:"destroy"});
		}
	});

	var Matches = Parse.Collection.extendAngular({
		model: Match,
		comparator: function(model) {
			return -model.createdAt.getTime();
		},
		addMatch: function(fighters) {
	 		// save request_id to Parse
	 		var _this = this;

			var match = new Match;
			match.setFighters(fighters);

			// use the extended Parse SDK to perform a save and return the promised object back into the Angular world
			return match.saveParse().then(function(data){
				_this.add(data);
			})
	 	},
	 	removeMatch:function(match) {
	 		if (!this.get(match)) return false;
	 		var _this = this;
	 		return match.destroyParse().then(function(){
	 			_this.remove(match);
	 		});
	 	}
	});

	// Return a simple API : model or collection.
	return {
		model: Match,
		collection: Matches
	};

}]);
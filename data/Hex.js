// reference the module we declared earlier
angular.module('ExternalDataServices')

// add a factory
.factory('HexService', ['ParseQueryAngular', function(ParseQueryAngular) {

	var Hex = Parse.Object.extendAngular({
		className:"Hex",
		setName: function(name) {
			this.set('name',name);
			return this;
		},
		setActions: function(move) {
			this.set('scaryMove',move);
			return this;
		},
		parseDestroy:function(){
			return ParseQueryAngular(this,{functionToCall:"destroy"});
		}
	});

	var Hexes = Parse.Collection.extendAngular({
		model: Hex,
		comparator: function(model) {
			return -model.createdAt.getTime();
		},
		addHex: function() {
	 		// save request_id to Parse
	 		var _this = this;

			var hex = new Hex;

			// use the extended Parse SDK to perform a save and return the promised object back into the Angular world
			return hex.saveParse().then(function(data){
				_this.add(data);
			})
	 	},
	 	removeHex:function(hex) {
	 		if (!this.get(hex)) return false;
	 		var _this = this;
	 		return hex.destroyParse().then(function(){
	 			_this.remove(hex);
	 		});
	 	}
	});

	// Return a simple API : model or collection.
	return {
		model: Hex,
		collection: Hexes
	};

}]);
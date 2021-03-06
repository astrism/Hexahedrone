define([
	'app'
	],
	function(app) {

		app.controller('sim', function ($scope) {

			$scope.togglePause = function() {
				$scope.game.paused = !$scope.game.paused;
			}

			$scope.onPauseChange = function (newValue, oldValue){
				$scope.paused = newValue;
			}

			$scope.onDestroy = function() {
				$scope.game.paused = true;
				$scope.game.raf.stop();
				$scope.game.destroy();
				console.log('destroyed sim');
			}

			var BasicBox, Phaser;
			require([
				'vn/phaser',
				'gm/BasicBox'
				],
				function(PhaserDef, BasicBoxDef) {
					Phaser = PhaserDef;
					BasicBox = BasicBoxDef;
					initGame();
				}
			);

			function initGame() {
				//loaded and can be used here now.
				$scope.game = new Phaser.Game(800, 
											600, 
											Phaser.AUTO, 
											'sim', 
											{ 
												preload: preload, 
												create: create, 
												update: update,
												render: render 
											}
										);
				$scope.$watch('game.paused', $scope.onPauseChange);
			}

			// Constants
			var SPRITE_FLOOR = 'floor';

			function preload() {
				BasicBox.preload($scope.game);
			}

			// objects
			$scope.paused = false;
			$scope.gameOver = false;
			$scope.boxes = [];
			$scope.hexesById = {};
			$scope.boxesById = {};
			$scope.boxA;
			$scope.boxB;

			function create() {

				$scope.game.stage.backgroundColor = '#FFFFFF';
				$scope.game.stage.scale = 0.5;
				$scope.game.paused = true;

				loadHexes();
			}

			// temporary locations till we have arenas
			var locations = [
				200,
				600,
				400,
				500,
				300
			]

			function loadHexes() {
				var Hex = Parse.Object.extend("Hex");
				var query = new Parse.Query(Hex);
				query.include('owner');
				var hexesPromise = query.find();
				hexesPromise.then(onHexesLoaded);
			}
			// The Reaping
			function onHexesLoaded(hexes) {
				$scope.hexes = hexes;

				var playersPerMatch = 2,
				// put them on the floor, TODO: Find a better solution for positioning on the floor
				yPos = $scope.game.world.height - 100,
				// grab a copy of the parse data
				availableHexes = hexes.slice(),
				rand, 
				data, 
				box;

				_.each(hexes, function(hex, index, list) {
					$scope.hexesById[hex.id] = hex;
				});

				for(var i= 0; i < playersPerMatch; i++) {
					// choose/create random piece from selection of available pieces
					rand = _.random(availableHexes.length - 1);
					data = availableHexes[rand];
					box = new BasicBox(data.id, data.get('name'), locations[i], yPos, data.get('actions'));
					// initialize
					box.createWithGame($scope.game);
					// add to list of boxes
					$scope.boxes.push(box);
					// remove the chosen piece
					availableHexes.splice(rand, 1);

					if(availableHexes.length === 0)
						break;
				}

				if($scope.boxes.length > 1) {
					for(var i = 0; i < $scope.boxes.length; i++)
					{
						var box = $scope.boxes[i];
						var opponent = randOpponent(box);
						box.setTarget(opponent);
						$scope.boxesById[box.id] = box;
					}
				}

				// start game
				$scope.game.paused = false;
			}

			// pick random opponent who is not the innocent
			function randOpponent(innocent) {
				var rand = _.random($scope.boxes.length - 2);
				var innocentIndex = $scope.boxes.indexOf(innocent);
				var opponent;
				if(rand >= innocentIndex)
					opponent = $scope.boxes[rand + 1];
				else
					opponent = $scope.boxes[rand];
				if(opponent)
					return opponent;
				else
					throw new Error('cant find opponent');
			}

			function update() {
				var gt = $scope.game.time.time;
				if(!$scope.gameOver) {
					// fighter collisions
					$scope.game.physics.collide($scope.boxes[0].sprite, $scope.boxes[1].sprite, onCollide);

					var box;
					for(var i = 0; i < $scope.boxes.length; i++)
					{
						box = $scope.boxes[i];
						box.update(gt);
					}
				} else {
					$scope.game.physics.collide($scope.boxes[0].sprite, $scope.boxes[1].sprite);
				}
			}

			function render() {

				// $scope.game.debug.renderRectangle($scope.boxA.sprite.body);
				// $scope.game.debug.renderRectangle($scope.boxB.sprite.body);

			}

			function onCollide(spriteA, spriteB) {
				if(!$scope.gameOver) {
					var velA = Math.abs(spriteA.velocity.x);
					var velB = Math.abs(spriteB.velocity.x);
					// console.log('a:', Math.round(velA), 'b:', Math.round(velB));

					if(Math.abs(velA - velB) > 0) {
					// console.log('spriteA.velocity.x:', Math.abs(spriteA.velocity.x));
					// console.log('spriteB.velocity.x:', Math.abs(spriteB.velocity.x));
					// console.log('veldiff:', Math.abs(velA - velB));

						var boxA = $scope.boxesById[spriteA.name];
						var boxB = $scope.boxesById[spriteB.name];
						// injured object is moving faster due to collision?
						if(velA < velB) {
							// console.log('injure B');
							if(spriteA.bottomLeft.y < spriteB.topLeft.y) {
								console.log('head stomp on B');
								boxA.rebound();
								boxB.stomp(15);
							}
							console.log('injure B');
							boxB.injure(5);
							boxA.charge();
						} else {
							// console.log('injure A');
							if(spriteB.bottomLeft.y < spriteA.topLeft.y) {
								console.log('head stomp on A');
								boxB.rebound();
								boxA.stomp(15);
							}
							console.log('injure A');
							boxA.injure(5);
							boxB.charge();
						}

						// death check
						if(boxA.dead || boxB.dead)
							endBattle(boxA, boxB);
					}
				}
			}

			function endBattle(boxA, boxB) {
				console.log('battle over');
				var hexA = $scope.hexesById[boxA.id];
				var hexB = $scope.hexesById[boxB.id];

				if(boxA.dead && boxB.dead) {
					//no change to wins/losses if both are dead
					hexA.increment('ties');
					hexB.increment('ties');
				} else {
					var winner;

					if(boxA.dead) {
						winner = hexB;
						hexA.increment('losses');
						hexB.increment('wins');
					} else if(boxB.dead) {
						winner = hexA;
						hexA.increment('wins');
						hexB.increment('losses');
					}
					hexA.save();
					hexB.save();
				}

				var Match = Parse.Object.extend('Match');
				var newMatch = new Match();
				newMatch.set('hexes', [boxA.id, boxB.id]);
				newMatch.set('hexNames', [boxA.name, boxB.name]);
				newMatch.set('health', [boxA.health, boxB.health]);
				newMatch.set('userIds', [hexA.get('owner').id, hexB.get('owner').id]);
				newMatch.set('userNames', [hexA.get('owner').get('username'), hexB.get('owner').get('username')]);
				if(winner) {
					newMatch.set('winner', winner.get('owner'));
				}
				newMatch.save().then(
					function(savedMatch) {
						console.log('match created with id:', savedMatch.id);
					}, function(error) {
						console.log('error creating match', error);
					});

				// notify box
				boxA.endGame(boxB.dead);
				boxB.endGame(boxA.dead);

				$scope.gameOver = true;

				// timer for next battle
				setTimeout(startNewBattle, 2500);
			}

			function startNewBattle() {
				$scope.game.paused = true;
				for(var i= 0; i < $scope.boxes.length; i++)
					$scope.boxes[i].destroy();
				$scope.boxes = [];
				$scope.boxesById = {};
				loadHexes();

				$scope.gameOver = false;
			}

			$scope.$on('$destroy', $scope.onDestroy);
		});
	}
);

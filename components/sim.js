hexahedrone.directive('sim', ['HexService', function(HexService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/sim.html',
		replace: true,
		link: function($scope, $element) {
			requirejs(['vn/phaser',
				'js/config',
				'js/Box',
				'js/BasicBox'
				],
				initGame
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
			$scope.boxA;
			$scope.boxB;
			$scope.boxAWins = 0;
			$scope.boxBWins = 0;

			function create() {

				$scope.game.stage.backgroundColor = '#FFFFFF';
				$scope.game.stage.scale = 0.5;
				$scope.game.paused = true;

				var hexes = new HexService.collection();
				var hexesPromise = hexes.load();
				hexesPromise.then(loadHexes)
			}

			// The Reaping
			function loadHexes(hexes) {
				var aData = hexes.models[0];
				var yPos = $scope.game.world.height - 100;
				$scope.boxA = new BasicBox(aData.get('name'), 200, yPos, aData.get('actions'));
				$scope.boxA.createWithGame($scope.game);

				var bData = hexes.models[1];
				$scope.boxB = new BasicBox(bData.get('name'), $scope.game.world.width - 300, yPos, bData.get('actions'));
				$scope.boxB.createWithGame($scope.game);

				// fued
				$scope.boxA.setTarget($scope.boxB);
				$scope.boxB.setTarget($scope.boxA);

				// start game
				$scope.game.paused = false;
			}

			function update() {
				var gt = $scope.game.time.time
				if(!$scope.gameOver) {
					// fighter collisions
					$scope.game.physics.collide($scope.boxA.sprite, $scope.boxB.sprite, onCollide);
					$scope.boxA.update(gt);
					if($scope.boxA.currentAction)
						document.getElementById('boxAAttack').innerHTML = 'move: ' + $scope.boxA.currentAction.name;
					document.getElementById('boxAHealth').innerHTML = 'health: ' + Math.round($scope.boxA.health);
					$scope.boxB.update(gt);
					if($scope.boxB.currentAction)
						document.getElementById('boxBAttack').innerHTML = 'move: ' + $scope.boxB.currentAction.name;
					document.getElementById('boxBHealth').innerHTML = 'health: ' + Math.round($scope.boxB.health);
				} else {
					$scope.game.physics.collide($scope.boxA.sprite, $scope.boxB.sprite);
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

						// injured object is moving faster due to collision?
						if(velA < velB) {
							// console.log('injure B');
							if($scope.boxA.sprite.bottomLeft.y < $scope.boxB.sprite.topLeft.y) {
								console.log('head stomp on B');
								$scope.boxA.rebound();
								$scope.boxB.stomp(15);
							}
							console.log('injure B');
							$scope.boxB.injure(5);
							$scope.boxA.charge();
						} else {
							// console.log('injure A');
							if($scope.boxB.sprite.bottomLeft.y < $scope.boxA.sprite.topLeft.y) {
								console.log('head stomp on A');
								$scope.boxB.rebound();
								$scope.boxA.stomp(15);
							}
							console.log('injure A');
							$scope.boxA.injure(5);
							$scope.boxB.charge();
						}

						// death check
						if($scope.boxA.dead || $scope.boxB.dead) {
							console.log('game over');

							// notify box
							$scope.boxA.endGame($scope.boxB.dead);
							$scope.boxB.endGame($scope.boxA.dead);

							//record win
							if($scope.boxB.dead) {
								$scope.boxAWins++;
								document.getElementById('boxAWins').innerHTML = 'wins: ' + $scope.boxAWins;
							}
							if($scope.boxA.dead) {
								$scope.boxAWins++;
								document.getElementById('boxBWins').innerHTML = 'wins: ' + $scope.boxAWins;
							}
							$scope.gameOver = true;

							// timer for next battle
							setTimeout(startNewBattle, 2500);
						}
					}
				}
			}

			function startNewBattle() {
				$scope.boxA.restart();
				$scope.boxB.restart();

				$scope.gameOver = false;
			}

			$scope.$on('$destroy', $scope.onDestroy);
		},
		controller: function($scope, $element) {

			$scope.togglePause = function() {
				$scope.game.paused = !$scope.game.paused;
			}

			$scope.onPauseChange = function(newValue, oldValue){
				$scope.paused = newValue;
			}

			$scope.onDestroy = function() {
				$scope.game.paused = true;
				$scope.game.raf.stop();
				$scope.game.destroy();
				console.log('destroyed sim');
			}
		}
	}
}]);

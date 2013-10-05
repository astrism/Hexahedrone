hexahedrone.directive('sim', function() {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'sim.html',
		replace: true,
		link: function($scope, $element) {
			requirejs(['vn/phaser',
				'js/config',
				'js/Box',
				'js/BasicBox'
				],
				function () {
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
				}
			);

			// Constants
			var SPRITE_FLOOR = 'floor';

			function preload() {
				BasicBox.preload($scope.game);
			}

			// objects
			var gameOver = false;
			var boxA;
			var boxB;
			var boxAWins = 0;
			var boxBWins = 0;

			function create() {
				Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);

				$scope.game.stage.backgroundColor = '#FFFFFF';
				$scope.game.stage.scale = 0.5;

				var yPos = $scope.game.world.height - 100;
				boxA = new BasicBox('A', 200, yPos);
				boxA.createWithGame($scope.game);

				boxB = new BasicBox('B', $scope.game.world.width - 300, yPos);
				boxB.createWithGame($scope.game);

				// fued
				boxA.setTarget(boxB);
				boxB.setTarget(boxA);
			}

			function update() {
				var gt = $scope.game.time.time
				if(!gameOver) {
					// fighter collisions
					$scope.game.physics.collide(boxA.sprite, boxB.sprite, onCollide);
					boxA.update(gt);
					if(boxA.currentAction)
						document.getElementById('boxAAttack').innerHTML = 'move: ' + boxA.currentAction.name;
					document.getElementById('boxAHealth').innerHTML = 'health: ' + Math.round(boxA.health);
					boxB.update(gt);
					if(boxB.currentAction)
						document.getElementById('boxBAttack').innerHTML = 'move: ' + boxB.currentAction.name;
					document.getElementById('boxBHealth').innerHTML = 'health: ' + Math.round(boxB.health);
				} else {
					$scope.game.physics.collide(boxA.sprite, boxB.sprite);
				}
			}

			function render() {

				// $scope.game.debug.renderRectangle(boxA.sprite.body);
				// $scope.game.debug.renderRectangle(boxB.sprite.body);

			}

			function onCollide(spriteA, spriteB) {
				if(!gameOver) {
					var velA = Math.abs(spriteA.velocity.x);
					var velB = Math.abs(spriteB.velocity.x);
					// console.log('a:', Math.round(velA), 'b:', Math.round(velB));

					if(Math.abs(velA - velB) > 100) {
					// console.log('spriteA.velocity.x:', Math.abs(spriteA.velocity.x));
					// console.log('spriteB.velocity.x:', Math.abs(spriteB.velocity.x));
					// console.log('veldiff:', Math.abs(velA - velB));

						// injured object is moving faster due to collision?
						if(velA < velB) {
							// console.log('injure B');
							if(boxA.sprite.bottomLeft.y < boxB.sprite.topLeft.y) {
								console.log('head stomp on B');
								boxA.rebound();
								boxB.stomp(15);
							}
							console.log('injure B');
							boxB.injure(5);
							boxA.charge();
						} else {
							// console.log('injure A');
							if(boxB.sprite.bottomLeft.y < boxA.sprite.topLeft.y) {
								console.log('head stomp on A');
								boxB.rebound();
								boxA.stomp(15);
							}
							console.log('injure A');
							boxA.injure(5);
							boxB.charge();
						}

						// death check
						if(boxA.dead || boxB.dead) {
							console.log('game over');

							// notify box
							boxA.endGame(boxB.dead);
							boxB.endGame(boxA.dead);

							//record win
							if(boxB.dead) {
								boxAWins++;
								document.getElementById('boxAWins').innerHTML = 'wins: ' + boxAWins;
							}
							if(boxA.dead) {
								boxBWins++;
								document.getElementById('boxBWins').innerHTML = 'wins: ' + boxBWins;
							}
							gameOver = true;

							// timer for next battle
							setTimeout(startNewBattle, 2500);
						}
					}
				}
			}

			function startNewBattle() {
				boxA.restart();
				boxB.restart();

				gameOver = false;
			}


			$scope.togglePause = function() {
				$scope.game.paused = !$scope.game.paused;
			}
		}
	}
});
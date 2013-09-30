(function () {

	var game = new Phaser.Game(800, 
								600, 
								Phaser.AUTO, 
								'', 
								{ 
									preload: preload, 
									create: create, 
									update: update,
									render: render 
								}
							);

	// Constants

	function preload() {
		BasicBox.preload(game);
	}

	// objects
	var gameOver = false;
	var boxA;
	var boxB;
	var boxAWins = 0;
	var boxBWins = 0;

	function create() {
		console.log('create');
		game.stage.backgroundColor = '#FFFFFF';
		game.stage.scale = 0.5;

		var yPos = game.world.height - 100;
		boxA = new BasicBox('A', 200, yPos);
		boxA.createWithGame(game);

		boxB = new BasicBox('B', game.world.width - 300, yPos);
		boxB.createWithGame(game);

		// fued
		boxA.setTarget(boxB);
		boxB.setTarget(boxA);
		boxA.takeAction();
		boxB.takeAction();
	}

	function update() {
		if(!gameOver) {
			game.physics.collide(boxA.sprite, boxB.sprite, onCollide);
			boxA.update();
			document.getElementById('boxAAttack').innerHTML = 'move: ' + boxA.currentAction.name;
			document.getElementById('boxAHealth').innerHTML = 'health: ' + Math.round(boxA.health);
			boxB.update();
			document.getElementById('boxBAttack').innerHTML = 'move: ' + boxB.currentAction.name;
			document.getElementById('boxBHealth').innerHTML = 'health: ' + Math.round(boxB.health);
		} else {
			game.physics.collide(boxA.sprite, boxB.sprite);
		}
	}

	function render() {

		// game.debug.renderRectangle(boxA.sprite.body);
		// game.debug.renderRectangle(boxB.sprite.body);

	}

	function onCollide(spriteA, spriteB) {
		if(!gameOver) {
			var velA = Math.abs(spriteA.velocity.x) + Math.abs(spriteA.velocity.y);
			var velB = Math.abs(spriteB.velocity.x) + Math.abs(spriteB.velocity.y);
			// console.log('a:', Math.round(velA), 'b:', Math.round(velB));
			// injured object is moving faster due to collision?
			if(velA < velB) {
				// console.log('injure B');
				boxB.injure(velA - velB);
				boxA.charge();
			} else {
				// console.log('injure A');
				boxA.injure(velB - velA);
				boxB.charge();
			}

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

	function startNewBattle() {
		boxA.restart();
		boxB.restart();

		gameOver = false;
	}





})();
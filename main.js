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

	function create() {
		console.log('create');
		game.stage.backgroundColor = '#FFFFFF';
		game.stage.scale = 0.5;

		boxA = new BasicBox('boxA', 200, 0);
		boxA.createWithGame(game);

		boxB = new BasicBox('boxB', game.world.width - 200, 0);
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
			if(velA < velB) {
				boxB.injure(velA - velB);
				boxA.charge();
			} else {
				boxA.injure(velB - velA);
				boxB.charge();
			}

			if(boxA.dead || boxB.dead) {
				console.log('game over');
				boxA.endGame(boxB.dead);
				boxB.endGame(boxA.dead);
				gameOver = true;
			}
		}

	}

})();
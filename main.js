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
	var boxA;
	var boxB;

	function create() {
		console.log('create');
		game.stage.backgroundColor = '#FFFFFF';
		game.stage.scale = 0.5;

		boxA = new BasicBox(200, 0);
		boxA.initWithGame(game);

		boxB = new BasicBox(game.world.width - 200, 0);
		boxB.initWithGame(game);

		// fued
		boxA.setTarget(boxB);
		boxB.setTarget(boxA);
		boxA.takeAction();
		boxB.takeAction();
	}

	function update() {
        game.physics.collide(boxA.sprite, boxB.sprite);
		boxA.update();
		document.getElementById('boxAAttack').innerHTML = 'move: ' + boxA.currentAction.name;
		document.getElementById('boxAHealth').innerHTML = 'health: ' + boxA.health;
		boxB.update();
		document.getElementById('boxBAttack').innerHTML = 'move: ' + boxB.currentAction.name;
		document.getElementById('boxBHealth').innerHTML = 'health: ' + boxB.health;
	}

	function render() {

		// game.debug.renderRectangle(boxA.sprite.body);
		// game.debug.renderRectangle(boxB.sprite.body);

	}

})();
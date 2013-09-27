function BasicBox(originX, originY) {
	Box.call(this, originX, originY);

	this.currentAction = null;
	this.nextAction = this.DEFAULT_ACTIONS.idle;
	this.actionData = this.DEFAULT_ACTIONS;
	this.attackActions = [];
	this.direction = 1;
}

// extend
BasicBox.prototype = new Box();
BasicBox.prototype.constructor = BasicBox;

// constants
BasicBox.prototype.SPRITE_BOX = 'box';
BasicBox.prototype.ACTION_IDLE = 'idle';
BasicBox.prototype.DEFAULT_ACTIONS = {
	'idle' : {
		// animation: null,
		delay: 1000
	}, 
	attack: {
		'jump' : {
			// animation: null,
			delay: {
				min: 1000, 
				max: 1500
			},
			velocityX: {
				min: 100,
				max: 250
			},
			velocityY: {
				min: 10,
				max: 300
			}
		}
	}
}

// static methods
BasicBox.preload = function(game) {
	game.load.image(this.SPRITE_BOX, 'img/Box.png');
}

// instance methods
BasicBox.prototype.initWithGame = function(game) {
	console.log('init basic box');

	//parse actions
	for(action in this.actionData.attack)
		this.attackActions.push(action);

	this.sprite = game.add.sprite(this.spriteX, this.spriteY, this.SPRITE_BOX);
	this.sprite.y = game.world.height - this.sprite.height;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.gravity.y = 10;
	this.sprite.body.bounce.setTo(0.2, 0.4);
	this.sprite.anchor.x = 0.5;
}

BasicBox.prototype.update = function() {
	// if(this.sprite.velocity.y > 0 && this.sprite.velocity.y < 1) {
	// 	this.sprite.velocity.y = 0;
	// 	console.log(this.sprite.velocity.y);
	// }

}

BasicBox.prototype.setTarget = function(newTarget) {
	this.target = newTarget;
}

BasicBox.prototype.takeAction = function() {
	var curr = this.currentAction = this.nextAction;
	console.log('take action:', curr);

	// find target
	// TODO: determin fight or flee
	var diff = this.sprite.x < this.target.sprite.x;
	if(diff > 0)
		this.direction = 1;
	else
		this.direction = -1;

	//assign next or random
	if(curr.next){
		this.nextAction = curr.next;
	} else {
		this.nextAction = this.getRandomAction();
	}

	// assign velocities
	if(curr.velocityX)
		this.sprite.velocity.x = this.getValue(curr.velocityX, this.direction);

	if(curr.velocityY)
		this.sprite.velocity.y = this.getValue(curr.velocityY, this.direction);

	nextAction = this.DEFAULT_ACTIONS[action];
	setTimeout(_.bind(this.takeAction, this), 
				this.getValue(curr.delay)
				);
}

BasicBox.prototype.getRandomAction = function() {
	var max = this.attackActions.length - 1;
	var rand = Math.floor(Math.random() * max);
	var actionKey = this.attackActions[rand];
	var actionData = this.actionData.attack[actionKey];
	return actionData;
}

BasicBox.prototype.getValue = function(rangeSet, direction) {
	var randValue = Math.random() * (rangeSet.max - rangeSet.min) + rangeSet.min;
	if(direction)
		randValue = randValue * direction;
	return randValue;
}



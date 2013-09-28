function BasicBox(originX, originY) {
	Box.call(this, originX, originY);

	this.currentAction = null;
	this.nextAction = this.DEFAULT_ACTIONS.idle;
	this.actionData = this.DEFAULT_ACTIONS;
	this.attackActions = [];
	this.dodgeActions = [];
	this.direction = 1;
	this.health = 100;
	this.fear = 0;
	this.dead = false;
	this.gameOver = false;
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
		name: 'idle',
		delay: {
			min: 500,
			max: 700
		}
	}, 
	'happyDance' : {
		// animation: null,
		name: 'happy dance',
		delay: {
			min: 1700,
			max: 1700
		},
		velocityX: {
			min: -10,
			max: 10
		},
		velocityY: {
			min: 100,
			max: 150
		},
		next: 'happyDance'
	}, 
	'jumpBack' : {
		// animation: null,
		name: 'jump back',
		type: 'dodge',
		delay: {
			min: 1200, 
			max: 2000
		},
		velocityX: {
			min: -100,
			max: -250
		},
		velocityY: {
			min: 100,
			max: 200
		}
	},
	'jumpAhead' : {
		// animation: null,
		name: 'jump ahead',
		type: 'dodge',
		delay: {
			min: 1200, 
			max: 2000
		},
		velocityX: {
			min: 100,
			max: 250
		},
		velocityY: {
			min: 100,
			max: 200
		}
	},
	'dash' : {
		// animation: null,
		name: 'dash',
		type: 'attack',
		delay: {
			min: 700, 
			max: 1000
		},
		velocityX: {
			min: 100,
			max: 350
		},
		velocityY: {
			min: 10,
			max: 20
		}
	},
	'jumpDash' : {
		// animation: null,
		name: 'jumpdash',
		type: 'attack',
		delay: {
			min: 700, 
			max: 1000
		},
		velocityX: {
			min: 100,
			max: 350
		},
		velocityY: {
			min: 40,
			max: 50
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
	for(actionName in this.actionData){
		var action = this.actionData[actionName];
		if(action.type) {
			if(action.type === 'attack')
				this.attackActions.push(actionName);
			else if(action.type === 'dodge')
				this.dodgeActions.push(actionName);
		}
	}

	this.sprite = game.add.sprite(this.spriteX, this.spriteY, this.SPRITE_BOX);
	this.sprite.y = game.world.height - this.sprite.height;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.gravity.y = 10;
	this.sprite.body.bounce.setTo(0.2, 0.4);
	this.sprite.body.drag = {
		x: 50,
		y: 0
	};
	// this.sprite.anchor.x = 0.5;
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
	if(this.dead) return; //no more actions

	var curr = this.currentAction = this.nextAction;
	// find target
	// TODO: determin fight or flee
	var diff = this.sprite.x < this.target.sprite.x;
	if(diff > 0)
		this.direction = 1;
	else
		this.direction = -1;

	//assign next or random
	if(curr.next){
		this.nextAction = this.actionData[curr.next];
	} else {
		this.nextAction = this.getRandomAttack();
	}

	// assign velocities
	if(curr.velocityX)
		this.sprite.velocity.x = this.getValue(curr.velocityX, this.direction);

	if(curr.velocityY)
		this.sprite.velocity.y = this.getValue(curr.velocityY, this.direction);

	// nextAction = this.DEFAULT_ACTIONS[action];
	setTimeout(_.bind(this.takeAction, this), 
				this.getValue(curr.delay)
				);
}

BasicBox.prototype.getRandomAttack = function() {
	var max = this.attackActions.length;
	var rand = Math.floor(Math.random() * max);
	var actionKey = this.attackActions[rand];
	var actionData = this.actionData[actionKey];
	if(!actionData) throw new Error('couldnt find action!');
	return actionData;
}

BasicBox.prototype.getRandomDodge = function() {
	var max = this.attackActions.length;
	var rand = Math.floor(Math.random() * max);
	var actionKey = this.attackActions[rand];
	var actionData = this.actionData[actionKey];
	if(!actionData) throw new Error('couldnt find action!');
	return actionData;
}

BasicBox.prototype.getValue = function(rangeSet, direction) {
	var randValue = Math.random() * (rangeSet.max - rangeSet.min) + rangeSet.min;
	if(direction)
		randValue = randValue * direction;
	return randValue;
}

BasicBox.prototype.injure = function(force) {
	this.health -= 12;
	this.health = Math.max(0, this.health);
	this.fear++;
	if(this.health === 0) {
		this.dead = true;
		this.sprite.y += 8;
		this.sprite.velocity.x = 0;
		this.sprite.velocity.y = 0;
		this.sprite.body.collideWorldBounds = false;
		this.sprite.body.gravity.y = 0;
	}
}

BasicBox.prototype.charge = function(force) {
	this.fear--;
}

BasicBox.prototype.endGame = function(won) {
	this.gameOver = true;
	if(won) 
		this.nextAction = this.actionData['happyDance'];
}

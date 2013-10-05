function BasicBox(boxName, originX, originY) {
	Box.call(this, originX, originY);

	this.name = boxName;
	this.currentAction = null;
	this.nextAction = BasicBox.DEFAULT_ACTIONS.idle;
	this.actionData = BasicBox.DEFAULT_ACTIONS;
	this.attackActions = [];
	this.dodgeActions = [];
	this.direction = 1;
	this.health = 100;
	this.fear = 0;
	this.dead = false;
	this.gameOver = false;
	this.defaultWidth = 0;
	this.defaultHeight = 0;
	this.nextActionTime = 0;
	this.target = null;
	this.stunned = false;
	this.stunnedTime = 0;
	this.currentTime = 0;
}

// extend
BasicBox.prototype = new Box();
BasicBox.prototype.constructor = BasicBox;

// constants
BasicBox.SPRITE_BOX = 'box';
BasicBox.ANIM_IDLE = 'idle';
BasicBox.ANIM_IDLE_FRAMES = ['idle/Box_0000_idle'];
BasicBox.ANIM_DEATH = 'death';
BasicBox.ANIM_DEATH_FRAMES = ['death/Box_0000_death'];
BasicBox.ANIM_STUN = 'stun';
BasicBox.ANIM_STUN_FRAMES = ['stun/Box_0000_stun'];
BasicBox.ANIM_INJURY = 'injury';
BasicBox.ANIM_INJURY_FRAMES = ['injury/Box_0001_injury01', 'injury/Box_0002_injury02', 'injury/Box_0003_injury03', 'injury/Box_0004_injury04', 'injury/Box_0005_injury05', 'injury/Box_0006_injury06', 'injury/Box_0007_injury07', 'injury/Box_0008_injury08'];
BasicBox.ACTION_IDLE = 'idle';
BasicBox.DEFAULT_ACTIONS = {
	'idle' : {
		// animation: null,
		name: 'idle',
		delay: {
			min: 500,
			max: 700
		}
	},
	'recoil' : {
		// animation: null,
		name: 'recoil',
		next: 'idle',
		delay: {
			min: 500,
			max: 1000
		},
		velocityX: {
			min: -50,
			max: -100
		}
	},
	'rebound' : {
		// animation: null,
		name: 'rebound',
		next: 'idle',
		delay: {
			min: 7000,
			max: 1000
		},
		velocityX: {
			min: -500,
			max: 500
		},
		velocityY: {
			min: 2000,
			max: 3000
		}
	},
	'happyDance' : {
		// animation: null,
		name: 'happy dance',
		next: 'happyDance',
		delay: {
			min: 1700,
			max: 1700
		},
		velocityX: {
			min: -10,
			max: 10
		},
		velocityY: {
			min: 300,
			max: 350
		}
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
	}/*,
	'headstomp' : {
		// animation: null,
		name: 'headstomp',
		type: 'attack',
		delay: {
			min: 1200,
			max: 1400
		},
		velocityX: {
			min: 100,
			max: 150
		},
		velocityY: {
			min: 2000,
			max: 2200
		}
	}*/
};

// static methods
BasicBox.preload = function(game) {
	game.load.atlas(BasicBox.SPRITE_BOX, 'img/Box.png', 'img/Box.json');
};

// instance methods
BasicBox.prototype.createWithGame = function(game) {
	//parse actions
	var actionName;
	for(actionName in this.actionData){
		var action = this.actionData[actionName];
		if(action.type) {
			if(action.type === 'attack')
				this.attackActions.push(actionName);
			else if(action.type === 'dodge')
				this.dodgeActions.push(actionName);
		}
	}

	//create sprite
	this.sprite = game.add.sprite(this.spriteX, 0, BasicBox.SPRITE_BOX);
	this.defaultWidth = this.sprite.width;
	this.defaultHeight = this.sprite.height;
	this.spriteY = game.world.height - this.defaultHeight;

	//setup sprite animations
	this.sprite.animations.add(BasicBox.ANIM_IDLE, BasicBox.ANIM_IDLE_FRAMES, 24, false, false);
	this.sprite.animations.add(BasicBox.ANIM_INJURY, BasicBox.ANIM_INJURY_FRAMES, 24, false, false);
	this.sprite.animations.add(BasicBox.ANIM_DEATH, BasicBox.ANIM_DEATH_FRAMES, 24, false, false);
	this.sprite.animations.add(BasicBox.ANIM_STUN, BasicBox.ANIM_STUN_FRAMES, 24, false, false);

	// set defaults
	this.setupBox();

	// create text
	var pos = this.sprite.width * 0.5;
	var style = { font: "35px Arial", fill: "#FFFFFF", align: "center" };
	var t = new Phaser.Text(game, pos, pos, this.name, style);
	t.anchor.setTo(0.5, 0.5);
	this.sprite.addChild(t);
};

BasicBox.prototype.setupBox = function() {
	this.sprite.x = this.spriteX;
	this.sprite.y = this.spriteY;
	this.fear = 0;
	this.gameOver = false;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.gravity.y = 80;
	this.sprite.body.bounce.setTo(0.2, 0.4);
	this.sprite.body.angularDamping = 100;
	this.sprite.body.drag = {
		x: 400,
		y: 0
	};
	this.health = 100;
	if(this.dead) {
		this.dead = false;
		this.takeActionNow('idle');
	} else {
		this.nextAction = this.actionData['idle'];
	}
	this.sprite.animations.play(BasicBox.ANIM_IDLE, 24, false);
}

BasicBox.prototype.update = function(gt) {
	this.currentTime = gt;
	// if(this.sprite.velocity.y > 0 && this.sprite.velocity.y < 1) {
	// 	this.sprite.velocity.y = 0;
	// 	console.log(this.sprite.velocity.y);
	// }
	// if(this.sprite.height < this.defaultHeight) {
	// 	// restore height
	// 	this.sprite.height++;
	// 	this.sprite.y--;
	// }
	if(this.stunned && this.currentTime > this.stunnedTime) {
		this.stunned = false;
		this.sprite.animations.play(BasicBox.ANIM_IDLE, 24, false);
	}

	if(this.target && this.currentTime >= this.nextActionTime)
		this.takeAction();
};

BasicBox.prototype.setTarget = function(newTarget) {
	this.target = newTarget;
};

BasicBox.prototype.takeAction = function() {
	if(this.dead) return; //no more actions

	var curr = this.currentAction = this.nextAction;
	// console.log(this.name, ': ',curr.name);
	// find target
	// TODO: determin fight or flee
	var diff = this.sprite.x < this.target.sprite.x;
	if(diff > 0)
		this.direction = 1;
	else
		this.direction = -1;


	// assign velocities
	if(curr.velocityX)
		this.sprite.velocity.x = this.getValue(curr.velocityX, this.direction);

	if(curr.velocityY)
		this.sprite.velocity.y = this.getValue(curr.velocityY);

	//assign next or random
	if(curr.next){
		this.nextAction = this.actionData[curr.next];
	} else {
		this.nextAction = this.getRandomAttack();
	}
	// set delay
	this.nextActionTime = this.currentTime + this.getValue(curr.delay);
};

BasicBox.prototype.takeActionNow = function(actionKey) {
	var action = this.actionData[actionKey];
	this.nextAction = action;
	this.nextActionTime = this.currentTime;
	this.takeAction(this.nextActionTime);
}

BasicBox.prototype.getRandomAttack = function() {
	var max = this.attackActions.length;
	var rand = Math.floor(Math.random() * max);
	var actionKey = this.attackActions[rand];
	var actionData = this.actionData[actionKey];
	if(!actionData) throw new Error('couldnt find action!');
	return actionData;
};

BasicBox.prototype.getRandomDodge = function() {
	var max = this.attackActions.length;
	var rand = Math.floor(Math.random() * max);
	var actionKey = this.attackActions[rand];
	var actionData = this.actionData[actionKey];
	if(!actionData) throw new Error('couldnt find action!');
	return actionData;
};

BasicBox.prototype.getValue = function(rangeSet, direction) {
	var randValue = Math.random() * (rangeSet.max - rangeSet.min) + rangeSet.min;
	if(direction)
		randValue = randValue * direction;
	return randValue;
};

BasicBox.prototype.injure = function(force) {
	this.health -= force;
	this.health = Math.max(0, this.health);
	this.fear++;
	if(!this.stunned)
		this.sprite.animations.play(BasicBox.ANIM_INJURY, 24, false);
	if(this.health === 0) {
		this.dead = true;
		this.sprite.animations.play(BasicBox.ANIM_DEATH, 24, false);
		console.log(this.sprite.height);
		this.sprite.velocity.x = 0;
		this.sprite.velocity.y = 0;
	}
};

BasicBox.prototype.charge = function(force) {
	// console.log('charge', this.name);
	this.fear--;
	this.recoil();
};

BasicBox.prototype.recoil = function() {
	this.sprite.velocity.x = 0;
	this.takeActionNow('recoil');
}

BasicBox.prototype.endGame = function(won) {
	this.gameOver = true;
	if(won)
		this.takeActionNow('happyDance');
};

BasicBox.prototype.restart = function() {
	// this.sprite.height = this.defaultHeight;
	this.setupBox();
}

BasicBox.prototype.stomp = function(force) {
	console.log('stomp');
	if(!this.stunned) {
		this.stunned = true;
		this.injure(force);
		this.stunnedTime = this.currentTime + 1000;
		this.sprite.animations.play(BasicBox.ANIM_STUN, 24, false);
		// this.sprite.height -= 10;
		// this.sprite.y += 10;
	}
}

BasicBox.prototype.rebound = function() {
	console.log('addd rebound');
	// this.sprite.y -= 100;
	this.sprite.velocity.x = this.sprite.velocity.y = 0;
	this.takeActionNow('rebound');
}
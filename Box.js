function Box(originX, originY) {
	this.sprite = null;
	this.width = 50;
	this.height = 50;
	this.spriteX = originX ? originX : 0;
	this.spriteY = originY ? originY : 0;
}

// constants

// instance methods

// init, do not store game ever
Box.prototype.initWithGame = function(game) {
	console.log('init box');
	//override
	this.sprite = game.add.sprite(this.spriteX, this.spriteY);
}
;(function(exports){
	var Zomb = function(game, settings){
		this.game = game;
		this.x = settings.x;
		this.y = settings.y;
		this.vX = 0;
		this.vY = 0;
		this.width = 120;
		this.height = 120;
		this.cursor = settings.cursor;
		this.maxVel = 10;

		/*
		basically we need to have a different "x" and "y" for the 
		quadtree so that it will check above and to thje left
		for elements, than the actual x and y that we want to move

		*/

		this.connected = [];

		this.cursorAttrStr = 0.2;
		this.friendAvoidDist = 30;
		this.friendAvoidStr = 0.01;
		this.friendAlignDist = 60;
		this.friendAlignStr = 0.005;
		this.edgeVelocity = 30;
		this.friction = 0.90;
	};

	Zomb.prototype = {
		update: function(){
			this.connected = [];
			this.x += this.vX;
			this.y += this.vY;

			var closeZombs = this.game.quadTree.retrieve(this);
			for(var z = 0; z < closeZombs.length; z++){
				if (closeZombs[z] !== this) {
					this.connected.push(closeZombs[z]);
					
					var dist = Math.sqrt(Math.pow(closeZombs[z].x - this.x, 2) + Math.pow(closeZombs[z].y - this.y, 2));

					//seperation
					if(dist < this.friendAvoidDist){
						this.vX -= this.friendAvoidStr * (closeZombs[z].x - this.x);
						this.vY -= this.friendAvoidStr * (closeZombs[z].y - this.y);
					}
					//alignment
					if(dist < this.friendAlignDist) {						
						this.vX += closeZombs[z].vX * this.friendAlignStr;
						this.vY += closeZombs[z].vY * this.friendAlignStr;
					}
					//cohesion
				}
			}
			//mission
			var angle = Math.atan2(
				this.y - this.cursor.y,
				this.x - this.cursor.x
			);
			this.vX -= Math.cos(angle) * this.cursorAttrStr;
			this.vY -= Math.sin(angle) * this.cursorAttrStr;

			if (this.vX > this.maxVel) {
				this.vX = this.maxVel;
			} else if(this.vX < -this.maxVel) {
				this.vX = -this.maxVel;
			}

			if (this.vY > this.maxVel) {
				this.vY = this.maxVel;
			} else if(this.vY < -this.maxVel) {
				this.vY = -this.maxVel;
			}

			this.vX *= this.friction;
			this.vY *= this.friction;			
		},

		draw: function(ctx){
			ctx.fillStyle = "red";
			ctx.fillRect(
				this.x + 55,
				this.y + 55,
				10,
				10
			);
			ctx.strokeStyle = "green";
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.vX, this.y + this.vY);
			ctx.stroke();

		}
	};

	var Cursor = function(game, settings){
		this.game = game;
		this.x = settings.x;
		this.y = settings.y;
		this.oldX = settings.x;
		this.oldY = settings.y;
		this.width = settings.width;
		this.height = settings.height;
		this.vX = 3;
		this.vY = 3;
	};

	Cursor.prototype = {
		update: function(){
			this.x += this.vX;
			this.y += this.vY;
			if (this.x + (this.width) >= this.game.canvas.width) {
				this.vX *= -1;
			} else if (this.x - (this.width) <= 0){
				this.vX *= -1;
			}
			if (this.y + (this.height) >= this.game.canvas.height) {
				this.vY *= -1;
			} else if (this.y - (this.height) <= 0){
				this.vY *= -1;
			}
		},
		draw: function(ctx){
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "blue";
			ctx.moveTo(this.x, this.y - this.height / 2);
			ctx.lineTo(this.x, this.y + this.height / 2);
			ctx.moveTo(this.x - this.width / 2, this.y);
			ctx.lineTo(this.x + this.width / 2, this.y);
			ctx.stroke();
		},
		clear: function(ctx){
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.moveTo(this.x, this.y - this.height / 2);
			ctx.lineTo(this.x, this.y + this.height / 2);
			ctx.moveTo(this.x - this.width / 2, this.y);
			ctx.lineTo(this.x + this.width / 2, this.y);
			ctx.stroke();
		}
	};

	var ZombsGame = function(settings){
		this.frame = 0;
		this.canvas = document.getElementById(settings.canvas);
		this.canvas.height = document.getElementById(settings.canvasContainer).offsetHeight;
		this.canvas.width = document.getElementById(settings.canvasContainer).offsetWidth;
		this.ctx = this.canvas.getContext("2d");
		this.entities = [
			new Cursor(
				this,
				{
					x: 100,
					y: 100,
					width: 10,
					height: 10
				}
			)
		];
		this.quadTree = new QuadTree({
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height
		}, false, 10);
		for(var i = 0; i < 200; i ++) {
			var z = new Zomb(this, {
				x: Math.random() * this.canvas.width,
				y: Math.random() * this.canvas.height,
				cursor: this.entities[0]
			})
			this.entities.push(z);
			this.quadTree.insert(z);
		}
	};

	ZombsGame.prototype = {
		update: function(){
			this.frame ++;
			this.draw(this.ctx);
			this.entities.forEach(function(entity) {
				entity.update();
				entity.draw(this.ctx);
			}.bind(this));
		},
		draw: function(ctx){
			ctx.fillStyle = "black";
			ctx.fillRect(
				0,
				0,
				this.canvas.width,
				this.canvas.height
			);
		}
	};

	exports.ZombsGame = ZombsGame;
})(window);

window.onload = function(){
	window.z = new ZombsGame({
		canvas: "canvas",
		canvasContainer: "canvas-container"
	});
};

var update = function() {
	z.update();
	window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);

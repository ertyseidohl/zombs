;(function(exports){
	var Zomb = function(game, settings){
		this.game = game;
		this.center = settings.center;
		this.size = settings.size;
		this.angle = 0;
		this.cursor = settings.cursor;
		this.speed = 2;
	};

	Zomb.prototype = {
		update: function(dt){
			//seperation
			
			//alignment

			//cohesion

			//mission
			var angle = Math.atan2(
				this.center.y - this.cursor.center.y,
				this.center.x - this.cursor.center.x
			);
			this.angle = angle;
			this.center.x += -Math.cos(angle) * this.speed;
			this.center.y += -Math.sin(angle) * this.speed;
		},

		draw: function(ctx){
			ctx.fillStyle = "red";
			ctx.fillRect(
				this.center.x - this.size.x / 2,
				this.center.y - this.size.y / 2,
				this.size.x,
				this.size.y
			);
		}
	};

	var Cursor = function(game, settings){
		this.game = game;
		this.center = settings.center;
		this.oldCenter = settings.center;
		this.size = settings.size;
		this.angle = 0;
	};

	Cursor.prototype = {
		update: function(dt){
			this.oldCenter = this.center;
			this.center.x += (Math.random() * 30) - 15;
			this.center.y += (Math.random() * 30) - 15;
		},
		draw: function(ctx){
			this.clear(ctx);
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "blue";
			ctx.moveTo(this.center.x, this.center.y - this.size.y / 2);
			ctx.lineTo(this.center.x, this.center.y + this.size.y / 2);
			ctx.moveTo(this.center.x - this.size.x / 2, this.center.y);
			ctx.lineTo(this.center.x + this.size.x / 2, this.center.y);
			ctx.stroke();
		},
		clear: function(ctx){
			ctx.strokeStyle = this.game._backgroundColor;
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.moveTo(this.center.x, this.center.y - this.size.y / 2);
			ctx.lineTo(this.center.x, this.center.y + this.size.y / 2);
			ctx.moveTo(this.center.x - this.size.x / 2, this.center.y);
			ctx.lineTo(this.center.x + this.size.x / 2, this.center.y);
			ctx.stroke();
		}
	};

	var Field = function(game, settings){
		this.game = game;
		this.center = settings.center;
		this.size = settings.size;
		this.angle = 0;
	};

	Field.prototype = {
		update: function(dt){
			if(this.game.frame == 1){
					this.game.coq.entities.create(Cursor, {
					center: { x: 100, y: 100},
					size: { x: 30, y: 30}
				});
			}
			if(this.game.frame % 100 !== 0) return;
			this.game.coq.entities.create(Zomb, {
				center: { x: 100, y: 100},
				size: { x: 10, y: 10},
				cursor: this.game.coq.entities.all(Cursor)[0]
			});
			
			
		},
		draw: function(ctx){
			ctx.strokeStyle = "yellow";
			ctx.strokeRect(
				this.center.x - this.size.x / 2,
				this.center.y - this.size.y / 2,
				this.size.x,
				this.size.y
			);
		}
	};

	var ZombsGame = function(){
		this.frame = 0;

		this.update= function(){
			this.frame ++;
		};

		this.coq = new Coquette(
			this,
			"canvas",
			document.body.clientWidth,
			document.body.clientHeight,
			"#000"
		);

		this.coq.entities.create(Field, {
			size: this.coq.renderer._viewSize,
			center: this.coq.renderer._viewCenter
		});

		
	};

	exports.ZombsGame = ZombsGame;
})(window);

window.onload = function(){
	z = new ZombsGame(false);
};

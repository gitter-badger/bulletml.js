var bmlFiles = [ "sample-xml/[1943]_rolling_fire.bml",
		"sample-xml/[G_DARIUS]_homing_laser.bml",
		"sample-xml/[Guwange]_round_2_boss_circle_fire.bml",
		"sample-xml/[Guwange]_round_3_boss_fast_3way.bml",
		"sample-xml/[Guwange]_round_4_boss_eye_ball.bml",
		"sample-xml/[Progear]_round_1_boss_grow_bullets.bml",
		"sample-xml/[Progear]_round_2_boss_struggling.bml",
		"sample-xml/[Progear]_round_3_boss_back_burst.bml",
		"sample-xml/[Progear]_round_3_boss_wave_bullets.bml",
		"sample-xml/[Progear]_round_4_boss_fast_rocket.bml",
		"sample-xml/[Progear]_round_5_boss_last_round_wave.bml",
		"sample-xml/[Progear]_round_5_middle_boss_rockets.bml",
		"sample-xml/[Progear]_round_6_boss_parabola_shot.bml",
		"sample-xml/[Psyvariar]_X-A_boss_opening.bml",
		"sample-xml/[Psyvariar]_X-A_boss_winder.bml",
		"sample-xml/[Psyvariar]_X-B_colony_shape_satellite.bml",
		"sample-xml/[XEVIOUS]_garu_zakato.bml", "sample-xml/test.bml" ];

enchant();
window.onload = function() {
	var game = new Game();
	game.fps = 60;
	var assets = [ "images/chara0.png", "images/chara6.png", "images/icon1.png" ];
	assets = assets.concat(bmlFiles);
	game.preload(assets);
	game.onload = function() {
		var scene = game.rootScene;

		// 自機
		var player = new Sprite(32, 32);
		player.image = game.assets["images/chara0.png"];
		player.frame = 33;
		player.frameCount = 0;
		player.x = (game.width - player.width) / 2;
		player.y = game.height - 32 - player.height;
		player.speed = 2;
		player.on("enterframe", function() {
			if (this.age % 10 === 0) {
				this.frame = [ 33, 34, 35, 34 ][(this.frameCount += 1) % 4];
			}

			if (game.input.up) {
				this.y -= this.speed;
			} else if (game.input.down) {
				this.y += this.speed;
			}
			if (game.input.left) {
				this.x -= this.speed;
			} else if (game.input.right) {
				this.x += this.speed;
			}

			if (this.x < 0) {
				this.x = 0;
			} else if (game.width - this.width < this.x) {
				this.x = game.width - this.width;
			}
			if (this.y < 0) {
				this.y = 0;
			} else if (game.height - this.height < this.y) {
				this.y = game.height - this.height;
			}

			h.x = player.x + (player.width - h.width) / 2;
			h.y = player.y + (player.height - h.height) / 2;
		});
		scene.addChild(player);
		var h = new Sprite(4, 4);
		(function() {
			h.image = new Surface(4, 4);
			var c = h.image.context;
			var g = c.createRadialGradient(2, 2, 0, 2, 2, 2);
			g.addColorStop(0.0, "#ffffff");
			g.addColorStop(0.8, "#00ff00");
			g.addColorStop(1.0, "rgba(0,255,0,0)");
			c.fillStyle = g;
			c.fillRect(0, 0, 4, 4);
		})();
		scene.addChild(h);

		// 敵
		var enemy = new Sprite(32, 32);
		enemy.image = game.assets["images/chara6.png"];
		enemy.frame = 3;
		enemy.frameCount = 0;
		enemy.x = (game.width - enemy.width) / 2;
		enemy.y = 32;
		enemy.on("enterframe", function() {
			if (this.age % 10 === 0) {
				this.frame = [ 3, 4, 5, 4 ][(this.frameCount += 1) % 4];
			}
		});

		// 攻撃パターンにBulletMLをセット
		enemy.setAttackPattern(
				game.assets["sample-xml/[G_DARIUS]_homing_laser.bml"], {
					target : player,
					onfire : function() {
						console.log("発射! ", this.x, this.y);
					},
					onenterframe : function() {
						var x1 = this.x + this.width / 2;
						var y1 = this.y + this.height / 2;
						var x2 = player.x + player.width / 2;
						var y2 = player.y + player.height / 2;
						var dx = (x1 - x2) * (x1 - x2);
						var dy = (y1 - y2) * (y1 - y2);
						if (dx + dy < 4 * 4) {
							this.parentNode.removeChild(this);
						}
					}
				});
		enemy.on("completeAttack", function() {
			console.log("攻撃再開");
			this.attackPattern.restart();
		});

		scene.addChild(enemy);

		// タッチ操作用パネル
		var ctrlPanel = new Sprite(game.width, game.height);
		ctrlPanel.sense = 1.4;
		ctrlPanel.on("touchstart", function(e) {
			this.startX = e.x;
			this.startY = e.y;
			this.startPlayerX = player.x;
			this.startPlayerY = player.y;
		});
		ctrlPanel.on("touchmove", function(e) {
			player.x = this.startPlayerX + (e.x - this.startX) * this.sense;
			player.y = this.startPlayerY + (e.y - this.startY) * this.sense;

			if (player.x < 0) {
				player.x = this.startPlayerX = 0;
				this.startX = e.x;
			} else if (game.width - player.width < player.x) {
				player.x = this.startPlayerX = game.width - player.width;
				this.startX = e.x;
			}
			if (player.y < 0) {
				player.y = this.startPlayerY = 0;
				this.startY = e.y;
			} else if (game.height - player.height < player.y) {
				player.y = this.startPlayerY = game.height - player.height;
				this.startY = e.y;
			}
		});
		scene.addChild(ctrlPanel);
	};
	game.start();
};

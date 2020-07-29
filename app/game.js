import * as PIXI from 'pixi.js';
import * as particles from "pixi-particles";
import 'howler';
import { collision } from './collision';
import PixiPlugin from 'gsap/PixiPlugin';
import { TweenLite, TimelineMax, Back, Linear, Elastic, scaleX, scaleY } from 'gsap';
PixiPlugin.registerPIXI(PIXI);
let _pixi = require("pixi-particles")

let width = 960;
let height = 640;
let bgx = 0;
let parallaxSpeed = -1.5;
let missileSpeed = 15;
let enemySpeed = 3;
let enemyFollowSpeed = 1;

class Game {
	constructor() {
		this.app = new PIXI.Application({ view: gameCanvas });
		document.querySelector('#GameApp').appendChild(this.app.renderer.view);
		this.selectedject;

		this.app.view.width = width;
		this.app.view.height = height;
		this.app.loader.baseUrl = 'assets';

		this.app.stage.interactive = true;
		this.gameIntances = {
			intro: {},
			select: {},
			game: {},
			gameOver: {}
		};

		this.initScenes();

		this.app.loader
			.add([
				'/img/logo.png',
				'/img/staticbg.jpg',
				'/img/backBG.jpg',
				'/img/hover.json',
				'/img/mid2BG.png',
				'/img/mid1BG.png',
				'/img/frontBG.png',
				'/img/jetFlame.json',
				'/img/spaceship-1.png',
				'/img/enemymissile.png',
				'/img/missile1.png',
				'/img/spaceship-2.png',
				'/img/enemy1.png',
				'/img/enemy2.png',
				'/img/enemy3.png',
				'/img/particle.png',
				'/img/explode.json',
				'/img/gameover.png',
				'/img/tryAgain.png',
				'/img/quit.png',
				'/sounds/exploded.mp3',
				'/sounds/selectCharBg.mp3',
				'/sounds/fire.mp3',
				'/sounds/main-bg.mp3',
				'/sounds/selected.mp3',
				'/sounds/game-over.mp3',
				'/sounds/powerUP.mp3'
				
			])
			.load(() => {
				// this.initGame();
				this.iniIntro();
				this.createHoverAnim();
				this.createAnimFlames();
				this.createAnimExplosion();
			});
	}

	//set-up sounds
	playSound(event, options = { loop: false, mainbg: false }) {
		let soundPath = '';
		switch (event) {
			case 'fire':
				soundPath = 'assets/sounds/fire.mp3';
				break;
			case 'selectCharBg':
				soundPath = 'assets/sounds/selectCharBg.mp3';
				break;
			case 'exploded':
				soundPath = 'assets/sounds/exploded.mp3';
				break;
			case 'main-bg':
				soundPath = 'assets/sounds/main-bg.mp3';
				break;
			case 'selected':
				soundPath = 'assets/sounds/selected.mp3';
				break;
			case 'game-over':
				soundPath = 'assets/sounds/game-over.mp3';
				break;
			case 'powerUP':
				soundPath = 'assets/sounds/game-over.mp3';
				break;
			default:
				break;
		}

		if (options.mainbg) {
			this.mainBGSound = new Howl({
				src: [ soundPath ],
				loop: options.mainbg
			});
			this.mainBGSound.play();
		} else {
			this.sound = new Howl({
				src: [ soundPath ],
				loop: options.loop
			});
			this.sound.play();
		}
	}

	stopSound() {
		if (this.sound) {
			this.sound.stop();
		}
	}

	stopmainBGSound() {
		this.mainBGSound.stop();
	}

	//end set-up sounds

	initScenes() {
		for (let gameIntances in this.gameIntances) {
			this.gameIntances[gameIntances] = new PIXI.Container();
			this.gameIntances[gameIntances].alpha = 0;
			this.app.stage.addChild(this.gameIntances[gameIntances]);
		}
	}

	iniIntro() {
		let tl = new TimelineMax();

		this.gameIntances.intro.alpha = 1;

		this.introLogo = new PIXI.Sprite.from(this.app.loader.resources['/img/logo.png'].texture);
		this.introLogo.anchor.set(0.5);
		this.introLogo.position.x = width / 2;
		this.introLogo.position.y = height / 2;
		this.introLogo.alpha = 0;
		tl
			.to(this.introLogo, 2, { alpha: 1, ease: Linear.easeNone })
			.to(this.introLogo, 1, { alpha: 0, ease: Linear.easeNone })
			.call(() => {
				this.initSelect();
			});
		this.gameIntances.intro.addChild(this.introLogo);
	}

	createHoverAnim() {
		this.hoverEffects = [];

		for (let i = 1; i < 10; i++) {
			const val = i < 10 ? `0${i}` : i;

			this.hoverEffects.push(PIXI.Texture.from(`Hover_0${val}`));
		}
	}
	initSelect() {
		if (this.gameIntances.game.gameOver && this.gameIntances.gameOver.length) {
			this.gameIntances.gameOver.removeChildren(0, this.gameIntances.gameOver.length);
		}
		if (this.mainBGSound) {
			this.stopmainBGSound();
		}
		this.playSound('selectCharBg', { loop: true, mainbg: true });
		this.gameIntances.intro.alpha = 0;
		this.gameIntances.gameOver.alpha = 0;
		this.gameIntances.select.alpha = 1;

		this.staticbg = new PIXI.Sprite.from(this.app.loader.resources['/img/staticbg.jpg'].texture);

		this.selectGameLogo = new PIXI.Sprite.from(this.app.loader.resources['/img/logo.png'].texture);
		this.selectGameLogo.anchor.set(0.5);
		this.selectGameLogo.position.x = width / 2;
		this.selectGameLogo.position.y = height / 2 - 100;
		this.selectGameLogo.alpha = 1;




		this.selectJetFighter1 = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-1.png'].texture);

		this.selectJetFighter1.anchor.set(0.5);
		this.selectJetFighter1.position.x = width / 2 - 100;
		this.selectJetFighter1.position.y = height / 2 + 100;
		this.selectJetFighter1.interactive = true;
		this.selectJetFighter1.buttonMode = true;

		this.jetEngine1 = new PIXI.AnimatedSprite(this.flameFrames);
		this.jetEngine1.anchor.set(0.5);
		this.jetEngine1.position.x =   this.selectJetFighter1.position.x - 70;
		this.jetEngine1.position.y = this.selectJetFighter1.position.y;
		this.jetEngine1.alpha = 0;


		this.jetEngine1.play();


		this.hoverJet1 = new PIXI.AnimatedSprite(this.hoverEffects);
		this.hoverJet1.anchor.set(0.5);
		this.hoverJet1.position.x = this.selectJetFighter1.position.x;
		this.hoverJet1.position.y = this.selectJetFighter1.position.y;
		this.hoverJet1.animationSpeed = 0.3;
		this.hoverJet1.play();
		this.hoverJet1.alpha = 0;
		this.selectJetFighter1.cursor = "pointer";

		this.selectJetFighter1.on('pointerover', () => {
			let tl = new TimelineMax({ loop: true });

			tl.to(this.selectJetFighter1.scale, 0.2, { x: 1.1, y: 1.1, ease: Linear.easeNone });
			this.jetEngine1.alpha = 1;
			this.hoverJet1.alpha = 1;
		});
		this.selectJetFighter1.on('pointerout', () => {
			let tl = new TimelineMax({ loop: true });

			tl.to(this.selectJetFighter1.scale, 0.2, { x: 1, y: 1, ease: Linear.easeNone });
			this.jetEngine1.alpha = 0;
			this.hoverJet1.alpha = 0;
		
		});

		this.selectJetFighter1.on('pointerdown', () => {
			this.selectedject = 1;
			this.initGame(this.selectedject);
			this.playSound('selected');
		});

		this.selectJetFighter2 = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-2.png'].texture);
		this.selectJetFighter2.anchor.set(0.5);
		this.selectJetFighter2.position.x = width / 2 + 100;
		this.selectJetFighter2.position.y = height / 2 + 100;
		this.selectJetFighter2.interactive = true;
		this.selectJetFighter2.buttonMode = true;


		this.jetEngine2 = new PIXI.AnimatedSprite(this.flameFrames);
		this.jetEngine2.anchor.set(0.5);
		this.jetEngine2.position.x =   this.selectJetFighter2.position.x - 70;
		this.jetEngine2.position.y = this.selectJetFighter2.position.y;
		this.jetEngine2.alpha = 0;


		this.jetEngine2.play();



		this.hoverJet2 = new PIXI.AnimatedSprite(this.hoverEffects);
		this.hoverJet2.anchor.set(0.5);
		this.hoverJet2.position.x = this.selectJetFighter2.position.x;
		this.hoverJet2.position.y = this.selectJetFighter2.position.y;
		this.hoverJet2.animationSpeed = 0.3;
		this.hoverJet2.play();
		this.hoverJet2.alpha = 0;
		this.hoverJet2.tint = 0xce1958;


		this.selectJetFighter2.on('pointerover', () => {
			let tl = new TimelineMax();

			tl.to(this.selectJetFighter2.scale, 0.2, { x: 1.1, y: 1.1, ease: Linear.easeNone });
			this.jetEngine2.alpha = 1;
			this.hoverJet2.alpha = 1;
		});
		this.selectJetFighter2.on('pointerout',  () => {
			let tl = new TimelineMax();

			tl.to(this.selectJetFighter2.scale, 0.2, { x: 1, y: 1, ease: Linear.easeNone });
			this.jetEngine2.alpha = 0;
			this.hoverJet2.alpha = 0;
		});

		this.selectJetFighter2.on('pointerdown', () => {
			this.selectedject = 2;
			this.initGame(this.selectedject);
			this.playSound('selected');
		});

		this.gameIntances.select.addChild(this.staticbg);
		this.gameIntances.select.addChild(this.selectGameLogo);
		this.gameIntances.select.addChild(this.jetEngine1);
		this.gameIntances.select.addChild(this.jetEngine2);

		this.gameIntances.select.addChild(this.selectJetFighter1);
		this.gameIntances.select.addChild(this.selectJetFighter2);
		this.gameIntances.select.addChild(this.hoverJet1);
		this.gameIntances.select.addChild(this.hoverJet2);
	}
	// initialized  Game

	initGame(selectedJet) {
		this.stopmainBGSound();
		this.playSound('main-bg', { loop: true, mainbg: true });
		this.gameIntances.intro.alpha = 0;
		let tl = new TimelineMax();
		tl.to(this.gameIntances.game, 2, { alpha: 1, ease: Linear.easeNone });

		this.initBg();

		this.initJet(selectedJet);
		this.gameIntances.select.removeChildren(0, this.gameIntances.select.children.length);
		console.error(this.gameIntances.select.children.length);
		this.app.ticker.add(this.gameLoop, this);
	}
	// game Ticker
	gameLoop(e) {
		this.Collision(e);
		this.parallaxBG(e);
		this.updateMissile(e);
		this.updateEnemy(e);
		this.updateEnemyMissile(e);
		this.updatePower(e);
	}

	// game Ticker

	//iniliazed parallax background

	initBg() {
		this.backBG = this.createBgTiles(this.app.loader.resources['/img/backBG.jpg'].texture);
		this.mid2BG = this.createBgTiles(this.app.loader.resources['/img/mid2BG.png'].texture);
		this.mid1BG = this.createBgTiles(this.app.loader.resources['/img/mid1BG.png'].texture);
		this.frontBG = this.createBgTiles(this.app.loader.resources['/img/frontBG.png'].texture);
	}

	createBgTiles(bgTexure) {
		let tiles = new PIXI.TilingSprite(bgTexure, 960, 640);
		tiles.position.set(0, 0);
		this.gameIntances.game.addChild(tiles);

		return tiles;
	}

	parallaxBG() {
		bgx = bgx + parallaxSpeed;
		this.frontBG.tilePosition.x = bgx;
		this.mid1BG.tilePosition.x = bgx / 1.5;
		this.mid2BG.tilePosition.x = bgx / 4;
		this.backBG.tilePosition.x = bgx / 6;
		// console.error(bgx);
	}

	//END iniliazed parallax background

	// Initialized jetFigther
	createAnimFlames() {
		this.flameFrames = [];

		for (let i = 1; i < 12; i++) {
			const val = i < 10 ? `0${i}` : i;

			this.flameFrames.push(PIXI.Texture.from(`jetFlame_0${val}`));
		}
	}

	createAnimExplosion() {
		this.explosions = [];

		for (let i = 1; i < 23; i++) {
			const val = i < 10 ? `0${i}` : i;

			this.explosions.push(PIXI.Texture.from(`Explode_0${val}`));
		}
	}
	initJet(selectedJet) {
		this.missiles = [];
		this.enemies = [];
		this.enemiesMissiles = [];

		this.jetEngine = new PIXI.AnimatedSprite(this.flameFrames);
		this.jetEngine.anchor.set(0.5);
		this.jetEngine.position.x = 70;

		this.jetEngine.play();

		if (selectedJet === 1) {
			this.jetFighter = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-1.png'].texture);
		} else if (selectedJet === 2) {
			this.jetFighter = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-2.png'].texture);
		}
		this.jetFighter.anchor.set(0.5);
		this.jetFighter.position.x = 130;
		this.jetFighter.hasPower = false;
		this.jetFighter.dead = false;
		this.jetFighter.powerInfo = undefined;
		this.gameIntances.game.interactive = true;
		this.gameIntances.game.addChild(this.jetEngine);
		this.gameIntances.game.addChild(this.jetFighter);
		this.shieldParticles();
		this.gameIntances.game.on('pointerdown', (e) => {
			if(!this.jetFighter.dead){
			this.fireMissile(e);
		}
		});

		this.gameIntances.game.on('pointermove', (e) => {
			this.moveJet(e);
		});
		this.showEnemyFunc = setInterval(() => {
			this.showEnemy();
		}, 2000);

		this.fireEnemyFunc = setInterval(() => {
			this.fireEnemyMissiles();
		}, 1500);
		this.powerUpFunc = setInterval(() => {
			let randomPower = Math.floor(Math.random() * 3) + 1;
			this.createPowerUp(randomPower);
		}, 10000);
	
	}

	moveJet(e) {
		let post = this.app.renderer.plugins.interaction.mouse.global;

		if (post.y <= 640 && post.y >= 0) {
			this.jetFighter.y = post.y;
			this.jetEngine.y = post.y;
			this.particleContainer.y  = post.y;
		
		}
	}

	fireMissile(e) {
		if (this.jetFighter.hasPower && this.jetFighter.powerInfo === 'multiShot') {
			let missiles = this.createMissile(true);
			for (let i = 0; i < missiles.length; i++) {
				this.missiles.push(missiles[i]);
			}
		}
		let missile = this.createMissile();

		this.missiles.push(missile);
		this.playSound('fire');
		// console.error('FIRE!', this.missiles);
	}

	createMissile(multiShot) {
		if (multiShot) {
			let missile2 = new PIXI.Sprite.from(this.app.loader.resources['/img/missile1.png'].texture);
			missile2.anchor.set(0.5);
			missile2.x = this.jetFighter.x + 10;
			missile2.y = this.jetFighter.y;
			missile2.speed = missileSpeed;
			this.gameIntances.game.addChild(missile2);
			let missile = new PIXI.Sprite.from(this.app.loader.resources['/img/missile1.png'].texture);
			missile.anchor.set(0.5);
			missile.x = this.jetFighter.x + 10;
			missile.y = this.jetFighter.y + 23;
			missile.speed = missileSpeed;
			this.gameIntances.game.addChild(missile);
			return [ missile, missile2 ];
		} else {
			let missile = new PIXI.Sprite.from(this.app.loader.resources['/img/missile1.png'].texture);
			missile.anchor.set(0.5);
			missile.x = this.jetFighter.x + 10;
			missile.y = this.jetFighter.y + 23;
			missile.speed = missileSpeed;
			this.gameIntances.game.addChild(missile);
			return missile;
		}
	}

	updateMissile(e) {
		for (let i = 0; i < this.missiles.length; i++) {
			this.missiles[i].position.x += this.missiles[i].speed;
			//   console.error(this.missiles[i].position.x);
			if (this.missiles[i].position.x > 960) {
				this.missiles[i].dead = true;
				// console.error('dead', this.missiles[i].position.x);
			}
		}

		for (let i = 0; i < this.missiles.length; i++) {
			if (this.missiles[i].dead) {
				// console.error('dead');
				this.gameIntances.game.removeChild(this.missiles[i]);
				this.missiles.splice(i, 1);
			}
		}
	}

	showEnemy() {
		let enemy = this.createEnemy();
		this.enemies.push(enemy);
	}

	createEnemy() {
		let randomEnemy = Math.floor(Math.random() * 3);
		let enemy;
		let randomY = Math.floor(Math.random() * 510) + 100;
		switch (randomEnemy) {
			case 0:
				enemy = new PIXI.Sprite.from(this.app.loader.resources['/img/enemy1.png'].texture);
				break;
			case 1:
				enemy = new PIXI.Sprite.from(this.app.loader.resources['/img/enemy2.png'].texture);
				break;

			default:
				enemy = new PIXI.Sprite.from(this.app.loader.resources['/img/enemy3.png'].texture);
		}

		enemy.anchor.set(0.5);
		enemy.x = 940;
		enemy.y = randomY;
		enemy.speed = enemySpeed;
		enemy.randomY = randomY;
		this.gameIntances.game.addChild(enemy);
		// console.error(enemy);
		return enemy;
	}

	updateEnemy(e) {
		for (let i = 0; i < this.enemies.length; i++) {
			let collide = collision(this.jetFighter, this.enemies[i]);
			if (collide && !this.jetFighter.hasPower && this.jetFighter.powerInfo === undefined) {
				this.explode(this.enemies[i].x, this.enemies[i].y);
				this.enemies[i].dead = true;

				this.playSound('exploded');
		
			} else if (collide && !this.jetFighter.hasPower && this.jetFighter.powerInfo === undefined) {
				this.explode(this.jetFighter.x, this.jetFighter.y);
				this.enemies[i].dead = true;
				this.jetFighter.dead = true;
				this.jetFighter.alpha = 0;
				this.jetFighter.visible = false;
				this.jetEngine.alpha = 0;
				this.jetFighter.position.x = -430;
				this.playSound('exploded');
				this.playSound('game-over');
				this.gameOver();
			}

			this.enemies[i].position.x -= this.enemies[i].speed;

			//follow jet
			// if(this.jetFighter.y > this.enemies[i].position.y) {
			// 	this.enemies[i].position.y += this.enemies[i].speed;

			// } else {
			// 	this.enemies[i].position.y -= this.enemies[i].speed;

			// }

			if (this.enemies[i].position.x < 0) {
				this.enemies[i].dead = true;
				// console.error('dead', this.enemies[i].position.x);
			}
		}

		for (let i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].dead) {
				// console.error('dead');
				this.gameIntances.game.removeChild(this.enemies[i]);
				this.enemies.splice(i, 1);
			}
		}
	}

	fireEnemyMissiles() {
		if (this.enemies.length) {
			let enemyMissile = this.createEnemyMissile();

			this.enemiesMissiles.push(enemyMissile);
			this.playSound('fire');
		}
	}
	createEnemyMissile() {
		for (let i = 0; i < this.enemies.length; i++) {
			let enemyMissile = new PIXI.Sprite.from(this.app.loader.resources['/img/enemymissile.png'].texture);
			enemyMissile.anchor.set(0.5);
			enemyMissile.x = this.enemies[i].x + 10;
			enemyMissile.y = this.enemies[i].y + 23;
			enemyMissile.speed = missileSpeed;
			this.gameIntances.game.addChild(enemyMissile);
			// console.error(enemyMissile);
			return enemyMissile;
		}
	}

	updateEnemyMissile(e) {
		for (let i = 0; i < this.enemiesMissiles.length; i++) {
			this.enemiesMissiles[i].position.x -= this.enemiesMissiles[i].speed;

			let collide = collision(this.jetFighter, this.enemiesMissiles[i]);
			if (collide && this.jetFighter.hasPower && this.jetFighter.powerInfo === 'shield') {
				this.enemiesMissiles[i].dead = true;
			} else if (collide && !this.jetFighter.hasPower && this.jetFighter.powerInfo === undefined) {
				this.explode(this.jetFighter.x, this.jetFighter.y);
				this.enemiesMissiles[i].dead = true;
				this.jetFighter.dead = true;

				this.jetFighter.alpha = 0;
				this.jetFighter.visible = false;
				this.jetEngine.alpha = 0;
				this.playSound('exploded');
				this.playSound('game-over');
				this.jetFighter.position.x = -430;
				this.gameOver();
			}

			//   console.error(this.missiles[i].position.x);
			if (this.enemiesMissiles[i].position.x < 0) {
				this.enemiesMissiles[i].dead = true;
				// console.error('dead', this.enemiesMissiles[i].position.x);
			}
		}

		for (let i = 0; i < this.enemiesMissiles.length; i++) {
			if (this.enemiesMissiles[i].dead) {
				// console.error('dead');
				this.gameIntances.game.removeChild(this.enemiesMissiles[i]);
				this.enemiesMissiles.splice(i, 1);
			}
		}
	}

	explode(x, y) {
		let exploded = new PIXI.AnimatedSprite(this.explosions);
		exploded.anchor.set(0.5);
		exploded.x = x;
		exploded.y = y;
		exploded.loop = false;
		exploded.play();
		this.gameIntances.game.addChild(exploded);
		exploded.onComplete = function() {
			exploded.destroy();
		};
	}

	Collision(e) {
		if (this.enemies.length > 0 && this.missiles.length > 0) {
			for (let a = 0; a < this.missiles.length; a++) {
				for (let b = 0; b < this.missiles.length; b++) {
					if (this.missiles[a] && this.enemies[b]) {
						if (this.jetFighter.hasPower && this.jetFighter.powerInfo === 'homingMissile') {
							if (this.missiles[a] && this.missiles[a].position.y > this.enemies[b].position.y) {
								this.missiles[a].position.y -= this.missiles[a].speed + 1;
							}
							if (this.missiles[a] && this.missiles[a].position.y < this.enemies[b].position.y) {
								this.missiles[a].position.y += this.missiles[a].speed + 1;
							}
						}

						let collide = collision(this.missiles[a], this.enemies[b]);

						if (collide) {
							this.explode(this.enemies[b].position.x, this.enemies[b].position.y);
							// console.error('colide');

							this.gameIntances.game.removeChild(this.missiles[a]);
							this.missiles.splice(a, 1);
							this.gameIntances.game.removeChild(this.enemies[b]);
							this.playSound('exploded');
							this.enemies.splice(b, 1);
						}
					}
				}
			}
		}
	}

	createPowerUp(power) {
		if (power == 1) {
			this.power = new PIXI.AnimatedSprite(this.hoverEffects);
			this.power.anchor.set(0.5);
			this.power.position.x = this.jetFighter.position.x;
			this.power.position.y = -10;
			this.power.scale.x = 0.5;
			this.power.scale.y = 0.5;
			this.power.animationSpeed = 0.4;
			this.power.play();
			this.power.tint = 0xff0000;
			this.power.speed = 1;
			this.power.dead = false;
			this.power.info = 'multiShot';
		} else if (power == 2) {
			this.power = new PIXI.AnimatedSprite(this.hoverEffects);
			this.power.anchor.set(0.5);
			this.power.position.x = this.jetFighter.position.x;
			this.power.position.y = -10;
			this.power.scale.x = 0.5;
			this.power.scale.y = 0.5;
			this.power.animationSpeed = 0.4;
			this.power.play();
			this.power.tint = 0x00a2ff;
			this.power.speed = 1;
			this.power.dead = false;
			this.power.info = 'shield';
		} else if (power == 3) {
			this.power = new PIXI.AnimatedSprite(this.hoverEffects);
			this.power.anchor.set(0.5);
			this.power.position.x = this.jetFighter.position.x;
			this.power.position.y = -10;
			this.power.scale.x = 0.5;
			this.power.scale.y = 0.5;
			this.power.animationSpeed = 0.4;
			this.power.play();
			this.power.tint = 0x00ff84;
			this.power.speed = 1;
			this.power.dead = false;
			this.power.info = 'homingMissile';
		}
		this.gameIntances.game.addChild(this.power);
	}

	updatePower(e) {
		if (this.power) {
			this.power.position.y += this.power.speed;
			this.power.rotation += 0.1;

			let collide = collision(this.jetFighter, this.power);
			if (collide) {
				switch (this.power.info) {
					case 'multiShot':
						this.multiShot();
						console.error('multiShot');
						this.power.info = '';
						break;

					case 'shield':
						this.shield();
						console.error('shield');
						this.power.info = '';
						break;

					case 'homingMissile':
						this.homingMissile();
						console.error('homingMissile');
						this.power.info = '';
						break;
					default:
						break;
				}
				this.gameIntances.game.removeChild(this.power);
			}
		}
	}
	multiShot() {
		this.jetFighter.hasPower = true;
		this.jetFighter.powerInfo = 'multiShot';
		setTimeout(() => {
			this.jetFighter.powerInfo = undefined;
			this.jetFighter.hasPower = false;
		}, 5000);
	}
	shield() {
		this.jetFighter.hasPower = true;
		this.jetFighter.powerInfo = 'shield';
		this.particleContainer.alpha = 1;
		setTimeout(() => {
			this.particleContainer.alpha = 0;
			this.jetFighter.powerInfo = undefined;
			this.jetFighter.hasPower = false;
		}, 5000);
	}
	homingMissile() {
		this.jetFighter.hasPower = true;
		this.jetFighter.powerInfo = 'homingMissile';

		setTimeout(() => {
			this.jetFighter.powerInfo = undefined;
			this.jetFighter.hasPower = false;
			console.error(this.jetFighter.powerInfo, this.jetFighter.hasPower);
		}, 5000);
	}

	gameOver() {
	
		this.gameIntances.gameOver.alpha = 1;
		this.gameIntances.select.alpha = 0;
		this.gameIntances.game.alpha = 0.5;

		this.gameOverText = new PIXI.Sprite.from(this.app.loader.resources['/img/gameover.png'].texture);
		this.gameOverText.anchor.set(0.5);
		this.gameOverText.position.x = width / 2;
		this.gameOverText.position.y = height / 2 - 100;

		this.tryAgain = new PIXI.Sprite.from(this.app.loader.resources['/img/tryAgain.png'].texture);
		this.tryAgain.anchor.set(0.5);
		this.tryAgain.position.x = width / 2;
		this.tryAgain.position.y = height / 2 + 70;
		this.tryAgain.interactive = true;
		this.tryAgain.buttonMode = true;
		this.tryAgain.on('pointerover',() => {
			let tl = new TimelineMax();

			tl.to(this.tryAgain.scale, 0.2, { x: 1.1, y: 1.1, ease: Linear.easeNone });
		});
		this.tryAgain.on('pointerout', () => {
			let tl = new TimelineMax();

			tl.to(this.tryAgain.scale, 0.2, { x: 1, y: 1, ease: Linear.easeNone });
		});

		this.tryAgain.on('pointerdown', () => {
			this.shield();
			this.jetFighter.alpha = 1;
			this.jetEngine.alpha = 1;
			this.jetFighter.position.x = 130;
			this.jetFighter.dead = false;
			this.jetFighter.visible = true;

			this.gameIntances.game.alpha = 1;
			this.gameIntances.gameOver.alpha = 0;
	
			this.gameIntances.gameOver.removeChildren(0, this.gameIntances.gameOver.children.length);
		});


		this.quit = new PIXI.Sprite.from(this.app.loader.resources['/img/quit.png'].texture);
		this.quit.anchor.set(0.5);
		this.quit.position.x = width / 2;
		this.quit.position.y = height / 2 + 160;
		this.quit.interactive = true;
		this.quit.buttonMode = true;

		this.quit.on('pointerover',() => {
			let tl = new TimelineMax();

			tl.to(this.quit.scale, 0.2, { x: 1.1, y: 1.1, ease: Linear.easeNone });
		});
		this.quit.on('pointerout',() => {
			let tl = new TimelineMax();

			tl.to(this.quit.scale, 0.2, { x: 1, y: 1, ease: Linear.easeNone });
		});

		this.quit.on('pointerdown', () => {
			this.initSelect();
			this.removeAllinGame();
			this.gameIntances.gameOver.alpha = 0;
		});

		this.gameIntances.gameOver.addChild(this.gameOverText);
		this.gameIntances.gameOver.addChild(this.tryAgain);
		this.gameIntances.gameOver.addChild(this.quit);
	}



	removeAllinGame() {
		this.gameIntances.game.removeChildren(0, this.gameIntances.game.children.length);
		this.gameIntances.gameOver.removeChildren(0, this.gameIntances.gameOver.children.length);
		this.app.ticker.remove(this.gameLoop, this);

		clearInterval(this.powerUpFunc);
		clearInterval(this.showEnemyFunc);
		clearInterval(this.fireEnemyFunc);
	}


	shieldParticles() {
		this.particleContainer = new PIXI.ParticleContainer();
		this.particleContainer.x  = this.jetEngine.x + 50;
		this.gameIntances.game.addChild(this.particleContainer);
		this.particleContainer.alpha = 0;
		let  shieldParticlesEmitter = new _pixi.Emitter(

			// The PIXI.Container to put the emitter in
			// if using blend modes, it's important to put this
			// on top of a bitmap, and not use the root stage Container
			this.particleContainer,
		
			// The collection of particle images to use
			[this.app.loader.resources['/img/particle.png'].texture],
		
			// Emitter configuration, edit this to change the look
			// of the emitter
			{
				"alpha": {
					"start": 0.78,
					"end": 0
				},
				"scale": {
					"start": 0.1,
					"end": 0.25,
					"minimumScaleMultiplier": 1
				},
				"color": {
					"start": "#8fb2ff",
					"end": "#2986ff"
				},
				"speed": {
					"start": 0,
					"end": 0,
					"minimumSpeedMultiplier": 1
				},
				"acceleration": {
					"x": 0,
					"y": 0
				},
				"maxSpeed": 0,
				"startRotation": {
					"min": 265,
					"max": 275
				},
				"noRotation": false,
				"rotationSpeed": {
					"min": 68,
					"max": 100
				},
				"lifetime": {
					"min": 0.1,
					"max": 0.75
				},
				"blendMode": "normal",
				"frequency": 0.001,
				"emitterLifetime": -1,
				"maxParticles": 500,
				"pos": {
					"x": 0,
					"y": 0
				},
				"addAtBack": false,
				"spawnType": "ring",
				"spawnCircle": {
					"x": 0,
					"y": 0,
					"r": 70,
					"minR": 12
				}
			}
		);
		
		// Calculate the current time
		let elapsed = Date.now();
		
		// Update function every frame
		let update = function(){
		
			// Update the next frame
			requestAnimationFrame(update);
		
			let now = Date.now();
		
			// The emitter requires the elapsed
			// number of seconds since the last update
			shieldParticlesEmitter.update((now - elapsed) * 0.001);
			elapsed = now;
		
			// Should re-render the PIXI Stage
			// renderer.render(stage);
		};
		
		// Start emitting
		shieldParticlesEmitter.emit = true;
		
		// Start the update
		update();



	}


}

export default Game;

import * as PIXI from 'pixi.js';
import 'howler';
import {collision} from './collision';
import PixiPlugin from 'gsap/PixiPlugin';
import { TweenLite, TimelineMax, Back, Linear, Elastic,scaleX,scaleY } from 'gsap';
PixiPlugin.registerPIXI(PIXI);

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
			'/img/missile1.png',
			'/img/spaceship-2.png',
			'/img/enemy1.png',
			'/img/enemy2.png',
			'/img/enemy3.png',
			'/img/explode.json'
		])
		.load(() => {
			// this.initGame();
			this.iniIntro();
		});
	}

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

		this.introLogo =  new PIXI.Sprite.from(this.app.loader.resources['/img/logo.png'].texture);
		this.introLogo.anchor.set(0.5);
		this.introLogo.position.x = width/2;
		this.introLogo.position.y = height/2;
		this.introLogo.alpha = 0;
		tl.to(this.introLogo, 2, {alpha: 1, ease: Linear.easeNone}).to(this.introLogo, 1, {alpha: 0, ease: Linear.easeNone}).call(()=>{
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
		this.createHoverAnim();
		this.gameIntances.intro.alpha = 0;
		this.gameIntances.select.alpha = 1;

		this.staticbg =  new PIXI.Sprite.from(this.app.loader.resources['/img/staticbg.jpg'].texture);


		this.selectGameLogo =  new PIXI.Sprite.from(this.app.loader.resources['/img/logo.png'].texture);
		this.selectGameLogo.anchor.set(0.5);
		this.selectGameLogo.position.x = width/2;
		this.selectGameLogo.position.y = height/2 - 100;
		this.selectGameLogo.alpha = 1;

		

		this.selectJetFighter1 = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-1.png'].texture);
		
	

		this.selectJetFighter1.anchor.set(0.5);
		this.selectJetFighter1.position.x = width/2 - 100;
		this.selectJetFighter1.position.y = height/2 + 100;
		this.selectJetFighter1.interactive = true;
		this.selectJetFighter1.buttonMode = true;



		this.hoverJet1 = new PIXI.AnimatedSprite(this.hoverEffects);
		this.hoverJet1.anchor.set(0.5);
		this.hoverJet1.position.x = this.selectJetFighter1.position.x;
		this.hoverJet1.position.y = this.selectJetFighter1.position.y;
		this.hoverJet1.animationSpeed = 0.3;
		this.hoverJet1.play();
		this.hoverJet1.alpha =  0;


		this.selectJetFighter1.mouseover = () => {
			let tl = new TimelineMax({loop:true});
			
			tl.to(this.selectJetFighter1.scale, 0.2, {x: 1.1,y: 1.1, ease: Linear.easeNone});

			this.hoverJet1.alpha =  1;
		};
		this.selectJetFighter1.mouseout = () => {
			let tl = new TimelineMax({loop:true});
			
			tl.to(this.selectJetFighter1.scale, 0.2, {x: 1,y: 1, ease: Linear.easeNone});
			this.hoverJet1.alpha =  0;
		};
		this.selectJetFighter1.on("click",() => {
			this.selectedject = 1;
			this.initGame(this.selectedject);

		});

		this.selectJetFighter2 = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-2.png'].texture);
		this.selectJetFighter2.anchor.set(0.5);
		this.selectJetFighter2.position.x = width/2 + 100;
		this.selectJetFighter2.position.y = height/2 + 100;
		this.selectJetFighter2.interactive = true;
		this.selectJetFighter2.buttonMode = true;

		this.hoverJet2 = new PIXI.AnimatedSprite(this.hoverEffects);
		this.hoverJet2.anchor.set(0.5);
		this.hoverJet2.position.x = this.selectJetFighter2.position.x;
		this.hoverJet2.position.y = this.selectJetFighter2.position.y;
		this.hoverJet2.animationSpeed = 0.3;
		this.hoverJet2.play();
		this.hoverJet2.alpha =  0;
		this.hoverJet2.tint = 0xff8a00;



		this.selectJetFighter2.mouseover = () => {
			let tl = new TimelineMax({loop:true});
			
			tl.to(this.selectJetFighter2.scale, 0.2, {x: 1.1,y: 1.1, ease: Linear.easeNone});

			this.hoverJet2.alpha =  1;
		};
		this.selectJetFighter2.mouseout = () => {
			let tl = new TimelineMax({loop:true});
			
			tl.to(this.selectJetFighter2.scale, 0.2, {x: 1,y: 1, ease: Linear.easeNone});
			this.hoverJet2.alpha =  0;
		};

		this.selectJetFighter2.on("click",() => {
			this.selectedject = 2
			this.initGame(this.selectedject);

		});




		this.gameIntances.select.addChild(this.staticbg);
		this.gameIntances.select.addChild(this.selectGameLogo);
		this.gameIntances.select.addChild(this.selectJetFighter1);
		this.gameIntances.select.addChild(this.selectJetFighter2);
		this.gameIntances.select.addChild(this.hoverJet1);
		this.gameIntances.select.addChild(this.hoverJet2);
	}
	// initialized  Game

	initGame(selectedJet) {
		this.gameIntances.intro.alpha = 0;
		let tl = new TimelineMax();
		tl.to(this.gameIntances.game, 2, {alpha: 1, ease: Linear.easeNone});

		this.initBg();
		this.gameLoop();
		this.initJet(selectedJet);
	}
	// game Ticker
	gameLoop() {
		this.app.ticker.add((e) => {
			this.Collision(e);
			this.parallaxBG(e);
			this.updateMissile(e);
			this.updateEnemy(e);
	
		});
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

		for (let i = 0; i < 12; i++) {
			const val = i < 10 ? `0${i}` : i;

			this.flameFrames.push(PIXI.Texture.from(`jetFlame_0${val}`));
		}
	}

	createAninExplosion() {
		this.explosions = [];

		for (let i = 1; i < 23; i++) {
			const val = i < 10 ? `0${i}` : i;

			this.explosions.push(PIXI.Texture.from(`Explode_0${val}`));
		}
	}
	initJet(selectedJet) {
		this.createAnimFlames();
		this.missiles = [];
		this.enemies = [];
		this.jetEngine = new PIXI.AnimatedSprite(this.flameFrames);
		this.jetEngine.anchor.set(0.5);
		this.jetEngine.position.x = 70;
		this.jetEngine.play();
	
		if(selectedJet === 1) {
		this.jetFighter = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-1.png'].texture);
		}  else if(selectedJet === 2) {
			this.jetFighter = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-2.png'].texture);
		}
		this.jetFighter.anchor.set(0.5);
		this.jetFighter.position.x = 130;

		this.gameIntances.game.interactive = true;
		this.gameIntances.game.addChild(this.jetEngine);
		this.gameIntances.game.addChild(this.jetFighter);
		this.gameIntances.game.on('click', (e) => {
			this.fireMissile(e);
		});
		this.gameIntances.game.on('pointermove', (e) => {
			this.moveJet(e);
		});
		setInterval(() =>{
			
			this.showEnemy();
		}, 3000);
	}

	moveJet(e) {
		let post = this.app.renderer.plugins.interaction.mouse.global;

		if (post.y <= 590) {
			this.jetFighter.y = post.y;
			this.jetEngine.y = post.y;
		}
	}

	fireMissile(e) {
		let missile = this.createMissile();

		this.missiles.push(missile);
		console.error('FIRE!', this.missiles);
	}

	createMissile() {
		let missile = new PIXI.Sprite.from(this.app.loader.resources['/img/missile1.png'].texture);
		missile.anchor.set(0.5);
		missile.x = this.jetFighter.x + 10;
		missile.y = this.jetFighter.y + 23;
		missile.speed = missileSpeed;
		this.gameIntances.game.addChild(missile);
		console.error(missile);
		return missile;
	}

	updateMissile(e) {
		for (let i = 0; i < this.missiles.length; i++) {
			this.missiles[i].position.x += this.missiles[i].speed;
			//   console.error(this.missiles[i].position.x);
			if (this.missiles[i].position.x > 960) {
				this.missiles[i].dead = true;
				console.error('dead', this.missiles[i].position.x);
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
			
			
			let enemy =  this.createEnemy();
			this.enemies.push(enemy);

		}

		createEnemy() {
			let randomEnemy = Math.floor(Math.random() * 3);
			let enemy;
			let randomY = Math.floor(Math.random() * 510) + 100;
			switch(randomEnemy) {
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
			console.error(enemy);
			return enemy;
		}
	

		updateEnemy(e) {
			for (let i = 0; i < this.enemies.length; i++) {

				

			
					let collide = collision(this.jetFighter, this.enemies[i]);
					if(collide){
						this.explode(this.jetFighter.x, this.jetFighter.y);
						this.enemies[i].dead = true;
						this.jetFighter.dead = true;
						this.jetFighter.alpha = 0;
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
					console.error('dead', this.enemies[i].position.x);
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
		explode(x, y) {
			this.createAninExplosion();
			let exploded = new PIXI.AnimatedSprite(this.explosions);
			exploded.anchor.set(0.5);
			exploded.x = x;
			exploded.y = y;
			exploded.loop = false;
			exploded.play();
			this.gameIntances.game.addChild(exploded);
			exploded.onComplete = function () {
				exploded.destroy();
			  };
		}

		Collision(e) {
			if (this.enemies.length > 0 && this.missiles.length > 0) {
				for (let a = 0; a < this.missiles.length; a++) {
					for (let b = 0; b < this.missiles.length; b++) {

					if(this.missiles[a] && this.enemies[b]) {
						let collide = collision(this.missiles[a], this.enemies[b]);

						if(collide) {
							this.explode(this.enemies[b].position.x, this.enemies[b].position.y);
							console.error('colide');
						
							this.gameIntances.game.removeChild(this.missiles[a]);
							this.missiles.splice(a, 1);
							this.gameIntances.game.removeChild(this.enemies[b]);
						
							this.enemies.splice(b, 1);
						
						}
					}
						
					
					}
				}
			}


		
		}




}

export default Game;

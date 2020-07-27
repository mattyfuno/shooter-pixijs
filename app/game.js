import * as PIXI from 'pixi.js';
import 'howler';

let bgx = 0;
let parallaxSpeed = -1.5;
let missileSpeed = 15;
class Game {
	constructor() {
		this.app = new PIXI.Application(960, 640);
		document.querySelector('#GameApp').appendChild(this.app.renderer.view);

		this.app.loader.baseUrl = 'assets';
		this.app.loader
			.add([
				'/img/backBG.jpg',
				'/img/mid2BG.png',
				'/img/mid1BG.png',
				'/img/frontBG.png',
				'/img/jetFlame.json',
				'/img/spaceship-1.png',
				'/img/missile1.png',
				'/img/spaceship-2.png'
			])
			.load(() => {
				this.initGame();
			});
		this.gameIntances = {
			intro: {},
			select: {},
			game: {},
			gameOver: {}
		};
		this.initScenes();
	}

	initScenes() {
		for (let gameIntances in this.gameIntances) {
			this.gameIntances[gameIntances] = new PIXI.Container();
			this.gameIntances[gameIntances].alpha = 1;
			this.app.stage.addChild(this.gameIntances[gameIntances]);
		}
	}

	// initialized  Game

	initGame() {
		this.initBg();
		this.gameLoop();
		this.initJet();
	}
	// game Ticker
	gameLoop() {
		this.app.ticker.add((e) => {
			this.parallaxBG(e);
			this.updateMissile(e);
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
	initJet() {
		this.createAnimFlames();
		this.missiles = [];

		this.jetEngine = new PIXI.AnimatedSprite(this.flameFrames);
		this.jetEngine.anchor.set(0.5);
		this.jetEngine.x = 70;
		this.jetEngine.play();
	
		this.jetFighter = new PIXI.Sprite.from(this.app.loader.resources['/img/spaceship-1.png'].texture);
		this.jetFighter.anchor.set(0.5);
		this.jetFighter.x = 130;

		this.gameIntances.game.interactive = true;
		this.gameIntances.game.addChild(this.jetEngine);
		this.gameIntances.game.addChild(this.jetFighter);
		this.gameIntances.game.on('click', (e) => {
			this.fireMissile(e);
		});
		this.gameIntances.game.on('pointermove', (e) => {
			this.moveJet(e);
		});
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
				console.error('dead');
				this.gameIntances.game.removeChild(this.missiles[i]);
				this.missiles.splice(i, 1);
			}
		}
	}
}

export default Game;

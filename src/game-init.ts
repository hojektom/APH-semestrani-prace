import * as ECS from '../libs/pixi-ecs';
import { ObjectsFactory } from './factories/objects-factory';
import { Assets, SizesAndPositions } from './constants';
import * as PixiMatter from '../libs/pixi-matter';

// main class of the game
class GameInit {
	engine: ECS.Engine;
	binder: PixiMatter.MatterBind;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			resizeToScreen: true,
			width: SizesAndPositions.WINDOW_WIDTH,
			height: SizesAndPositions.WINDOW_HEIGHT,
			resolution: 1,
			flagsSearchEnabled: false, // searching by flags feature
			statesSearchEnabled: false, // searching by states feature
			tagsSearchEnabled: false, // searching by tags feature
			namesSearchEnabled: true, // searching by names feature
			notifyAttributeChanges: false, // will send message if attributes change
			notifyStateChanges: false, // will send message if states change
			notifyFlagChanges: false, // will send message if flags change
			notifyTagChanges: false, // will send message if tags change
			debugEnabled: false // debugging window
		});

		this.binder = new PixiMatter.MatterBind();
		this.binder.init(this.engine.scene, {
			mouseControl: false,
			renderConstraints: false,
			renderAngles: false,
		});
		this.binder.mEngine.gravity.x = 0;
		this.binder.mEngine.gravity.y = 0;

		this.engine.app.loader
			.reset()
			.add(Assets.TEXTURE, './assets/spritesheet.png')
			.add(Assets.LEVELS, './assets/levels.json')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		let factory = new ObjectsFactory();
	    factory.initializeGame(this.engine, this.binder);
	}
}

// this will create a new instance as soon as this file is loaded
export default new GameInit();
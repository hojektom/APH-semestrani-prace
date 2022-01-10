import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { GameModel } from '../model/game-model';
import Matter, { Engine, IEventCollision } from 'matter-js';
import { CollisionHandler } from '../collision-handler';
import { InfoBuilder } from '../builders/info-builder';
import { PlayerBuilder } from '../builders/player-builder';
import { EnemyBuilder } from '../builders/enemy-builder';
import { WallBuilder } from '../builders/wall-builder';
import { DoorBuilder } from '../builders/door-builder';
import { ProjectileBuilder } from '../builders/projectile-builder';
import { LevelManager } from '../level-manager';
import { RayBuilder } from '../builders/ray-builder';

export class ObjectsFactory {

	engine: ECS.Engine;
	scene: ECS.Scene;
	binder: PixiMatter.MatterBind;
	levelManager: LevelManager;
	firstLoad: boolean = true;

	static _instance : ObjectsFactory;

	// singleton implementation
	constructor() {
		if (ObjectsFactory._instance) {
			return ObjectsFactory._instance;
		}
		ObjectsFactory._instance = this;
	}

	initializeGame(engine: ECS.Engine, binder: PixiMatter.MatterBind) {
		this.engine = engine;
		this.scene = engine.scene;
		this.binder = binder;
		this.levelManager = new LevelManager(engine);

		// global components
		this.scene.addGlobalComponent(new ECS.KeyInputComponent());
		this.scene.addGlobalComponent(new ECS.PointerInputComponent({ handleClick: true }));
		this.scene.addGlobalComponent(this.levelManager);
		this.addCollisionHandler();
	}

	initializeLevel(model: GameModel) {
		this.resetCollisionHandler();
		InfoBuilder.build(this.scene, model.getScore(), model.getExtraLifes(), model.getPlayerName(), model.getInitialTime());
		PlayerBuilder.build(this.scene, this.binder, model.getInitialPlayerPos());
		EnemyBuilder.buildAll(this.scene, this.binder, model.getEnemies());
		WallBuilder.buildAll(this.scene, this.binder, model.getWalls());
		DoorBuilder.buildDoors(this.scene, this.binder, model.getPrevDoor(), model.getNextDoor());
	}

	resetCollisionHandler() {
		let handler: CollisionHandler = this.scene.findGlobalComponentByName(CollisionHandler.name);
		handler.reset();
	}

	resetGame() {
		DoorBuilder.removeAllDoors(this.scene, this.binder);
		PlayerBuilder.removePlayer(this.scene, this.binder);
		EnemyBuilder.removeAllEnemies(this.scene, this.binder);
		ProjectileBuilder.removeAllProjectiles(this.scene, this.binder);
		WallBuilder.removeAllWalls(this.scene, this.binder);
		RayBuilder.removeAllRays(this.binder);
		InfoBuilder.removeAll(this.scene);
    }

	addCollisionHandler() {
		let colHandler = new CollisionHandler();
		this.scene.addGlobalComponent(colHandler);

		Matter.Events.on(this.binder.mEngine, 'collisionStart', (e: IEventCollision<Engine>) => {
			for (let p of e.pairs) {
				colHandler.handleCollision(p.bodyA, p.bodyB);
			}
		});
	}

	createProjectile(posX: number, posY: number, targetX: number, targetY: number, sourceName: string) {
		let a = targetY - posY;
		let b = targetX - posX;
		let angle = Math.atan2(a, b);
		ProjectileBuilder.build(this.scene, this.binder, { x: posX, y: posY }, angle, sourceName);
	}

	// create ray and returns its ID
	createRay(startPosX: number, startPosY: number, directionPosX: number, directionPosY: number) : number {
		let a = directionPosY - startPosY;
		let b = directionPosX - startPosX;
		let angle = Math.atan2(a, b);
		return RayBuilder.build(this.binder, { x: startPosX, y: startPosY }, angle);
	}

	updateModelScore(score: number) {
		this.levelManager.model.updateScore(score);
	}

	updateModelTime(time: number) {
		this.levelManager.model.setTime(time);
	}
}
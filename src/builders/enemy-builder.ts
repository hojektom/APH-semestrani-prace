import Matter, { Body } from "matter-js";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { Assets, Attributes, CharacterMovement, Names } from "../constants";
import { Enemy } from "../model/game-struct";
import { PositionSynchronizator } from "../controllers/position-synchronizator";
import { createTexture } from "../utils";
import { Helper } from "./helper";
import { EnemyAIController } from "../controllers/enemy-ai/enemy-ai-controller";
import { EnemyAnimator } from "../animators/enemy-animator";

export class EnemyBuilder {

	static _bodyEnemies: Matter.Body[] = [];

	// create and build all enemies
	static buildAll(scene: ECS.Scene, binder: PixiMatter.MatterBind, enemies: Enemy[]) {
		let parent: ECS.Container = Helper.getContainer(scene, Names.ENEMIES);
		enemies.forEach(enemy => {
			this.create(scene, binder, enemy.position.x, enemy.position.y)
				.withParent(parent)
				.build();
		});
	}

    // create one enemy object
    static create = (scene: ECS.Scene, binder: PixiMatter.MatterBind, posX: number, posY: number) => {
		let physicalEnemy = Matter.Bodies.rectangle(posX, posY, 8, 11, { 
			label: Names.ENEMY, frictionAir: 1, friction: 1, frictionStatic: 0
		});
		this._bodyEnemies.push(physicalEnemy);
		Body.scale( physicalEnemy, Assets.SCALE, Assets.SCALE);
		Helper.addPhysicalObject(binder, physicalEnemy);

		return new ECS.Builder(scene)
			.anchor(0.5, 0.5)
			.scale(Assets.SCALE)
			.withName(Names.ENEMY + '_' + physicalEnemy.id)
			.withComponent(new PositionSynchronizator(physicalEnemy))
			.withComponent(new EnemyAIController(physicalEnemy, binder))
			.withComponent(new EnemyAnimator())
			.withAttribute(Attributes.CHARACTER_MOVEMENT, CharacterMovement.STAND)
			.asSprite(createTexture(88, 91, 8, 11));
	}

	// removes all enemies
    static removeAllEnemies(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        let enemies = scene.findObjectsByName(Names.ENEMIES);
        enemies.forEach(e => {
            e.destroy();
        });
        this._bodyEnemies.forEach(e => {
            Helper.removePhysicalObject(binder, e);
        });
		this._bodyEnemies = [];
    }
}
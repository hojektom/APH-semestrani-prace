import Matter, { Body } from "matter-js";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { Assets, Attributes, Names, PROJECTILE_MULTIPLICATOR } from "../constants";
import { ProjectileController } from "../controllers/projectile-controller";
import { Position } from "../model/game-struct";
import { PositionSynchronizator } from "../controllers/position-synchronizator";
import { createTexture } from "../utils";
import { Helper } from "./helper";

export class ProjectileBuilder {
    
	static _bodyProjectiles: Matter.Body[] = [];

    static build(scene: ECS.Scene, binder: PixiMatter.MatterBind, position: Position, angle: number, sourceName: string) {
        let parent: ECS.Container = Helper.getContainer(scene, Names.PROJECTILES);
        this.create(scene, binder, position, angle, sourceName).withParent(parent).build();
	}

    static create = (scene: ECS.Scene, binder: PixiMatter.MatterBind, position: Position, angle: number, sourceName: string) : ECS.Builder => {
		let forceX = Math.cos(angle) * PROJECTILE_MULTIPLICATOR;
		let forceY = Math.sin(angle) * PROJECTILE_MULTIPLICATOR;

		let physicalProjectile = Matter.Bodies.rectangle(position.x, position.y, 7, 7,
			{ label: Names.PROJECTILE, frictionAir: 0, friction: 0, frictionStatic: 0, force: { x: forceX, y: forceY }, isSensor: true  });
		this._bodyProjectiles.push(physicalProjectile);
		Body.scale( physicalProjectile, Assets.SCALE, Assets.SCALE);
		Body.rotate(physicalProjectile, angle);
		Helper.addPhysicalObject(binder, physicalProjectile);

		return new ECS.Builder(scene)
			.anchor(0.5, 0.5)
			.scale(Assets.SCALE)
			.withName(Names.PROJECTILE + '_' + physicalProjectile.id)
			.withAttribute(Attributes.PROJECTILE_SOURCE, sourceName)
			.withComponent(new PositionSynchronizator(physicalProjectile))
			.withComponent(new ProjectileController(physicalProjectile, binder))
			.asSprite(createTexture(143, 173, 7, 7));
    }

	// removes all projectiles
    static removeAllProjectiles(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        let projectiles = scene.findObjectsByName(Names.PROJECTILES);
        projectiles.forEach(p => {
            p.destroy();
        });
        this._bodyProjectiles.forEach(p => {
            Helper.removePhysicalObject(binder, p);
        });
		this._bodyProjectiles = [];
    }

	static identifyQuadrant(x: number, y: number) : number {
		if (x > 0 && y > 0) {
			return 1;
		}
		if (x > 0 && y < 0) {
			return 4;
		}
		if (x < 0 && y > 0 ) {
			return 2;
		}
		if (x < 0 && y < 0) {
			return 3;
		}
		return 0;
	}
}
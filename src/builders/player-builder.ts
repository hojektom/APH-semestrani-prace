import Matter, { Body } from "matter-js";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { PlayerAnimator } from "../animators/player-animator";
import { Assets, Attributes, Names, CharacterMovement } from "../constants";
import { Position } from "../model/game-struct";
import { PlayerInputController } from "../controllers/player-input-controller";
import { PositionSynchronizator } from "../controllers/position-synchronizator";
import { createTexture } from "../utils";
import { Helper } from "./helper";

export class PlayerBuilder {

	static _playerBody: Matter.Body;

    // create and build player object
    static build(scene: ECS.Scene, binder: PixiMatter.MatterBind, initPos: Position) {
        let player = this.create(scene, binder, initPos).build();
        scene.assignGlobalAttribute(Attributes.PLAYER, player);
    }
    
    // create player object
    static create = (scene: ECS.Scene, binder: PixiMatter.MatterBind, initPos: Position) => {
		let physicalPlayer = Matter.Bodies.rectangle(initPos.x, initPos.y, 8, 16, { 
			label: Names.PLAYER, frictionAir: 1, friction: 1, frictionStatic: 0
		});
		this._playerBody = physicalPlayer;
		Body.scale( physicalPlayer, Assets.SCALE, Assets.SCALE);
		Helper.addPhysicalObject(binder, physicalPlayer);

		return new ECS.Builder(scene)
			.anchor(0.5, 0.5)
			.scale(Assets.SCALE)
			.withName(Names.PLAYER)
			.withComponent(new PlayerInputController(physicalPlayer))
			.withComponent(new PositionSynchronizator(physicalPlayer))
			.withComponent(new PlayerAnimator())
			.withAttribute(Attributes.CHARACTER_MOVEMENT, CharacterMovement.STAND)
			.withParent(scene.stage)
			.asSprite(createTexture(0, 0, 8, 16));
	}

	// remove player
	static removePlayer(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
		scene.removeGlobalAttribute(Attributes.PLAYER);
		let player = scene.findObjectsByName(Names.PLAYER);
		player.pop().destroy();
		Helper.removePhysicalObject(binder, this._playerBody);
		this._playerBody = null;
	}
}
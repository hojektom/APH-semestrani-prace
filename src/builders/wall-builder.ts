import Matter from "matter-js";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { Colors, Names, SizesAndPositions, WallAndDoor } from "../constants";
import { Rotation, Wall } from "../model/game-struct";
import { Helper } from "./helper";

export class WallBuilder {

    static _bodyWalls: Matter.Body[] = [];

    // create and build all walls
    static buildAll(scene: ECS.Scene, binder: PixiMatter.MatterBind, walls: Wall[]) {
        this.buildBorderWalls(scene, binder);
        this.buildWalls(scene, binder, walls);
    }

    // create and build sent walls
    static buildWalls(scene: ECS.Scene, binder: PixiMatter.MatterBind, walls: Wall[]) {
        let parent: ECS.Container = Helper.getContainer(scene, Names.WALLS);
        walls.forEach(w => {
            parent.addChild(this.buildWall(scene, binder, w.startPos.x, w.startPos.y, 
                w.rotation === Rotation.VERTICAL ? WallAndDoor.WALL_THICKNESS : w.length,
                w.rotation === Rotation.HORIZONTAL ? WallAndDoor.WALL_THICKNESS : w.length));
        });
    }

    // create and build border walls
    static buildBorderWalls(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        let parent: ECS.Container = Helper.getContainer(scene, Names.WALLS);
		parent.addChild(this.buildWall(scene, binder, 0, 0, WallAndDoor.WALL_THICKNESS, 
            scene.height - SizesAndPositions.STATUS_BAR_HEIGHT));
        parent.addChild(this.buildWall(scene, binder, 0, 0, scene.width, WallAndDoor.WALL_THICKNESS));
        parent.addChild(this.buildWall(scene, binder, 0,
            scene.height - WallAndDoor.WALL_THICKNESS - SizesAndPositions.STATUS_BAR_HEIGHT,
            scene.width, WallAndDoor.WALL_THICKNESS));
        parent.addChild(this.buildWall(scene, binder, 
            scene.width - WallAndDoor.WALL_THICKNESS, 0, 
            WallAndDoor.WALL_THICKNESS, scene.height - SizesAndPositions.STATUS_BAR_HEIGHT));
	}

    // create one wall according sent parameters
    static buildWall(scene: ECS.Scene, binder: PixiMatter.MatterBind, 
        startX: number, startY: number, endX: number, endY: number) {
		let physicalWall = Matter.Bodies.rectangle(startX + (endX / 2), startY + (endY / 2), endX, endY, {
			isStatic: true,
			label: Names.WALL
		});
        this._bodyWalls.push(physicalWall);
		Helper.addPhysicalObject(binder, physicalWall);

		const graphics = new ECS.Graphics();
		graphics.beginFill(Colors.WALL_COLOR);
		graphics.drawRect(startX, startY, endX, endY);
		graphics.endFill();
        graphics.name = Names.WALL + '_' + physicalWall.id;
		return graphics;
	}

    // removes all walls
    static removeAllWalls(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        let walls = scene.findObjectsByName(Names.WALLS);
        walls.forEach(w => {
            w.destroy();
        });
        this._bodyWalls.forEach(w => {
            Helper.removePhysicalObject(binder, w);
        });
        this._bodyWalls = [];
    }
}
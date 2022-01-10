import Matter from "matter-js";
import * as ECS from '../../libs/pixi-ecs';
import * as PixiMatter from '../../libs/pixi-matter';
import { Attributes, Colors, Names, SizesAndPositions, WallAndDoor } from "../constants";
import { Direction, Door } from "../model/game-struct";
import { Helper } from "./helper";


export class DoorBuilder {

    static _bodyDoors: Matter.Body[] = [];

    // create and build both door
    static buildDoors(scene: ECS.Scene, binder: PixiMatter.MatterBind, prevDoor: Door, nextDoor: Door) {
        let parent: ECS.Container = Helper.getContainer(scene, Names.DOORS);
        // previous level door
        let previous = this.buildDoor(binder, this.startX(prevDoor), this.startY(prevDoor), this.endX(prevDoor), this.endY(prevDoor), 
            Colors.PREVIOUS_LEVEL_DOOR_COLOR);
        previous.assignAttribute(Attributes.NEXT_LEVEL_DOOR, false);
        parent.addChild(previous);

        // next level door
        let next = this.buildDoor(binder, this.startX(nextDoor), this.startY(nextDoor), this.endX(nextDoor), this.endY(nextDoor), 
            Colors.NEXT_LEVEL_DOOR_COLOR);
        next.assignAttribute(Attributes.NEXT_LEVEL_DOOR, true);
        parent.addChild(next);
    }

    // create one door according sent parameters
    static buildDoor(binder: PixiMatter.MatterBind, startX: number, startY: number, endX: number, endY: number,
        color: Colors) {
		let physicalDoor = Matter.Bodies.rectangle(startX + (endX / 2), startY + (endY / 2), endX, endY, {
			isStatic: true,
			label: Names.DOOR
		});
        this._bodyDoors.push(physicalDoor);
		Helper.addPhysicalObject(binder, physicalDoor);

		const graphics = new ECS.Graphics();
		graphics.beginFill(color);
		graphics.drawRect(startX, startY, endX, endY);
		graphics.endFill();
        graphics.name = Names.DOOR + '_' + physicalDoor.id;
		return graphics;
	}

    // removes all doors
    static removeAllDoors(scene: ECS.Scene, binder: PixiMatter.MatterBind) {
        let doors = scene.findObjectsByName(Names.DOORS);
        doors.forEach(d => {
            d.destroy();
        });
        this._bodyDoors.forEach(d => {
            Helper.removePhysicalObject(binder, d);
        });
        this._bodyDoors = [];
    }

    // count starting position of 'x' for door
    private static startX(door: Door) : number {
        switch(door.dir) {
            case Direction.RIGHT:
                return SizesAndPositions.WINDOW_WIDTH - WallAndDoor.DOOR_THICKNESS;
            case Direction.LEFT:
                return 0;
            case Direction.TOP:
            case Direction.DOWN:
                return door.position;
        }
    }

    // count starting position of 'y' for door
    private static startY(door: Door) : number {
        switch(door.dir) {
            case Direction.RIGHT:
            case Direction.LEFT:
                return door.position;
            case Direction.TOP:
                return 0;
            case Direction.DOWN:
                return SizesAndPositions.WINDOW_HEIGHT - WallAndDoor.DOOR_THICKNESS - SizesAndPositions.STATUS_BAR_HEIGHT;
        }
    }

    // count ending position of 'x' for door
    private static endX(door: Door) : number {
        switch(door.dir) {
            case Direction.RIGHT:
            case Direction.LEFT:
                return WallAndDoor.WALL_THICKNESS;
            case Direction.TOP:
            case Direction.DOWN:
                return WallAndDoor.DOOR_LENGTH;
        }
    }

    // count ending position of 'y' for door
    private static endY(door: Door) : number {
        switch(door.dir) {
            case Direction.RIGHT:
            case Direction.LEFT:
                return WallAndDoor.DOOR_LENGTH;
            case Direction.TOP:
            case Direction.DOWN:
                return WallAndDoor.WALL_THICKNESS;
        }
    }
}
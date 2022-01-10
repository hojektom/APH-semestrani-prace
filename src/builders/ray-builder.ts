import * as PixiMatter from '../../libs/pixi-matter';
import Matter, { Body } from "matter-js";
import { Names, RAY_MULTIPLICATOR } from "../constants";
import { Helper } from "./helper";
import { Position } from '../model/game-struct';

export class RayBuilder {
    static _bodyRays: Matter.Body[] = [];

    // build ray and return physical body id
    static build(binder: PixiMatter.MatterBind, position: Position, angle: number) : number {
        let x = Math.cos(angle) * RAY_MULTIPLICATOR;
		let y = Math.sin(angle) * RAY_MULTIPLICATOR;

		let physicalRay = Matter.Bodies.rectangle(position.x, position.y, 5, 5,
			{ label: Names.RAY, frictionAir: 0, friction: 0, frictionStatic: 0, force: { x: x, y: y }, isSensor: true  });
		this._bodyRays.push(physicalRay);
		Body.rotate(physicalRay, angle);
		Helper.addPhysicalObject(binder, physicalRay);
        return physicalRay.id;
	}

	// removes all rays
    static removeAllRays(binder: PixiMatter.MatterBind) {
        this._bodyRays.forEach(p => {
            Helper.removePhysicalObject(binder, p);
        });
        this._bodyRays = [];
    }
}
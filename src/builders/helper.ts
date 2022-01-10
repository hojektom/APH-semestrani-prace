import * as PixiMatter from '../../libs/pixi-matter';
import * as ECS from '../../libs/pixi-ecs';
import Matter from "matter-js";
import { IS_DEVEL, Names } from "../constants";

export class Helper {
	static addPhysicalObject(binder: PixiMatter.MatterBind, obj: Matter.Body) {
		if (IS_DEVEL) {
			binder.addBody(obj);
		} else {
			Matter.World.add(binder.mWorld, obj);
		}
	}

	static removePhysicalObject(binder: PixiMatter.MatterBind, obj: Matter.Body) {
		if (IS_DEVEL) {
			let toDestroy = binder.findSyncObjectForBody(obj);
			if (toDestroy != null && toDestroy.destroyed === false) {
				toDestroy.destroy();
				Matter.World.remove(binder.mWorld, obj);
			}
		} else {
			Matter.World.remove(binder.mWorld, obj);
		}
	}

	// return container for defined name
    static getContainer(scene: ECS.Scene, name: Names) : ECS.Container {
        let parent: ECS.Container = scene.stage.getChildByName(name) as ECS.Container;
        if (parent == undefined) {
            parent = new ECS.Container(name);
		    scene.stage.addChild(parent);
        }
        return parent;
    }
}
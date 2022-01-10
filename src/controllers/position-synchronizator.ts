//Copied from pixi-matter/matter-body
import * as Matter from 'matter-js';
import * as ECS from '../../libs/pixi-ecs';

export class PositionSynchronizator extends ECS.Component {

    physicalObject: Matter.Body

    constructor(physicalObject: Matter.Body) {
        super();
        this.physicalObject = physicalObject;
    }

    onUpdate(delta: number, absolute: number) {
        // synchronize position and rotation
        if (!this.physicalObject.isStatic) {
            // static bodies have rotation hardcoded in their vertices
            this.owner.rotation = this.physicalObject.angle;
        }
        this.owner.position.x = this.physicalObject.position.x;
        this.owner.position.y = this.physicalObject.position.y;
    }
}

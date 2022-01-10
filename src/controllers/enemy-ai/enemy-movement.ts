import * as ECS from '../../../libs/pixi-ecs';
import { Attributes, CharacterMovement } from '../../constants';

export abstract class EnemyMovement extends ECS.Component {

    enemyBody: Matter.Body;
    isRunning: boolean;
    movementAttribute: CharacterMovement;

    constructor(enemyBody: Matter.Body) {
        super();
        this.enemyBody = enemyBody;
        this.isRunning = false;
    }

    onInit() {
        this.movementAttribute = this.owner.getAttribute(Attributes.CHARACTER_MOVEMENT);
    }

    onUpdate(delta: number, absolute: number) {
        if (this.isRunning === false) {
            this.conditionallySetMovementAttribute(CharacterMovement.STAND);
            return;
        } 

		// update dynamics and set new position
		let force = this.calcForce(delta);
		if (force == null) {
			this.finish();
			return;
		}

        force = force.limit(30);
        let newForce = this.force.add(force.multiply(delta * 0.000005));
        this.enemyBody.force = { x: newForce.x, y: newForce.y };

        if (Math.abs(newForce.x) >= Math.abs(newForce.y)) {
            this.conditionallySetMovementAttribute(newForce.x > 0 ? CharacterMovement.WALKING_TO_RIGHT : CharacterMovement.WALKING_TO_LEFT);
        } else {
            this.conditionallySetMovementAttribute(newForce.y > 0 ? CharacterMovement.WALKING_TO_DOWN : CharacterMovement.WALKING_TO_UP);
        }
    }

    get velocity() :ECS.Vector {
        let vel = this.enemyBody.velocity;
        return new ECS.Vector(isNaN(vel.x) ? 0 : vel.x, isNaN(vel.y) ? 0 : vel.y);
    }

    get force() : ECS.Vector {
        return new ECS.Vector(this.enemyBody.force.x, this.enemyBody.force.y);
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    private conditionallySetMovementAttribute(newAttribute: CharacterMovement) {
        if (this.movementAttribute !== newAttribute) {
            this.movementAttribute = newAttribute;
            this.owner.assignAttribute(Attributes.CHARACTER_MOVEMENT, newAttribute);
        }
    }

    protected abstract calcForce(delta: number): ECS.Vector;
}
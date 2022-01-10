import { Steering } from '../../../libs/aph-math';
import * as ECS from '../../../libs/pixi-ecs';
import { EnemyMovement } from './enemy-movement';

export class EnemyWander extends EnemyMovement {

    wanderTarget = new ECS.Vector(0, 0);
    wanderDistance: number;
    wanderRadius: number;
	wanderJittering: number;

    constructor(enemyBody: Matter.Body, wanderDistance: number, wanderRadius: number, wanderJittering: number) {
        super(enemyBody);
        this.wanderDistance = wanderDistance;
		this.wanderRadius = wanderRadius;
		this.wanderJittering = wanderJittering;
    }

    protected calcForce(delta: number): ECS.Vector {
        let velocity = this.velocity;
        if (velocity.magnitudeSquared() == 0) {
            // we don't want zero velocity vector -> set small velocity vector
            velocity = velocity.add(new ECS.Vector(0.0001, 0.001));
        }

        let force = Steering.wander(velocity, this.wanderTarget, this.wanderRadius, this.wanderDistance, this.wanderJittering, delta);
		this.wanderTarget = force[1];
        /*
		let positionRect = this.owner.getBounds();
		let position = this.sceneModel.worldToMap(positionRect.x + positionRect.width / 2, positionRect.y + positionRect.height / 2);
		let velocity = this.owner.getAttribute<ECS.Vector>(ATTR_VELOCITY);
		let direction = velocity.normalize();
		let targetCell = position.add(direction);
		let targetCellDec = new ECS.Vector(Math.round(targetCell.x), Math.round(targetCell.y));
		let isObstacle = this.sceneModel.map.notInside(targetCellDec) || this.sceneModel.map.hasObstruction(targetCellDec);

		// simple collision avoidance by using repulsive forces
		if (isObstacle) {
			// repulsive force
			let isDiagonal = targetCellDec.x !== position.x && targetCellDec.y !== position.y;
			let isHorizontal = targetCellDec.y === position.y;
			let isVertical = targetCellDec.x === position.x;
			let randomShift = Math.random() * velocity.magnitudeSquared();
			if (isDiagonal) {
				this.wanderTarget = new ECS.Vector(-velocity.x * 10 + randomShift, -velocity.y * 10 + randomShift);
			} else if (isHorizontal) {
				this.wanderTarget = new ECS.Vector(-velocity.x * 10 + randomShift, velocity.y * 10 + randomShift);
			} else if (isVertical) {
				this.wanderTarget = new ECS.Vector(velocity.x * 10 + randomShift, -velocity.y * 10 + randomShift);
			}
		}
        */
		return force[0];// no repulsive force
    }
}
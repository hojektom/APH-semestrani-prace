import Matter, { Body } from 'matter-js';
import * as ECS from '../../libs/pixi-ecs';
import { MOVEMENT_MULTIPLICATOR, Attributes, CharacterMovement, Messages } from '../constants';
import { ObjectsFactory } from '../factories/objects-factory';

// how long is player's movement blocked after shooting
const SHOOT_STAND_LIMIT = 200;

// shooting directions ... key is enum (definition of direction)
// value is min and max of shooting angle in degrees
const SHOOTING_DIRECTIONS: Map<CharacterMovement, [number, number]> = new Map([
	[ CharacterMovement.SHOOT_UP, [ -112.5, -67.5 ] ],
	[ CharacterMovement.SHOOT_UP_RIGHT, [ -67.5, -22.5 ] ],
	[ CharacterMovement.SHOOT_RIGHT, [ -22.5, 22.5 ] ],
	[ CharacterMovement.SHOOT_RIGHT_DOWN, [ 22.5, 67.5 ] ],
	[ CharacterMovement.SHOOT_DOWN, [ 67.5, 112.5 ] ],
	[ CharacterMovement.SHOOT_DOWN_LEFT, [ 112.5, 157.5 ] ],
	[ CharacterMovement.SHOOT_LEFT, [ 157.5, 180.0 ] ],
	[ CharacterMovement.SHOOT_LEFT_UP, [ -157.5, -112.5 ] ]
]);

export default class PlayerController extends ECS.Component {

	playerBody: Matter.Body;
	shotTime: number = 0;
	playerFail: boolean = false;
	
	constructor(playerBody: Matter.Body) {
		super();
		this.playerBody = playerBody;
	}

	onInit() {
		this.subscribe(Messages.PLAYER_HIT);
	}

	onDetach(): void {
		this.unsubscribe(Messages.PLAYER_HIT);
	}

	onMessage(msg: ECS.Message) {
		this.playerFail = true;
	}

	goLeft(delta: number) {
		if (this.canMove(delta)) {
			this.changePositionBy(-1 * MOVEMENT_MULTIPLICATOR * delta, 0);
			this.conditionallySetMovementAttribute(CharacterMovement.WALKING_TO_LEFT);
		}
	}

	goRight(delta: number) {
		if (this.canMove(delta)) {
			this.changePositionBy(MOVEMENT_MULTIPLICATOR * delta, 0);
			this.conditionallySetMovementAttribute(CharacterMovement.WALKING_TO_RIGHT);
		}
	}

	goUp(delta: number) {
		if (this.canMove(delta)) {
			this.changePositionBy(0, -1 * MOVEMENT_MULTIPLICATOR * delta);
			this.conditionallySetMovementAttribute(CharacterMovement.WALKING_TO_UP);
		}
	}

	goDown(delta: number) {
		if (this.canMove(delta)) {
			this.changePositionBy(0, MOVEMENT_MULTIPLICATOR * delta);
			this.conditionallySetMovementAttribute(CharacterMovement.WALKING_TO_DOWN);
		}
	}

	stand(delta: number) {
		if (this.canMove(delta)) {
			this.conditionallySetMovementAttribute(CharacterMovement.STAND);
		}
	}

	shoot(mouseX: number, mouseY: number) {
		this.shotTime = SHOOT_STAND_LIMIT;
		this.conditionallySetMovementAttribute(this.shootDirection(mouseX, mouseY));
		new ObjectsFactory().createProjectile(
			this.playerBody.position.x, this.playerBody.position.y, 
			mouseX, mouseY, this.owner.name);
	}

	// is enable movement? (after shooting there is small delay, when we cannot move)
	private canMove(delta: number) : boolean {
		if (this.playerFail) {
			// player fail
			return false;
		}

		// check shooting time
		this.shotTime -= delta;
		if (this.shotTime <= 0) {
			this.shotTime = 0;
			// time expire
			return true;
		}
		// time still running, no expiration
		return false;
	}

	// change position of player
	private changePositionBy(x: number, y: number) {
		Body.setPosition(this.playerBody, 
			{ x: this.playerBody.position.x + x, y: this.playerBody.position.y + y });
	}

	// conditionally set sent attribute, if it is not already set
	private conditionallySetMovementAttribute(newAttribute: CharacterMovement) {
        if (this.owner.getAttribute(Attributes.CHARACTER_MOVEMENT) as CharacterMovement !== newAttribute) {
			this.owner.assignAttribute(Attributes.CHARACTER_MOVEMENT, newAttribute);
		}
    }

	// check shooting direction
	private shootDirection(mouseX: number, mouseY: number) : CharacterMovement {
		let diffX = mouseX - this.playerBody.position.x;
		let diffY = mouseY - this.playerBody.position.y;
		let angle = this.radiansToDegrees(Math.atan2(diffY, diffX));

		for (let [key, [min, max]] of SHOOTING_DIRECTIONS) {
			if (key === CharacterMovement.SHOOT_LEFT) {
				// this is special case
				if (Math.abs(angle) > min && Math.abs(angle) <= max) {
					return key;
				}
			} else {
				if (angle > min && angle <= max) {
					return key;
				}
			}
		}
		// if I get here, I don't know correct direction
		return CharacterMovement.SHOOT_UP;
	}

	// converts radians to degrees
	private radiansToDegrees(radians: number) {
		return radians * 180 / Math.PI;
	}

}
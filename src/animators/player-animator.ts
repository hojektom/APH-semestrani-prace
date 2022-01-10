import * as PIXI from 'pixi.js';
import { Message } from '../../libs/pixi-ecs';
import { PLAYER_ANIM_FREQUENCY, CharacterMovement, Attributes, Messages } from '../constants';
import { CharacterAnimator } from './character-movement';

const PLAYER_MOVEMENT_FRAMES = 3;

const PLAYER_FAIL_FRAME_DIV = 2;

const SHOOTING_POSITIONS: Map<CharacterMovement, [number, number]> = new Map([
	[ CharacterMovement.SHOOT_UP, [ 27, 51 ] ],
	[ CharacterMovement.SHOOT_UP_RIGHT, [ 0, 34 ] ],
	[ CharacterMovement.SHOOT_RIGHT, [ 9, 34 ] ],
	[ CharacterMovement.SHOOT_RIGHT_DOWN, [ 18, 34 ] ],
	[ CharacterMovement.SHOOT_DOWN, [ 27, 34 ] ],
	[ CharacterMovement.SHOOT_DOWN_LEFT, [ 0, 51 ] ],
	[ CharacterMovement.SHOOT_LEFT, [ 9, 51 ] ],
	[ CharacterMovement.SHOOT_LEFT_UP, [ 18, 51 ] ]
]);
const PLAYER_FAIL: Array<[number, number]>  = [ [ 18, 68 ], [ 63, 68 ] ];

export class PlayerAnimator extends CharacterAnimator {

	sprite = {
		offsetMultX: 9,
		offsetMultY: 17,
		width: 8,
		height: 16
	};

	spriteDestroy = {
		width: 8,
		height: 17
	}

	fail: boolean = false;

	onInit() {
		super.onInit();
		this.fixedFrequency = PLAYER_ANIM_FREQUENCY;
		this.updateFrame();

		this.subscribe(Messages.PLAYER_HIT);
	}

	onDetach() {
		this.unsubscribe(Messages.PLAYER_HIT);
	}

	onFixedUpdate() {
		this.updateFrame();
	}

	private updateFrame() {
		if (this.fail) {
			this.updateFailState();
			return;
		}

		let currAttribute: CharacterMovement = this.owner.getAttribute(Attributes.CHARACTER_MOVEMENT);
		this.resetFrameNumber(currAttribute);
		let posX = -1, posY = -1;

		switch (currAttribute) {
			case CharacterMovement.STAND:
				if (this.lastAttribute as CharacterMovement !== currAttribute as CharacterMovement) {
					posX = 0;
					posY = 0;
					this.frameNumber = 0;
				}
				break;
			case CharacterMovement.WALKING_TO_LEFT:
				posX = this.frameNumber * this.sprite.offsetMultX + this.sprite.offsetMultX;
				posY = this.sprite.offsetMultY;
				this.frameNumber = (this.frameNumber + 1) % PLAYER_MOVEMENT_FRAMES;
				break;
			case CharacterMovement.WALKING_TO_DOWN:
			case CharacterMovement.WALKING_TO_RIGHT:
			case CharacterMovement.WALKING_TO_UP:
				posX = this.frameNumber * this.sprite.offsetMultX + this.sprite.offsetMultX;
				posY = 0;
				this.frameNumber = (this.frameNumber + 1) % PLAYER_MOVEMENT_FRAMES;
				break;
			default:
				[posX, posY] = SHOOTING_POSITIONS.get(currAttribute);
		}

		if (posX !== -1 && posY !== -1) {
			const txt = this.owner.asSprite().texture;
			txt.frame = new PIXI.Rectangle(posX, posY, this.sprite.width, this.sprite.height);
		}
		this.lastAttribute = currAttribute;
	}

	private updateFailState() {
		let frame = Math.floor(this.frameNumber / PLAYER_FAIL_FRAME_DIV);
		if (frame >= PLAYER_FAIL.length) {
			this.frameNumber = 0;
			frame = Math.floor(this.frameNumber / PLAYER_FAIL_FRAME_DIV);
		}
		let posX = PLAYER_FAIL[frame][0];
		let posY = PLAYER_FAIL[frame][1];
		this.frameNumber += 1;

		const txt = this.owner.asSprite().texture;
		txt.frame = new PIXI.Rectangle(posX, posY, this.spriteDestroy.width, this.spriteDestroy.height);

	}

	onMessage(msg: Message) {
		this.frameNumber = 0;
		this.fail = true;
	}
}
import * as PIXI from 'pixi.js';
import { ENEMY_ANIM_FREQUENCY, CharacterMovement, Attributes } from '../constants';
import { CharacterAnimator } from './character-movement';

const ENEMY_STAND_FRAMES = 6;
const ENEMY_LEFT_FRAMES: Array<[number, number]>  = [ [ 124, 104 ], [ 115, 104 ] ];
const ENEMY_RIGHT_FRAMES: Array<[number, number]> = [ [ 88, 104 ], [ 97, 104 ] ];
const ENEMY_UP_FRAMES: Array<[number, number]>    = [ [ 115, 117 ], [ 124, 117 ], [ 133, 117 ] ];
const ENEMY_DOWN_FRAMES: Array<[number, number]>  = [ [ 88, 117 ], [ 97, 117 ], [ 106, 117 ] ];
const ENEMY_DESTROY: Array<[number, number]>  = [ [ 142, 92 ], [ 159, 92 ], [ 142, 111 ], [ 159, 111 ] ];

export class EnemyAnimator extends CharacterAnimator {

	sprite = {
        width: 8,
		height: 11,
		offsetMultX: 9,
        startX: 88,
        startY: 91
	};

	spriteDestroy = {
		width: 16,
		height: 18
	}

	destroyed: boolean = false;

	onInit() {
		this.fixedFrequency = ENEMY_ANIM_FREQUENCY;
		this.updateFrame();
	}

	onFixedUpdate() {
		this.updateFrame();
	}

	private updateFrame() {
        let destroyedAttr: boolean = this.owner.getAttribute(Attributes.DESTROYED);
		let posX = -1, posY = -1;
		let width = this.sprite.width;
		let height = this.sprite.height;

		if (destroyedAttr) {
			if (this.destroyed === false) {
				this.frameNumber = 0;
				this.destroyed = true;
			}
			if (this.frameNumber === ENEMY_DESTROY.length) {
				this.owner.destroy();
				return;
			}
			posX = ENEMY_DESTROY[this.frameNumber][0];
			posY = ENEMY_DESTROY[this.frameNumber][1];
			width = this.spriteDestroy.width;
			height = this.spriteDestroy.height;
			this.frameNumber += 1;
		} else {
			[ posX, posY ] = this.processCharacterMovementAttribute(posX, posY);
		}

		if (posX !== -1 && posY !== -1) {
            const txt = this.owner.asSprite().texture;
			txt.frame = new PIXI.Rectangle(posX, posY, width, height);
		}
	}

	// process change of animation according set character movevent attribute
	processCharacterMovementAttribute(initPosX: number, initPosY: number) : [number, number] {
		let currAttribute: CharacterMovement = this.owner.getAttribute(Attributes.CHARACTER_MOVEMENT);
		this.resetFrameNumber(currAttribute);
		let posX = initPosX, posY = initPosY;

		switch (currAttribute) {
			case CharacterMovement.STAND:
				posX = this.sprite.startX + this.frameNumber * this.sprite.offsetMultX;
				posY = this.sprite.startY;
				this.frameNumber = (this.frameNumber + 1) % ENEMY_STAND_FRAMES;
				break;
			case CharacterMovement.WALKING_TO_LEFT:
				posX = ENEMY_LEFT_FRAMES[this.frameNumber][0];
				posY = ENEMY_LEFT_FRAMES[this.frameNumber][1];
				this.frameNumber = (this.frameNumber + 1) % ENEMY_LEFT_FRAMES.length;
				break;
			case CharacterMovement.WALKING_TO_DOWN:
				posX = ENEMY_DOWN_FRAMES[this.frameNumber][0];
				posY = ENEMY_DOWN_FRAMES[this.frameNumber][1];
				this.frameNumber = (this.frameNumber + 1) % ENEMY_DOWN_FRAMES.length;
				break;
			case CharacterMovement.WALKING_TO_RIGHT:
				posX = ENEMY_RIGHT_FRAMES[this.frameNumber][0];
				posY = ENEMY_RIGHT_FRAMES[this.frameNumber][1];
				this.frameNumber = (this.frameNumber + 1) % ENEMY_RIGHT_FRAMES.length;
				break;
			case CharacterMovement.WALKING_TO_UP:
				posX = ENEMY_UP_FRAMES[this.frameNumber][0];
				posY = ENEMY_UP_FRAMES[this.frameNumber][1];
				this.frameNumber = (this.frameNumber + 1) % ENEMY_UP_FRAMES.length;
				break;
		}
		this.lastAttribute = currAttribute;
		return [ posX, posY ];
	}
}
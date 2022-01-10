import * as ECS from '../../libs/pixi-ecs';
import { CharacterMovement } from '../constants';

export abstract class CharacterAnimator extends ECS.Component {

    frameNumber = 0;
    lastAttribute: CharacterMovement = null;

    resetFrameNumber(currAttribute: CharacterMovement) {
        if (currAttribute !== this.lastAttribute) {
            this.frameNumber = 0;
        }
    }
}
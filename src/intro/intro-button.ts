import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants';

export class IntroButton extends ECS.Component {

    onInit(): void {
        this.owner.on('pointerdown', this.click.bind(this));
    }

    onDetach(): void {
        this.owner.removeAllListeners();
    }

    click() {
        this.sendMessage(Messages.GAME_START);
    }
}
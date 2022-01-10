import * as ECS from '../../libs/pixi-ecs';
import { IntroText } from './intro-text';

export class IntroMain {
    
    display(scene: ECS.Scene) {
        IntroText.buildMainTitle(scene);
        IntroText.buildPlayerName(scene);
        IntroText.buildStartButton(scene);
    }

    remove(scene: ECS.Scene) {
        IntroText.removeAll(scene);
    }

}
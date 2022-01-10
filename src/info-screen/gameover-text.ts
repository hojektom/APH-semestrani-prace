import * as ECS from '../../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import { Colors, FontDetails, InfoScreen as InfoScreenEnum } from "../constants";
import { InfoScreen } from './info-screen';

export class GameOver {

    static build(scene: ECS.Scene, score: number, time: number) {
        this.buildGameOver(scene);
        InfoScreen.buildScoreText(scene, score);
        InfoScreen.buildTimeText(scene, time);
    }

    static buildGameOver(scene: ECS.Scene) {
        new ECS.Builder(scene)
            .anchor(0.5, 0.5)
            .localPos(InfoScreenEnum.POS_X, InfoScreenEnum.POS_Y)
            .asText('GAME OVER', new PIXI.TextStyle({ fill: Colors.COLOR_ORANGE, fontSize: InfoScreenEnum.TITLE_SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
            .withParent(scene.stage)
            .build();
    }
}
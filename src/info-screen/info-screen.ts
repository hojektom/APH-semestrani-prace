import * as ECS from '../../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import { Colors, FontDetails, InfoScreen as InfoScreenEnum } from "../constants";
import { convertTimeToString } from '../utils';

export class InfoScreen {
    static buildScoreText(scene: ECS.Scene, score: number) {
        new ECS.Builder(scene)
            .anchor(0.5, 0.5)
            .localPos(InfoScreenEnum.POS_X, InfoScreenEnum.YOUR_SCORE_TEXT_X)
            .asText(`your score: ${score}`,
                new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: InfoScreenEnum.TEXT_SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
            .withParent(scene.stage)
            .build();
    }

    static buildTimeText(scene: ECS.Scene, timeInMilis: number) {
        new ECS.Builder(scene)
            .anchor(0.5, 0.5)
            .localPos(InfoScreenEnum.POS_X, InfoScreenEnum.YOUR_TIME_TEXT_X)
            .asText(`your time: ${convertTimeToString(timeInMilis)}`,
                new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: InfoScreenEnum.TEXT_SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
            .withParent(scene.stage)
            .build();
    }
}
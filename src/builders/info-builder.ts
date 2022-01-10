import * as ECS from '../../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import { Assets, Attributes, Colors, FontDetails, Names, SizesAndPositions } from '../constants';
import { ScoreController } from '../controllers/score-controller';
import { createTexture } from '../utils';
import { TimeController } from '../controllers/time-controller';

export class InfoBuilder {
    // create and build complete status bar with all items
    static build(scene: ECS.Scene, score: number, extraLifes: number, playerName: string, initTime: number) {
        let statusBar = this.createStatusBar(scene).build();
        this.createScore(scene, statusBar, score).build();
		this.createPlayerName(scene, statusBar, playerName).build();
		this.createTimer(scene, statusBar, initTime).build();
        this.buildHealthIndicators(scene, statusBar, extraLifes);
    }

    // create and build complete health indicator status
	static buildHealthIndicators (scene: ECS.Scene, parent: ECS.Container, extraLifes: number) {
		let healthContainer = new ECS.Builder(scene)
			.withName(Names.HEALTH_INDICATOR_CONTAINER)
			.anchor(0, 0.5)
			.localPos(SizesAndPositions.HEALTH_START_POS_X, SizesAndPositions.STATUS_BAR_HEIGHT / 2)
			.withParent(parent)
			.asContainer()
			.build();
		for (let i = 0; i < extraLifes; i++) {
			new ECS.Builder(scene)
				.anchor(0.5, 0.5)
				.localPos(i * SizesAndPositions.HEALTH_POS_MILTIPLICATOR, 0)
				.scale(Assets.SCALE * 1.2)
				.asSprite(createTexture(0, 24, 7, 8))
				.withParent(healthContainer)
				.build();
		}
	}

	static createTimer = (scene: ECS.Scene, parent: ECS.Container, initTime: number) : ECS.Builder => {
		return new ECS.Builder(scene)
			.withName(Names.TIMER)
			.anchor(1, 0.5)
			.localPos(SizesAndPositions.TIMER_POS_X, SizesAndPositions.STATUS_BAR_HEIGHT / 2)
			.withComponent(new TimeController(initTime))
			.asText(null, new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: FontDetails.SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
			.withParent(parent);
	}

    // create and return empty status bar as container for another objects 
    // like score, player name, ... (unbuilt!)
    static createStatusBar = (scene: ECS.Scene) : ECS.Builder => {
		return new ECS.Builder(scene)
			.withName(Names.STATUS_BAR)
			.anchor(0, 0)
			.globalPos(0, scene.height - SizesAndPositions.STATUS_BAR_HEIGHT)
			.withParent(scene.stage)
			.asContainer();
	}

    // create and return score field (unbuilt!)
	static createScore = (scene: ECS.Scene, parent: ECS.Container, score: number) : ECS.Builder => {
		return new ECS.Builder(scene)
			.withName(Names.SCORE)
			.anchor(1, 0.5)
			.localPos(SizesAndPositions.SCORE_END_POS_X, SizesAndPositions.STATUS_BAR_HEIGHT / 2)
			.withComponent(new ScoreController(score))
			.asText(null, new PIXI.TextStyle({ fill: Colors.COLOR_GREEN, fontSize: FontDetails.SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
			.withParent(parent);
	}

    // create and return player name text (unbuilt!)
	static createPlayerName = (scene: ECS.Scene, parent: ECS.Container, playerName: string) : ECS.Builder => {
		return new ECS.Builder(scene)
			.withName(Names.PLAYER_NAME)
			.anchor(1, 0.5)
			.localPos(SizesAndPositions.PLAYER_NAME_POS_X, SizesAndPositions.STATUS_BAR_HEIGHT / 2)
			.asText(playerName, new PIXI.TextStyle({ fill: Colors.COLOR_ORANGE, fontSize: FontDetails.SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
			.withParent(parent);
	}

	static removeAll(scene: ECS.Scene) {
		let statusBar = scene.findObjectsByName(Names.STATUS_BAR);
		statusBar.pop().destroy();
	}
}

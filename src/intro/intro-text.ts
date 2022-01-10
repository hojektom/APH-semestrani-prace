import * as ECS from '../../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import { Colors, FontDetails, Intro } from '../constants';
import { IntroButton } from './intro-button';
import { IntroPlayerName } from './intro-player-name';

export class IntroText {

    static _introTitle: ECS.Container;
    static _button: ECS.Container;
    static _playerName: ECS.Container;

    // create main text
	static buildMainTitle (scene: ECS.Scene) {
		this._introTitle = new ECS.Builder(scene)
			.anchor(0.5, 0.5)
			.localPos(Intro.POS_X, Intro.TITLE_POS_Y)
			.asText('Berzerk', new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: Intro.TITLE_SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
			.withParent(scene.stage)
            .build();
	}

    // create and 
    static buildPlayerName (scene: ECS.Scene) {
        this._playerName = new ECS.Builder(scene)
            .anchor(0.5, 0.5)
			.globalPos(Intro.POS_X, Intro.NAME_POS_Y)
			.withParent(scene.stage)
			.asContainer()
            .build();
        this._playerName.addChild(this.playerNameText(scene, this._playerName).build());
        this._playerName.addChild(this.playerNameComponent(scene, this._playerName).build());
    }

    // create button for game start
    static buildStartButton (scene: ECS.Scene) {
		this._button = new ECS.Container();
        scene.stage.addChild(this._button);

        let background = this.startButtonObject(scene);
        this._button.addChild(background);

        background.addChild(this.startButtonText(scene, background).build());
        
        this._button.interactive = true;
        this._button.buttonMode = true;
        this._button.addComponent(new IntroButton());
	}

    // removes all created objects
    static removeAll(scene: ECS.Scene) {
        if (this._button != null && this._button.destroyed === false) {
            this._button.destroy();
        }
        if (this._introTitle != null && this._introTitle.destroyed === false) {
            this._introTitle.destroy();
        }
        if (this._playerName != null && this._playerName.destroyed === false) {
            this._playerName.destroy();
        }
    }

    // button background
    private static startButtonObject = (scene: ECS.Scene) : ECS.Graphics => {
        const graphics = new ECS.Graphics();
		graphics.beginFill(Intro.BUTTON_COLOR);
		graphics.drawRoundedRect(Intro.START_BUTTON_X, Intro.START_BUTTON_Y, Intro.BUTTON_WIDTH, Intro.BUTTON_HEIGHT, Intro.BUTTON_RADIUS);
		graphics.endFill();
        return graphics;
    }

    // button text
    private static startButtonText = (scene: ECS.Scene, parent: ECS.Container) : ECS.Builder => {
        return new ECS.Builder(scene)
            .anchor(0.5, 0.5)
            .localPos(Intro.POS_X, Intro.BUTTON_TEXT_Y)
            .asText('Start the game', new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: FontDetails.SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
            .withParent(parent);
    }

    // player name text (title)
    private static playerNameText = (scene: ECS.Scene, parent: ECS.Container) : ECS.Builder => {
        return new ECS.Builder(scene)
            .anchor(1, 0.5)
            .localPos(-10, 0)
            .asText('type your name:', new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: FontDetails.SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
            .withParent(parent);
    }

    private static playerNameComponent = (scene: ECS.Scene, parent: ECS.Container) : ECS.Builder => {
        return new ECS.Builder(scene)
            .anchor(0, 0.5)
            .localPos(10, 0)
            .withComponent(new IntroPlayerName())
            .asText(null, new PIXI.TextStyle({ fill: Colors.COLOR_WHITE, fontSize: FontDetails.SIZE, fontFamily: FontDetails.FONT_FAMILY.toString() }))
            .withParent(parent);
    }
}
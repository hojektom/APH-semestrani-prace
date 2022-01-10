import * as ECS from '../../libs/pixi-ecs';
import { LevelManager } from '../level-manager';

const KEY_BACKSPACE = 8;

export class IntroPlayerName extends ECS.Component {
    keyInput: ECS.KeyInputComponent;
    levelManager: LevelManager;
    playerName: string = '';

    static PLAYER_NAME_MAX_LENGTH = 10;
    static NAME_EMPTY_SIGN = '-';

    static _SUPPORTED_KEYS: Array<ECS.Keys> = [ECS.Keys.KEY_A, ECS.Keys.KEY_B, ECS.Keys.KEY_C, ECS.Keys.KEY_D, ECS.Keys.KEY_E, ECS.Keys.KEY_F,
        ECS.Keys.KEY_G, ECS.Keys.KEY_H, ECS.Keys.KEY_I, ECS.Keys.KEY_J, ECS.Keys.KEY_K, ECS.Keys.KEY_L, ECS.Keys.KEY_M, ECS.Keys.KEY_N, 
        ECS.Keys.KEY_O, ECS.Keys.KEY_P, ECS.Keys.KEY_Q, ECS.Keys.KEY_R, ECS.Keys.KEY_S, ECS.Keys.KEY_T, ECS.Keys.KEY_U, ECS.Keys.KEY_V,
        ECS.Keys.KEY_W, ECS.Keys.KEY_X, ECS.Keys.KEY_Y, ECS.Keys.KEY_Z];

    onInit() {
		this.findKeyComponent();
        this.levelManager = this.scene.findGlobalComponentByName(LevelManager.name);
	}

    onUpdate(delta: number, absolute: number) {
        if (this.keyInput == null) {
			this.findKeyComponent();
		}
        
        if (this.playerName.length < IntroPlayerName.PLAYER_NAME_MAX_LENGTH) {
            IntroPlayerName._SUPPORTED_KEYS.forEach(key => {
                if (this.keyInput.isKeyPressed(key)) {
                    let rval = String.fromCodePoint(key);
                    if (!this.keyInput.isKeyPressed(ECS.Keys.KEY_SHIFT)) {
                        rval = rval.toLowerCase();
                    }
                    this.keyInput.handleKey(key);
                    this.playerName += rval;
                }
            });
        }

        if (this.keyInput.isKeyPressed(8)) {
            this.keyInput.handleKey(KEY_BACKSPACE);
            this.playerName = this.playerName.slice(0, -1);
        }

        this.displayPlayerName();
    }

    displayPlayerName() {
        let emptyString = IntroPlayerName.NAME_EMPTY_SIGN.repeat(IntroPlayerName.PLAYER_NAME_MAX_LENGTH - this.playerName.length);
		this.owner.asText().text = this.playerName + emptyString;
        this.levelManager.model.setPlayerName(this.playerName);
	}

    private findKeyComponent() {
		this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
	}
}
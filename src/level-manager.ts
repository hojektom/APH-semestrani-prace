import * as ECS from '../libs/pixi-ecs';
import { Messages } from './constants';
import { ObjectsFactory } from './factories/objects-factory';
import { GameOver } from './info-screen/gameover-text';
import { IntroMain } from './intro/intro-main';
import { LevelLoader } from './loaders/level-loader';
import { GameModel } from './model/game-model';
import { Winner } from './info-screen/winner-text';

export class LevelManager extends ECS.Component {

    model: GameModel;
    factory: ObjectsFactory;
    intro: IntroMain;

    constructor(engine: ECS.Engine) {
        super();
        this.model = new GameModel(LevelLoader.load(engine));
        this.factory = new ObjectsFactory();
        this.intro = new IntroMain();
    }

    onInit() {
        this.subscribe(Messages.COMPLETE_LEVEL);
        this.subscribe(Messages.GAME_START);
        this.subscribe(Messages.PLAYER_HIT);

        if (this.model.getCurrentLevelNumber() === 0) {
		    this.intro.display(this.scene);
        } else {
            this.factory.initializeLevel(this.model);
        }
    }

    onDetach(): void {
        this.unsubscribe(Messages.COMPLETE_LEVEL);
        this.unsubscribe(Messages.GAME_START);
    }

    onMessage(msg: ECS.Message) {
        if (msg.action === Messages.COMPLETE_LEVEL) {
            this.model.updateScore(msg.data);
            this.scene.callWithDelay(0, () => this.nextLevel());
        } else if (msg.action === Messages.GAME_START) {
            this.scene.callWithDelay(0, () => this.startTheGame());
        } else if (msg.action === Messages.PLAYER_HIT) {
            this.scene.callWithDelay(2000, () => this.resetLevelOrGameOver());
        }
    }

    private resetLevelOrGameOver() {
        let lost: boolean = this.model.loseLife();
        this.factory.resetGame();
        if (lost) {
            this.factory.initializeLevel(this.model);
        } else {
            GameOver.build(this.scene, this.model.getScore(), this.model.getInitialTime());
        }
    }

    private nextLevel() {
        this.factory.resetGame();
        let loadNextLevel = this.model.nextLevel();
        if (loadNextLevel) {
            this.model.addLife();
            this.factory.initializeLevel(this.model);
        } else {
            Winner.build(this.scene, this.model.getScore(), this.model.getInitialTime());
        }
    }

    private startTheGame() {
        this.intro.remove(this.scene);
        this.model.nextLevel();
        this.factory.initializeLevel(this.model);
    }
}
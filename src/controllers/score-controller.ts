import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants';
import { ObjectsFactory } from '../factories/objects-factory';
import { ScoreIncrease } from '../model/collision-struct';

export class ScoreController extends ECS.Component {

	score: number;

	constructor(score: number) {
		super();
		this.score = score;
	}

	onInit() {
		this.subscribe(Messages.ADD_SCORE);
		this.subscribe(Messages.COMPLETE_LEVEL);
		this.displayScore();
	}

	onDetach() {
		this.unsubscribe(Messages.ADD_SCORE);
		this.unsubscribe(Messages.COMPLETE_LEVEL);
	}

	displayScore() {
		this.owner.asText().text = this.score.toString();
	}

	onMessage(msg: ECS.Message) {
		if (msg.action === Messages.ADD_SCORE) {
        	let data: ScoreIncrease = msg.data;
        	this.score += data.type;
			this.displayScore();
		} else if (msg.action === Messages.COMPLETE_LEVEL) {
			new ObjectsFactory().updateModelScore(this.score);
		}
    }
}
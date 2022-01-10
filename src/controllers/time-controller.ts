import { utils } from 'pixi.js';
import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants';
import { ObjectsFactory } from '../factories/objects-factory';
import { convertTimeToString } from '../utils';

export class TimeController extends ECS.Component {
    
    // starting time in milis
    startingTime: number;
    stop: boolean = false;

    constructor(initialTime: number) {
        super();
        this.startingTime = new Date().getTime();
        this.startingTime -= initialTime;
    }

    onInit() {
        this.subscribe(Messages.COMPLETE_LEVEL);
	}

    onDetach() {
        this.unsubscribe(Messages.COMPLETE_LEVEL);
    }

    displayTime(timeInMilis: number) {
		this.owner.asText().text = convertTimeToString(timeInMilis);
    }

    onUpdate(delta: number, absolute: number) {
        if (this.stop === false) {
            let now: number = new Date().getTime();
            this.displayTime(now - this.startingTime);
        }
    }

    onMessage(msg: ECS.Message) {
        this.stop = true;
        let now: number = new Date().getTime();
        new ObjectsFactory().updateModelTime(now - this.startingTime);
    }
}
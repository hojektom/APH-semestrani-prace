import * as ECS from '../../libs/pixi-ecs';
import PlayerController from './player-controller';

const LeftKey = ECS.Keys.KEY_LEFT;
const RightKey = ECS.Keys.KEY_RIGHT;
const UpKey = ECS.Keys.KEY_UP;
const DownKey = ECS.Keys.KEY_DOWN;

export class PlayerInputController extends PlayerController {
	keyInput: ECS.KeyInputComponent;
	listenerCall = this.mouseclick.bind(this);

	onInit() {
		super.onInit();
		this.findKeyComponent();
		this.scene.app.view.addEventListener("mousedown", this.listenerCall);
	}

	onDetach(): void {
		this.scene.app.view.removeEventListener("mousedown", this.listenerCall);
	}

	onUpdate(delta: number, absolute: number) {
		let anyKeyPressed = false;
		if (this.keyInput == null) {
			this.findKeyComponent();
		}

		if (this.keyInput.isKeyPressed(UpKey)) {
			anyKeyPressed = true;
			this.goUp(delta);
		}

		if (this.keyInput.isKeyPressed(DownKey)) {
			anyKeyPressed = true;
			this.goDown(delta);
		}

		if (this.keyInput.isKeyPressed(LeftKey)) {
			anyKeyPressed = true;
			this.goLeft(delta);
		}

		if (this.keyInput.isKeyPressed(RightKey)) {
			anyKeyPressed = true;
			this.goRight(delta);
		}

		if (anyKeyPressed === false) {
			this.stand(delta);
		}
	}

	private findKeyComponent() {
		this.keyInput = this.scene.findGlobalComponentByName(ECS.KeyInputComponent.name);
	}

	mouseclick(e: MouseEvent) {
		this.shoot(e.offsetX, e.offsetY);
	}
}
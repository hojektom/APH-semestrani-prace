import Matter from 'matter-js';
import * as PixiMatter from '../../libs/pixi-matter';
import * as ECS from '../../libs/pixi-ecs';
import { Helper } from '../builders/helper';
import { Messages } from '../constants';
import { CollisionByProjectile } from '../model/collision-struct';

export class ProjectileController extends ECS.Component {
    projectile: Matter.Body;
    binder: PixiMatter.MatterBind;

    constructor(projectile: Matter.Body, binder: PixiMatter.MatterBind) {
		super();
		this.projectile = projectile;
        this.binder = binder;
	}

    onInit() {
        this.subscribe(Messages.ENEMY_HIT);
        this.subscribe(Messages.PLAYER_HIT);
        this.subscribe(Messages.WALL_HIT);
    }

    onDetach(): void {
        this.unsubscribe(Messages.ENEMY_HIT);
        this.unsubscribe(Messages.PLAYER_HIT);
        this.unsubscribe(Messages.WALL_HIT);
    }

    onMessage(msg: ECS.Message) {
        let data: CollisionByProjectile = msg.data;

        if (data.projectileBodyId === this.projectile.id && data.projectile != null && data.projectile.destroyed === false) {
            Helper.removePhysicalObject(this.binder, this.projectile);
            data.projectile.destroy();
        }
    }
}
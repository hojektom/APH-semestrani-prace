import * as ECS from '../../../libs/pixi-ecs';
import * as PixiMatter from '../../../libs/pixi-matter';
import { Helper } from '../../builders/helper';
import { Attributes, ENEMY_STAND_RAY_FREQ, ENEMY_WANDER_RAY_FREQ, Messages, Names, ScoreValues } from '../../constants';
import { ObjectsFactory } from '../../factories/objects-factory';
import { CollisionByProjectile, RayCollision, ScoreIncrease } from '../../model/collision-struct';
import { EnemyMovement } from './enemy-movement';
import { EnemyWander } from './enemy-wander';

export class EnemyAIController extends ECS.Component {
    
    enemyBody: Matter.Body;
    binder: PixiMatter.MatterBind;

    currentMovement: EnemyMovement;
    lastWanderTimeoutId: number = null;
    lastRayInterval: number = null;
    destroyed: boolean = false;

    player: ECS.Container;
    factory: ObjectsFactory;
    raySet: Set<number>;

    constructor(enemyBody: Matter.Body, binder: PixiMatter.MatterBind) {
        super();
        this.enemyBody = enemyBody;
        this.binder = binder;
        this.raySet = new Set();
    }

    onInit() {
        this.currentMovement = new EnemyWander(this.enemyBody, 0, 8, 0.1);
        this.owner.addComponent(this.currentMovement);
        this.player = this.scene.getGlobalAttribute(Attributes.PLAYER);
        this.factory = new ObjectsFactory();

        this.stopWander();

        this.subscribe(Messages.ENEMY_HIT);
        this.subscribe(Messages.RAY_RESULT);
    }

    onDetach() {
        this.unsubscribe(Messages.ENEMY_HIT);
        this.unsubscribe(Messages.RAY_RESULT);

        clearTimeout(this.lastWanderTimeoutId);
        clearInterval(this.lastRayInterval);
        this.currentMovement.stop();
        this.lastWanderTimeoutId = null;
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.ENEMY_HIT:
                this.processEnemyHit(msg);
                break;
            case Messages.RAY_RESULT:
                this.processRayCollision(msg);
                break;
        }
    }

    startWander() {
        clearInterval(this.lastRayInterval);
        this.lastRayInterval = setInterval(this.generateRay.bind(this), ENEMY_WANDER_RAY_FREQ);
        this.currentMovement.start();
        this.lastWanderTimeoutId = setTimeout(this.stopWander.bind(this), this.getRandomIntInclusive(this.sec(10), this.sec(20)));
    }

    stopWander() {
        clearInterval(this.lastRayInterval);
        this.lastRayInterval = setInterval(this.generateRay.bind(this), ENEMY_STAND_RAY_FREQ);
        this.currentMovement.stop();
        this.lastWanderTimeoutId = setTimeout(this.startWander.bind(this), this.getRandomIntInclusive(this.sec(5), this.sec(10)));
    }

    private generateRay() {
        this.raySet.add(this.factory.createRay(
            this.enemyBody.position.x, this.enemyBody.position.y,
            this.player.position.x, this.player.position.y));
    }

    private getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    private sec(value: number) : number {
        return value * 1000;
    }

    private processEnemyHit(msg: ECS.Message) {
        let data: CollisionByProjectile = msg.data;
        if (data.entityBodyId === this.enemyBody.id && this.destroyed === false && this.lastWanderTimeoutId != null) {
            clearTimeout(this.lastWanderTimeoutId);
            clearInterval(this.lastRayInterval);
            this.currentMovement.stop();
            this.lastWanderTimeoutId = null;
            this.removeSelf();
        }
    }

    private removeSelf() {
        this.owner.assignAttribute(Attributes.DESTROYED, true);
        this.destroyed = true;
        Helper.removePhysicalObject(this.binder, this.enemyBody);
        this.sendMessage(Messages.ADD_SCORE, { type: ScoreValues.KILLED_ENEMY } as ScoreIncrease);
    }

    private processRayCollision(msg: ECS.Message) {
        let data: RayCollision = msg.data;
        if (this.raySet.has(data.rayBody.id) && data.entityBodyId !== this.enemyBody.id) {
            // my ray
            this.raySet.delete(data.rayBody.id);
            Helper.removePhysicalObject(this.binder, data.rayBody);
            if (data.entity.name === Names.PLAYER) {
                this.factory.createProjectile(
                    this.enemyBody.position.x, this.enemyBody.position.y,
                    this.player.position.x, this.player.position.y, this.owner.name);
            }
        }
    }
}
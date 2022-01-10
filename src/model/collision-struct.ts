import Matter from 'matter-js';
import * as ECS from '../../libs/pixi-ecs';
import { ScoreValues } from '../constants';

export type CollisionByProjectile = {
    entity: ECS.Container;
    entityBodyId: number;
    projectile: ECS.Container;
    projectileBodyId: number;
}

export type RayCollision = {
    rayBody: Matter.Body;
    entity: ECS.Container;
    entityBodyId: number;
}

export type ScoreIncrease = {
    type: ScoreValues;
}

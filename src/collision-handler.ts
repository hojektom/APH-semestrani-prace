import * as ECS from '../libs/pixi-ecs';
import Matter from "matter-js";
import { CollisionByProjectile, RayCollision } from "./model/collision-struct";
import { Attributes, Messages, Names } from "./constants";

export class CollisionHandler extends ECS.Component {

    isWorking: boolean = true;

    reset() {
        this.isWorking = true;
    }

    handleCollision(colliderA: Matter.Body, colliderB: Matter.Body) {
        if (this.isWorking === false) {
            return;
        }

        if (colliderA.label === Names.RAY) {
            this.processRay(colliderA, colliderB);
        }
        if (colliderB.label === Names.RAY) {
            this.processRay(colliderB, colliderA);
        }

        if (colliderA.label === Names.PROJECTILE) {
            this.projectileHit(colliderA, colliderB);
        }
        if (colliderB.label === Names.PROJECTILE) {
            this.projectileHit(colliderB, colliderA);
        }

        if (colliderA.label === Names.PLAYER && colliderB.label === Names.DOOR) {
            this.processDoor(colliderB, colliderA);
        }

        if (colliderA.label === Names.DOOR && colliderB.label === Names.PLAYER) {
            this.processDoor(colliderA, colliderB);
        }
    }

    projectileHit(projectileBody: Matter.Body, entityBody: Matter.Body) {
        let projectile = this.scene.findObjectByName(projectileBody.label + '_' + projectileBody.id);
        let entity: ECS.Container;
        let message: Messages;

        if (entityBody.label === Names.WALL || entityBody.label === Names.ENEMY) {
            entity = this.scene.findObjectByName(entityBody.label + '_' + entityBody.id);
            message = entityBody.label === Names.WALL ? Messages.WALL_HIT : Messages.ENEMY_HIT;
        } else if (entityBody.label === Names.PLAYER) {
            entity = this.scene.findObjectByName(Names.PLAYER);
            message = Messages.PLAYER_HIT;
        } else {
            // another ignore
            return;
        }

        let sourceName: string = projectile.getAttribute(Attributes.PROJECTILE_SOURCE);
        let entityName: string = entity.name;
        if (sourceName !== entityName) {
            if (message === Messages.PLAYER_HIT) {
                // stop working
                this.isWorking = false;
            }
            this.sendMessage(message, 
                {entity: entity, entityBodyId: entityBody.id, projectile: projectile, projectileBodyId: projectileBody.id} as CollisionByProjectile);
        }
    }

    processDoor(doorBody: Matter.Body, playerBody: Matter.Body) {
        let entity = this.scene.findObjectByName(doorBody.label + '_' + doorBody.id);
        if (entity.getAttribute(Attributes.NEXT_LEVEL_DOOR) === true) {
            this.sendMessage(Messages.COMPLETE_LEVEL);
        }
    }

    processRay(rayBody: Matter.Body, otherBody: Matter.Body) {
        let entity: ECS.Container = null;
        switch(otherBody.label) {
            case Names.PLAYER:
                entity = this.scene.findObjectByName(Names.PLAYER);
                break;
            case Names.WALL:
            case Names.ENEMY:
            case Names.DOOR:
                entity = this.scene.findObjectByName(otherBody.label + '_' + otherBody.id);
                break;
            default:
                // ignore other objects
                break;
        }
        if (entity != null) {
            this.sendMessage(Messages.RAY_RESULT,
                { rayBody: rayBody, entityBodyId: otherBody.id, entity: entity } as RayCollision );
        }
    }
}
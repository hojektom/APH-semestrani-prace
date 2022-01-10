import * as ECS from '../../libs/pixi-ecs';
import { Assets } from '../constants';
import { Direction, Enemy, Level, Rotation, Wall } from '../model/game-struct';
import { enumFromValue } from '../utils';

export class LevelLoader {

    static load(engine: ECS.Engine) :Level[] {
        return this.loadFromStream(engine.app.loader.resources[Assets.LEVELS].data);
    }

    static loadFromStream = (data: any) : Level[] => {
        let levels: Level[] = [];

        data.levels.forEach(lvl => {
            levels.push(this.loadLevel(lvl));
        });
        return levels;
    }

    private static loadLevel(lvl: any) : Level {
        return {
            levelId: lvl.level,
            playerInitPos: {
                x: lvl.playerInitPos.x,
                y: lvl.playerInitPos.y
            },
            enemies: this.loadEnemies(lvl.enemies),
            walls: this.loadWalls(lvl.walls),
            prevLevelDoor: {
                dir: enumFromValue(lvl.previousLevelDoor.direction, Direction),
                position: lvl.previousLevelDoor.position
            },
            nextLevelDoor: {
                dir: enumFromValue(lvl.nextLevelDoor.direction, Direction),
                position: lvl.nextLevelDoor.position
            }
        };
    }

    private static loadEnemies(data: any) : Enemy[] {
        let enemies: Enemy[] = [];
        data.forEach(e => {
            enemies.push({ position: { x: e.x, y: e.y } });
        });
        return enemies;
    }

    private static loadWalls(data: any) : Wall[] {
        let walls: Wall[] = [];
        data.forEach(w => {
            walls.push({ 
                startPos: { x: w.start.x, y: w.start.y },
                rotation: enumFromValue(w.rotation, Rotation),
                length: w.length
            });
        });
        return walls;
    }
}
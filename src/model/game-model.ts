import { DEFAULT_EXTRA_LIFES, DEFAULT_NAME } from "../constants";
import { Door, Enemy, Level, Position, Wall } from "./game-struct";

export class GameModel {
    private levels: Level[];
    private currentLevel: number;
    private playerName: string;
    private score: number;
    private extraLifes: number;
    private time: number;

    constructor(levels: Level[]) {
        this.levels = levels;
        this.currentLevel = 0;
        this.score = 0;
        this.time = 0;
        this.playerName = DEFAULT_NAME;
        this.extraLifes = DEFAULT_EXTRA_LIFES;
    }

    getCurrentLevel() : Level {
        return this.levels[this.currentLevel - 1];
    }

    getCurrentLevelNumber() : number {
        return this.currentLevel;
    }

    getInitialPlayerPos() : Position {
        return this.getCurrentLevel().playerInitPos;
    }

    getWalls() : Wall[] {
        return this.getCurrentLevel().walls;
    }

    getEnemies() : Enemy[] {
        return this.getCurrentLevel().enemies;
    }

    getPrevDoor() : Door {
        return this.getCurrentLevel().prevLevelDoor;
    }

    getNextDoor() : Door {
        return this.getCurrentLevel().nextLevelDoor;
    }

    getExtraLifes() : number {
        return this.extraLifes;
    }

    getScore() : number {
        return this.score;
    }

    updateScore(score: number) {
        this.score = score;
    }

    loseLife() : boolean {
        this.extraLifes -= 1;
        if (this.extraLifes <= 0) {
            // no remaining life
            return false;
        }
        return true;
    }

    addLife() {
        this.extraLifes += 1;
        if (this.extraLifes >= 5) {
            this.extraLifes = 5;
        }
    }

    nextLevel() : boolean {
        this.currentLevel += 1;
        if (this.currentLevel <= this.levels.length) {
            return true;
        }
        return false;
    }

    getPlayerName() : string {
        return this.playerName;
    }

    getInitialTime() : number {
        return this.time;
    }

    setTime(time: number) {
        this.time = time;
    }

    setPlayerName(name: string) {
        this.playerName = name.length > 0 ? name : DEFAULT_NAME;
    }
}

export enum Direction {
	LEFT = 'l',
    RIGHT = 'r',
    TOP = 't',
    DOWN = 'd'
}

export enum Rotation {
    HORIZONTAL = 'h',
    VERTICAL = 'v'
}

export type Position = {
    x: number;
    y: number;
}

export type Enemy = {
    position: Position;
}

export type Wall = {
    startPos: Position;
    rotation: Rotation;
    length: number; 
}

export type Door = {
    dir: Direction;
    position: number;
}

export type Level = {
    levelId: number;
    playerInitPos: Position;
    enemies: Enemy[];
    walls: Wall[];
    prevLevelDoor: Door;
    nextLevelDoor: Door;
}

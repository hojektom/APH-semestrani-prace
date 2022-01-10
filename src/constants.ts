// default frequency of all animated objects
export const PLAYER_ANIM_FREQUENCY = 20;
export const ENEMY_ANIM_FREQUENCY = 5;

export enum Assets {
	TEXTURE = 'TEXTURE',
	LEVELS = 'LEVELS',
	SCALE = 2
}

export enum Attributes {
	PLAYER = 'player',
	PROJECTILE_SOURCE = 'projectile_source',
	CHARACTER_MOVEMENT = 'player_movement',
	NEXT_LEVEL_DOOR = 'next_level_door',
	DESTROYED = 'destroyed'
}

export enum CharacterMovement {
	STAND = 'stand',
	WALKING_TO_LEFT = 'walking to left',
	WALKING_TO_RIGHT = 'walking to right',
	WALKING_TO_UP = 'walking to up',
	WALKING_TO_DOWN = 'walking to down',

	SHOOT_UP = 'shoot up',
	SHOOT_UP_RIGHT = 'shoot up right',
	SHOOT_RIGHT = 'shoot right',
	SHOOT_RIGHT_DOWN = 'shoot right down',
	SHOOT_DOWN = 'shoot down',
	SHOOT_DOWN_LEFT = 'shoot down left',
	SHOOT_LEFT = 'shoot left',
	SHOOT_LEFT_UP = 'shoot left up'
}

export enum Names {
	PLAYER = 'player',
	ENEMIES = 'enemies',
	ENEMY = 'enemy',
	PLAYER_NAME = 'player name',
	WALLS = 'walls',
	WALL = 'wall',
	DOORS = 'doors',
	DOOR = 'door',
	STATUS_BAR = 'status bar',
	SCORE = 'score',
	TIMER = 'timer',
	PROJECTILES = 'projectiles',
	PROJECTILE = 'projectile',
	RAY = 'ray',
	HEALTH_INDICATOR_CONTAINER = 'health indicator container',
	HEALTH_INDICATOR = 'health indicator'
}

export enum Messages {
	PLAYER_HIT = 'player_hit',
	ENEMY_HIT = 'enemy_hit',
	WALL_HIT = 'wall_hit',
	ADD_SCORE = 'add_score',
	RAY_RESULT = 'ray_result',

	GAME_START = 'game_start',
	COMPLETE_LEVEL = 'complete_level',
	GAME_OVER = 'game_over',
	WINNER = 'winner',
}

export enum ScoreValues {
	KILLED_ENEMY = 50
}

export enum SizesAndPositions {
	WINDOW_WIDTH = 800,
	WINDOW_HEIGHT = 600,
	STATUS_BAR_HEIGHT = 50,
	SCORE_END_POS_X = 120,
	HEALTH_START_POS_X = 170,
	HEALTH_POS_MILTIPLICATOR = 30,
	TIMER_POS_X = 450,
	PLAYER_NAME_POS_X = 750
}

export enum FontDetails {
	SIZE = 30,
	FONT_FAMILY = 'Courier New'
}

export enum Colors {
	COLOR_GREEN = 0x7fff00,
	COLOR_WHITE = 0xFFFFFF,
	COLOR_ORANGE = 0xFF8c00,
	WALL_COLOR = 0x0000ff,
	PREVIOUS_LEVEL_DOOR_COLOR = 0xFF0000,
	NEXT_LEVEL_DOOR_COLOR = 0x00FF00
}

export enum WallAndDoor {
	WALL_THICKNESS = 7,
	DOOR_THICKNESS = 7,
	DOOR_LENGTH = 150
}

export enum Intro {
	POS_X = SizesAndPositions.WINDOW_WIDTH / 2,
	TITLE_POS_Y = 200,
	TITLE_SIZE = 50,
	START_BUTTON_X = (SizesAndPositions.WINDOW_WIDTH / 2) - 150,
	START_BUTTON_Y = 400,
	BUTTON_HEIGHT = 60,
	BUTTON_RADIUS = 30,
	BUTTON_WIDTH = 300,
	BUTTON_TEXT_Y = 430,
	BUTTON_COLOR = 0xB22222,
	NAME_POS_Y = 300
}

export enum InfoScreen {
	POS_X = 400,
	POS_Y = 200,
	YOUR_SCORE_TEXT_X = 350,
	YOUR_TIME_TEXT_X = 420,
	TITLE_SIZE = 100,
	TEXT_SIZE = 45
}

export const MOVEMENT_MULTIPLICATOR = 0.1;

export const PROJECTILE_MULTIPLICATOR = 0.003;

export const RAY_MULTIPLICATOR = 0.0005;

export const ENEMY_STAND_RAY_FREQ = 300;

export const ENEMY_WANDER_RAY_FREQ = 2000;

export const BONUS_SCORE_TEXT_VALUE = 'BONUS';

export const DEFAULT_NAME = 'player';

export const DEFAULT_EXTRA_LIFES = 3;

export const IS_DEVEL = false;

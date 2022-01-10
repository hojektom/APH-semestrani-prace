import * as PIXI from 'pixi.js';
import { Assets } from './constants';

export const createTexture = (offsetX: number, offsetY: number, width: number, height: number) => {
	let tmp = PIXI.Texture.from(Assets.TEXTURE);
	let texture = tmp.clone();
	texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);
	return texture;
};

export const enumFromValue = <T extends Record<string, string>>(val: string, _enum: T) => {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(k => _enum[k] === val);
    if (!enumName) throw Error(); // here fail fast as an example
    return _enum[enumName];
}

export const getBaseUrl = () => (window as any).BASE_URL || '.';

export const convertTimeToString = (timeInMilis: number) => {
	let seconds: number = Math.floor(timeInMilis / 1000);
	let minutes: number = Math.floor(seconds / 60);
	seconds = seconds - (minutes * 60);
	return `${ minutes }:${ addZeroPad(seconds) }`;
}

function addZeroPad(num: number) {
	var zero = 2 - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}
import { DarumaColors } from './daruma-colors';

/**
 * This represents the model obtained from the backend
 */
export type DarumaModel = {
  id?: number;
  leftEye: boolean;
  rightEye: boolean;
  bodyColor: DarumaBodyColor;
  goals: string;
  topSkin: DarumaTopSkin;
  bottomSkin: DarumaBottomSkin;
};

export enum DarumaBodyColor {
  BLUE = 'blue',
  PINK = 'pink',
  RED = 'red',
  YELLOW = 'yellow',
  EMPTY_DOTTED = 'empty_dotted',
}

//TODO
//Podrían cambiarse los nombres de las skins
export enum DarumaTopSkin {
  NOTHING = 'nothing',
  MARBLE = '0',
  GOKU = '1',
  DEADPOOL = '2',
  GRASS = '3',
  WOLVERINE = '4',
  BUZZ = '5',
  CASCOROSA = '6',
  GOLDEN = '7',
  CORAZONES = '8',
  POWERPUFF_1 = '9',
  POWERPUFF_2 = '10',
  POWERPUFF_3 = '11',
}

export enum DarumaBottomSkin {
  NOTHING = 'nothing',
  LOVE = '0',
  MONEY = '1',
  HEALTH = '2',
  LUCK = '3',
}

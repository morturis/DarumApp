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

export enum DarumaTopSkin {
  NOTHING = 'nothing',
  SNOW_HAT = '0',
}

export enum DarumaBottomSkin {
  NOTHING = 'nothing',
  REGAL_MOUSTACHE = '0',
}

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
  AUREOLA = '0',
  BRUJO = '1',
  CORONA = '2',
  DIABLO = '3',
  PARTY = '4',
  GORRO = '5',
  SANTA = '6',
  OREJERAS = '7',
  PAMELA = '8',
}

export enum DarumaBottomSkin {
  NOTHING = 'nothing',
  BIGOTE = '0',
  PIPA = '1',
}

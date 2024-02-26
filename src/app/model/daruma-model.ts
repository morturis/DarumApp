import { DarumaColors } from './daruma-colors';

/**
 * This represents the model obtained from the backend
 */
export type DarumaModel = {
  id: number;
  leftEye: boolean;
  rightEye: boolean;
  bodyColor: DarumaBodyColor;
  goals: string;
};

export enum DarumaBodyColor {
  BLUE = DarumaColors.HEX.BLUE,
  RED = DarumaColors.HEX.RED,
  PINK = DarumaColors.HEX.PINK,
  YELLOW = DarumaColors.HEX.YELLOW,
  EMPTY_DOTTED = 'empty_dotted',
}

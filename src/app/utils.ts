import { DarumaConfirmDialog } from './ui_components/daruma-confirm-dialog';

export const showDebugBounds = (
  scene: Phaser.Scene,
  object: Phaser.GameObjects.Container,
) => {
  let render = scene.add.graphics();
  let bounds = object.getBounds();
  render.lineStyle(3, 0xffff37); //yellow
  render.strokeRectShape(bounds);
  render.strokeCircleShape(
    new Phaser.Geom.Circle(bounds.centerX, bounds.centerY, 1),
  );
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const addErrorPrompt = (
  scene: Phaser.Scene,
  errorText: string = 'Error',
) => {
  const errorDialog = new DarumaConfirmDialog(
    scene,
    1,
    () => {},
    errorText,
    undefined,
    'Go back',
  );
  scene.add.existing(errorDialog);
};

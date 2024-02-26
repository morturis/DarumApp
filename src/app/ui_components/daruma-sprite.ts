import { DarumaColors } from '../model/daruma-colors';
import { DarumaModel } from '../model/daruma-model';

export class DarumaSprite extends Phaser.GameObjects.Container {
  private model: DarumaModel;

  private darumaBody!: Phaser.GameObjects.Image;
  private bodyCallback?: () => void;
  private faceBackground!: Phaser.GameObjects.Image;
  private leftEye!: Phaser.GameObjects.Image;
  private leftEyeCallback?: () => void;
  private rightEye!: Phaser.GameObjects.Image;
  private rightEyeCallback?: () => void;
  private belly!: Phaser.GameObjects.Image;
  private bellyCallback?: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, model: DarumaModel) {
    super(scene);
    this.model = model;
    this.x = x;
    this.y = y;

    this.updateModel(this.model);
  }

  updateModel(model: DarumaModel) {
    this.removeAll(true);
    const leftEyeStatus = model.leftEye ? 'full' : 'empty';
    const rightEyeStatus = model.rightEye ? 'full' : 'empty';
    const bodyColor = `0x${model.bodyColor.toString(16).padStart(6, '0')}`;

    this.darumaBody = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
      `daruma_body_${bodyColor}.png`
    );
    if (this.bodyCallback) this.setBodyCallback(this.bodyCallback);
    this.faceBackground = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
      'daruma_face.png'
    );

    this.leftEye = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
      `daruma_left_eye_${leftEyeStatus}.png`
    );
    if (this.leftEyeCallback) this.setLeftEyeCallback(this.leftEyeCallback);
    this.rightEye = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
      `daruma_right_eye_${rightEyeStatus}.png`
    );
    if (this.rightEyeCallback) this.setRightEyeCallback(this.rightEyeCallback);
    this.belly = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
      'daruma_belly.png'
    );
    if (this.bellyCallback) this.setBellyCallback(this.bellyCallback);

    this.add(this.darumaBody);
    this.add(this.faceBackground);
    this.add(this.leftEye);
    this.add(this.rightEye);
    this.add(this.belly);
  }
  delete() {
    this.removeAll(true);
  }
  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.setX(x);
    this.setY(y);
  }

  setBodyCallback(fun: () => void) {
    this.bodyCallback = fun;
    this.darumaBody
      .setInteractive(this.scene.input.makePixelPerfect())
      .on(Phaser.Input.Events.POINTER_UP, fun)
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.darumaBody.setTint(DarumaColors.HEX.GRAY);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.darumaBody.setTint();
      });
  }

  setLeftEyeCallback(fun: () => void) {
    this.leftEyeCallback = fun;
    this.leftEye
      .setInteractive(this.scene.input.makePixelPerfect())
      .on(Phaser.Input.Events.POINTER_UP, fun)
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.leftEye.setTint(DarumaColors.HEX.GRAY);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.leftEye.setTint();
      });
  }

  setRightEyeCallback(fun: () => void) {
    this.rightEyeCallback = fun;
    this.rightEye
      .setInteractive(this.scene.input.makePixelPerfect())
      .on(Phaser.Input.Events.POINTER_UP, fun)
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.rightEye.setTint(DarumaColors.HEX.GRAY);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.rightEye.setTint();
      });
  }

  setBellyCallback(fun: () => void) {
    this.bellyCallback = fun;
    this.belly
      .setInteractive(this.scene.input.makePixelPerfect())
      .on(Phaser.Input.Events.POINTER_UP, fun)
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.belly.setTint(DarumaColors.HEX.GRAY);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.belly.setTint();
      });
  }
}

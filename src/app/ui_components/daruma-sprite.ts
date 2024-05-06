import { DarumaColors } from '../model/daruma-colors';
import { DarumaModel } from '../model/daruma-model';

export class DarumaSprite extends Phaser.GameObjects.Container {
  private model: DarumaModel;

  private darumaBody!: Phaser.GameObjects.Image;
  private bodyCallback?: () => void;

  private leftEye!: Phaser.GameObjects.Image;
  private leftEyeCallback?: () => void;
  private rightEye!: Phaser.GameObjects.Image;
  private rightEyeCallback?: () => void;

  private topSkin!: Phaser.GameObjects.Image;
  private bottomSkin!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, model: DarumaModel) {
    super(scene, x, y);
    this.model = model;

    this.darumaBody = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
    );
    if (this.bodyCallback) this.setBodyCallback(this.bodyCallback);

    this.leftEye = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
    );
    if (this.leftEyeCallback) this.setLeftEyeCallback(this.leftEyeCallback);
    this.rightEye = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_sprite',
    );
    if (this.rightEyeCallback) this.setRightEyeCallback(this.rightEyeCallback);
    this.topSkin = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_skin_top',
    );
    this.bottomSkin = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_skin_bottom',
    );

    this.updateModel(model);

    this.add(this.darumaBody);
    this.add(this.topSkin);
    this.add(this.leftEye);
    this.add(this.rightEye);
    this.add(this.bottomSkin);

    this.setScale(0.4);
  }

  updateModel(model: DarumaModel) {
    const leftEyeStatus = model.leftEye ? 'full' : 'empty';
    const rightEyeStatus = model.rightEye ? 'full' : 'empty';

    const bodyFrame = `daruma_body_${model.bodyColor}.png`;
    const leftEyeFrame = `daruma_left_eye_${leftEyeStatus}.png`;
    const rightEyeFrame = `daruma_right_eye_${rightEyeStatus}.png`;
    const topSkinFrame = `daruma_skin_top_${model.topSkin}.png`;
    const bottomSkinFrame = `daruma_skin_bottom_${model.bottomSkin}.png`;

    this.darumaBody.setFrame(bodyFrame);

    this.leftEye.setFrame(leftEyeFrame);
    this.rightEye.setFrame(rightEyeFrame);

    this.topSkin.setFrame(topSkinFrame);
    this.bottomSkin.setFrame(bottomSkinFrame);
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
        this.topSkin.setTint(DarumaColors.HEX.GRAY);
        this.bottomSkin.setTint(DarumaColors.HEX.GRAY);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.darumaBody.setTint();
        this.topSkin.setTint();
        this.bottomSkin.setTint();
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
}

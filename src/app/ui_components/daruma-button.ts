import { DarumaColors } from '../model/daruma-colors';

export class DarumaImageButton extends Phaser.GameObjects.Container {
  private image: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string,
    action: () => void,
  ) {
    super(scene, x, y);

    this.image = new Phaser.GameObjects.Image(scene, x, y, texture, frame);
    this.add(this.image);
    this.setSize(this.image.width, this.image.height);
    this.image.setInteractive();
    this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, action);
    this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      this.image.setTint(DarumaColors.HEX.GRAY); //slightly darken
    });
    this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      this.image.setTint();
    });
  }
}

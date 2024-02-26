import { DarumaColors } from '../model/daruma-colors';

export class DarumaImageButton extends Phaser.GameObjects.Container {
  private image: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string,
    action: () => void
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

export class DarumaTextButton extends Phaser.GameObjects.Container {
  private text!: Phaser.GameObjects.Text;
  private image: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    action: () => void
  ) {
    super(scene, x, y);

    this.image = new Phaser.GameObjects.Image(
      scene,
      x,
      y,
      'daruma_buttons',
      'daruma_text_button.png'
    );
    this.add(this.image);

    this.text = new Phaser.GameObjects.Text(scene, x, y, text, {
      fontSize: 80,
      strokeThickness: 6,
      align: 'center',
      color: DarumaColors.STRING.BLACK,
      stroke: DarumaColors.STRING.BLACK,
    });
    Phaser.Display.Align.In.Center(this.text, this.image);
    this.add(this.text);

    this.setSize(this.image.width, this.image.height);
    this.image.setInteractive();

    this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, action);
    this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      console.log('hover');
      this.image.setTint(DarumaColors.HEX.GRAY); //slightly darken
      this.text?.setColor(DarumaColors.STRING.WHITE);
    });
    this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      console.log('no hover');
      this.image.setTint();
      this.text?.setColor(DarumaColors.STRING.BLACK);
    });
  }
}

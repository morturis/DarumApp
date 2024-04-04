import { DarumaBaseTopNav } from '../ui_components/daruma-base-top-nav';
import { DarumaTabs } from '../ui_components/daruma-tabs';

const POINTER_WIDTH = 36;
const POINTER_HEIGHT = 18;
export class MainScene extends Phaser.Scene {
  pointerGraphics!: Phaser.GameObjects.Graphics;
  pointerGeom!: Phaser.Geom.Rectangle;

  constructor() {
    super({ key: 'main' });
  }

  create() {
    console.log('create method');

    const topnav = new DarumaBaseTopNav(this);
    this.add.existing(topnav);
    //this.add.existing(new DarumaEditingUI(this));

    //this.addDebugPointer();

    this.add.existing(new DarumaTabs(this, 0, 0));
  }

  preload() {
    //Because this is the first scene, it loads every atlas

    //Load daruma atlas
    this.load.atlas(
      'daruma_sprite',
      'assets/spritesheets/daruma_sprite.png',
      'assets/spritesheets/daruma_sprite.json',
    );
    this.load.atlas(
      'daruma_skin_top',
      'assets/spritesheets/daruma_skin_top.png',
      'assets/spritesheets/daruma_skin_top.json',
    );
    this.load.atlas(
      'daruma_skin_bottom',
      'assets/spritesheets/daruma_skin_bottom.png',
      'assets/spritesheets/daruma_skin_bottom.json',
    );
    //Load button atlas
    this.load.atlas(
      'daruma_action_buttons',
      'assets/spritesheets/daruma_action_buttons.png',
      'assets/spritesheets/daruma_action_buttons.json',
    );
    this.load.atlas(
      'daruma_screen_buttons',
      'assets/spritesheets/daruma_screen_buttons.png',
      'assets/spritesheets/daruma_screen_buttons.json',
    );
  }
  override update() {
    console.log('update method');
    this.pointerGraphics?.clear();
    this.pointerGraphics?.fillRectShape(this.pointerGeom);
  }

  addPointer() {
    this.pointerGraphics = this.add.graphics({
      fillStyle: { color: 0x6666ff },
    });
    this.pointerGeom = new Phaser.Geom.Rectangle(
      0,
      0,
      POINTER_WIDTH,
      POINTER_HEIGHT,
    );
    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      (pointer: { x: number; y: number }) => {
        this.pointerGeom.setPosition(
          pointer.x - POINTER_WIDTH / 2,
          pointer.y - POINTER_HEIGHT / 2,
        );
      },
    );
  }
}

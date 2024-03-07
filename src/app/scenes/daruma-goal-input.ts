import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import { DarumaColors } from '../model/daruma-colors';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaBaseTopNav } from '../ui_components/daruma-base-top-nav';
import {
  DarumaImageButton,
  DarumaTextButton,
} from '../ui_components/daruma-button';
import { DarumaEditingTopNav } from '../ui_components/daruma-editing-top-nav';
import { TextAreaContainer } from '../ui_components/text-area-container';
import { TextAreaInput } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export class DarumaGoalInput extends Phaser.Scene {
  private textAreaTitle!: Phaser.GameObjects.Text;
  private textArea!: TextAreaInput;
  private confirmButton!: DarumaTextButton;
  private resetButton!: DarumaImageButton;

  private CANVAS_WIDTH!: number;
  private CANVAS_HEIGHT!: number;

  constructor() {
    super({ key: SceneKeys.DARUMA_GOAL_INPUT });
  }

  create() {
    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = this.sys.game.canvas;
    this.CANVAS_HEIGHT = CANVAS_HEIGHT;
    this.CANVAS_WIDTH = CANVAS_WIDTH;

    this.add.existing(new DarumaEditingTopNav(this));
    this.addTextArea();
    this.addConfirmButton();
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI',
    });
  }

  private addTextArea() {
    const textAreaWidth = Math.min(this.CANVAS_WIDTH / 4, 200);
    const textAreaHeight = Math.min(this.CANVAS_HEIGHT / 4, 200);
    const textAreaX = this.CANVAS_WIDTH / 2;
    const textAreaY = this.CANVAS_HEIGHT * 0.4;

    const rexUI = (this as Phaser.Scene & { rexUI?: UIPlugin }).rexUI;
    this.textAreaTitle = new Phaser.GameObjects.Text(
      this,
      0,
      0,
      'Write your dream',
      { color: DarumaColors.STRING.GRAY, fontSize: 24 },
    );
    this.textAreaTitle.setBackgroundColor(DarumaColors.STRING.BLACK);
    this.textAreaTitle.setPadding(0, 0, 0, 20);
    this.textArea = new TextAreaInput(this, {
      x: textAreaX,
      y: textAreaY,
      width: textAreaWidth,
      height: textAreaHeight,

      background: rexUI?.add.roundRectangle(
        0,
        0,
        2,
        2,
        0,
        DarumaColors.HEX.WHITE,
      ),
      text: {
        style: {
          fontSize: 20,
          color: DarumaColors.HEX.BLACK,
          'cursor.color': DarumaColors.HEX.WHITE,
          'cursor.backgroundColor': DarumaColors.HEX.GRAY,
        },
        padding: { left: 10, right: 10, top: 10 },
        wrap: { vAlign: 'center', hAlign: 'center' },
      },
      space: { bottom: 10 },
      mouseWheelScroller: false,
      header: this.textAreaTitle,
      content: '',
    });
    this.textArea.on('textchange', (text: string) => {
      console.log(`Content: '${text}'`);
    });
    this.textArea.layout();

    this.add.existing(this.textArea);
    this.add.existing(this.textAreaTitle);
  }

  private addConfirmButton() {
    const yOffset = this.CANVAS_HEIGHT * 0.2;
    const xOffset = this.CANVAS_WIDTH * 0.1;
    this.confirmButton = new DarumaTextButton(this, 0, 0, 'OK', () => {
      //TODO pass text
      this.registry.set(
        RegistryKeys.EDITED_DARUMA_GOAL,
        this.textArea.text.length > 0 ? this.textArea.text : '',
      );
      this.scene.switch(SceneKeys.DARUMA_EDITING);
    }).setScale(0.6);
    Phaser.Display.Align.In.Center(
      this.confirmButton,
      this.textArea,
      0,
      yOffset,
    );
    this.add.existing(this.confirmButton);

    this.resetButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_reset_button.png',
      () => {
        this.textArea.setText('');
      },
    ).setScale(0.15);
    Phaser.Display.Align.In.Center(
      this.resetButton,
      this.textArea,
      +xOffset,
      yOffset,
    );
    this.add.existing(this.resetButton);
  }
}

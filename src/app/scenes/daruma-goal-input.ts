import { DarumaColors } from '../model/daruma-colors';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaBaseTopNav } from '../ui_components/daruma-base-top-nav';
import { DarumaTextButton } from '../ui_components/daruma-button';
import { TextAreaContainer } from '../ui_components/text-area-container';

export class DarumaGoalInput extends Phaser.Scene {
  private textAreaTitle!: Phaser.GameObjects.Text;
  private textArea!: TextAreaContainer;
  private confirmButton!: DarumaTextButton;

  private CANVAS_WIDTH!: number;
  private CANVAS_HEIGHT!: number;

  constructor() {
    super({ key: SceneKeys.DARUMA_GOAL_INPUT });
  }

  create() {
    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = this.sys.game.canvas;
    this.CANVAS_HEIGHT = CANVAS_HEIGHT;
    this.CANVAS_WIDTH = CANVAS_WIDTH;

    this.add.existing(new DarumaBaseTopNav(this));
    this.addTextArea();
    this.addConfirmButton();
  }
  private addTextArea() {
    const textAreaWidth = Math.min(this.CANVAS_WIDTH / 4, 200);
    const textAreaHeight = Math.min(this.CANVAS_HEIGHT / 4, 200);
    this.textArea = new TextAreaContainer(
      this,
      'placeholder...',
      textAreaWidth,
      textAreaHeight,
    );
    this.textArea.x = this.CANVAS_WIDTH / 2;
    this.textArea.y = this.CANVAS_HEIGHT * 0.4;
    this.add.existing(this.textArea);

    this.textAreaTitle = new Phaser.GameObjects.Text(
      this,
      0,
      0,
      'Write your dream',
      { color: DarumaColors.STRING.GRAY, fontSize: 24 },
    );
    Phaser.Display.Align.In.Center(
      this.textAreaTitle,
      this.textArea,
      0,
      -(textAreaHeight / 2 + 25),
    );
    this.add.existing(this.textAreaTitle);
  }

  private addConfirmButton() {
    const yOffset = this.CANVAS_HEIGHT * 0.2;
    this.confirmButton = new DarumaTextButton(this, 0, 0, 'CONFIRM', () => {
      console.log('CONFIRM button pressed');
      //TODO pass text
      this.registry.set(
        RegistryKeys.EDITED_DARUMA_GOAL,
        this.textArea.getText(),
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
  }
}

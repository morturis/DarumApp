import { DarumaBodyColor, DarumaModel } from '../model/daruma-model';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaTextButton } from '../ui_components/daruma-button';
import { DarumaEditingUI } from '../ui_components/daruma-editing-top-nav';
import { DarumaSprite } from '../ui_components/daruma-sprite';

export class DarumaEditingView extends Phaser.Scene {
  private model!: DarumaModel;
  private renderedDaruma!: DarumaSprite; //interactive
  private goalButton!: DarumaTextButton;

  private luckButton!: DarumaTextButton;
  private loveButton!: DarumaTextButton;
  private healthButton!: DarumaTextButton;
  private powerButton!: DarumaTextButton;

  private CANVAS_WIDTH!: number;
  private CANVAS_HEIGHT!: number;

  constructor() {
    super({ key: SceneKeys.DARUMA_EDITING });
  }

  create() {
    this.add.existing(new DarumaEditingUI(this));

    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = this.sys.game.canvas;
    this.CANVAS_HEIGHT = CANVAS_HEIGHT;
    this.CANVAS_WIDTH = CANVAS_WIDTH;

    this.renderDaruma();
    this.addGoalButton();
    this.addTypeButtons();
  }

  preload() {
    const defaultModel = {
      id: 1,
      leftEye: false,
      rightEye: false,
      bodyColor: DarumaBodyColor.EMPTY_DOTTED,
      goals: '',
    };
    this.model = this.registry.get(RegistryKeys.EDITED_DARUMA) || defaultModel;
    //Clear registry for the next time
    this.registry.set(RegistryKeys.EDITED_DARUMA, undefined);

    //TODO get from database? use registry only for ID?
  }

  private renderDaruma() {
    this.renderedDaruma = new DarumaSprite(this, 0, 0, this.model);
    this.renderedDaruma.x = this.CANVAS_WIDTH / 2;
    this.renderedDaruma.y = this.CANVAS_HEIGHT * 0.6;
    this.add.existing(this.renderedDaruma);

    this.renderedDaruma.setLeftEyeCallback(() => {
      this.model.leftEye = !this.model.leftEye;
      this.renderedDaruma.updateModel(this.model);
    });
    this.renderedDaruma.setRightEyeCallback(() => {
      this.model.rightEye = !this.model.rightEye;
      this.renderedDaruma.updateModel(this.model);
    });
  }

  private addTypeButtons() {
    this.luckButton = new DarumaTextButton(this, 0, 0, 'LUCK', () => {
      console.log('LUCK button pressed');
      this.model.bodyColor = DarumaBodyColor.RED;
      this.renderedDaruma.updateModel(this.model);
    }).setScale(0.4);
    Phaser.Display.Align.In.Center(
      this.luckButton,
      this.renderedDaruma,
      -this.CANVAS_WIDTH * 0.25,
      -this.CANVAS_HEIGHT * 0.3
    );
    this.add.existing(this.luckButton);

    this.loveButton = new DarumaTextButton(this, 0, 0, 'LOVE', () => {
      console.log('LOVE button pressed');
      this.model.bodyColor = DarumaBodyColor.PINK;
      this.renderedDaruma.updateModel(this.model);
    }).setScale(0.4);
    Phaser.Display.Align.In.Center(
      this.loveButton,
      this.renderedDaruma,
      -this.CANVAS_WIDTH * 0.08,
      -this.CANVAS_HEIGHT * 0.3
    );
    this.add.existing(this.loveButton);

    //HEALTH no cabe :(
    this.healthButton = new DarumaTextButton(this, 0, 0, 'HEAL', () => {
      console.log('HEALTH button pressed');
      this.model.bodyColor = DarumaBodyColor.BLUE;
      this.renderedDaruma.updateModel(this.model);
    }).setScale(0.4);
    Phaser.Display.Align.In.Center(
      this.healthButton,
      this.renderedDaruma,
      this.CANVAS_WIDTH * 0.08,
      -this.CANVAS_HEIGHT * 0.3
    );
    this.add.existing(this.healthButton);

    this.powerButton = new DarumaTextButton(this, 0, 0, 'POW', () => {
      console.log('POWER button pressed');
      this.model.bodyColor = DarumaBodyColor.YELLOW;
      this.renderedDaruma.updateModel(this.model);
    }).setScale(0.4);
    Phaser.Display.Align.In.Center(
      this.powerButton,
      this.renderedDaruma,
      this.CANVAS_WIDTH * 0.25,
      -this.CANVAS_HEIGHT * 0.3
    );
    this.add.existing(this.powerButton);
  }

  private addGoalButton() {
    this.goalButton = new DarumaTextButton(this, 0, 0, 'GOAL', () => {
      console.log('GOAL button pressed');
    }).setScale(0.8);
    Phaser.Display.Align.In.Center(
      this.goalButton,
      this.renderedDaruma,
      0,
      this.CANVAS_HEIGHT * 0.3
    );
    this.add.existing(this.goalButton);
  }
}

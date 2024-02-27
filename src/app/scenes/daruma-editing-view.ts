import { DarumaService } from '../external_interfaces/daruma.service';
import { DarumaColors } from '../model/daruma-colors';
import { DarumaBodyColor, DarumaModel } from '../model/daruma-model';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaTextButton } from '../ui_components/daruma-button';
import { DarumaEditingUI } from '../ui_components/daruma-editing-top-nav';
import { DarumaSprite } from '../ui_components/daruma-sprite';
import { TextAreaContainer } from '../ui_components/text-area-container';
import { showDebugBounds } from '../utils';

export class DarumaEditingView extends Phaser.Scene {
  private model!: DarumaModel;
  private renderedDaruma!: DarumaSprite; //interactive

  private saveButton!: DarumaTextButton;
  private deleteButton!: DarumaTextButton;

  private luckButton!: DarumaTextButton;
  private loveButton!: DarumaTextButton;
  private healthButton!: DarumaTextButton;
  private powerButton!: DarumaTextButton;

  private textAreaTitle!: Phaser.GameObjects.Text;
  private textArea!: TextAreaContainer;

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
    this.addTextArea();
    this.addSaveDeleteButtons();
    this.addTypeButtons();
  }

  preload() {
    const defaultModel = {
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

  private addTextArea() {
    const textAreaWidth = Math.min(this.CANVAS_WIDTH / 4, 200);
    const textAreaHeight = Math.min(this.CANVAS_HEIGHT / 4, 200);
    this.textArea = new TextAreaContainer(
      this,
      'placeholder...',
      textAreaWidth,
      textAreaHeight,
    );
    this.textArea.setDepth(999);
    Phaser.Display.Align.In.Center(
      this.textArea,
      this.renderedDaruma,
      0,
      this.CANVAS_HEIGHT * -0.4,
    );
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

  private renderDaruma() {
    this.renderedDaruma = new DarumaSprite(this, 0, 0, this.model);
    this.renderedDaruma.x = this.CANVAS_WIDTH / 2;
    this.renderedDaruma.y = this.CANVAS_HEIGHT * 0.7;
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
    const yOffset = 0;
    this.luckButton = new DarumaTextButton(this, 0, 0, 'LUCK', () => {
      console.log('LUCK button pressed');
      this.model.bodyColor = DarumaBodyColor.RED;
      this.renderedDaruma.updateModel(this.model);
    }).setScale(0.4);
    Phaser.Display.Align.In.Center(
      this.luckButton,
      this.renderedDaruma,
      -this.CANVAS_WIDTH * 0.25,
      yOffset,
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
      yOffset,
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
      yOffset,
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
      yOffset,
    );
    this.add.existing(this.powerButton);
  }

  private addSaveDeleteButtons() {
    this.saveButton = new DarumaTextButton(this, 0, 0, 'Create', () => {
      DarumaService.instance.save(this.model).subscribe((res) => {
        //Upon saving, go to the previous scene
        const previousSceneKey = this.registry.get(
          RegistryKeys.PREVIOUS_SCENE,
        ) as SceneKeys;
        this.scene.stop();
        this.scene.wake(previousSceneKey);
      });
    }).setScale(0.5);
    Phaser.Display.Align.In.Center(
      this.saveButton,
      this.renderedDaruma,
      -this.CANVAS_WIDTH * 0.2,
      this.CANVAS_HEIGHT * -0.2,
    );
    this.add.existing(this.saveButton);

    this.deleteButton = new DarumaTextButton(this, 0, 0, 'Delete', () => {
      //TODO prompt for deletion
      DarumaService.instance.delete(this.model).subscribe((res) => {
        //Upon saving, go to the previous scene
        const previousSceneKey = this.registry.get(
          RegistryKeys.PREVIOUS_SCENE,
        ) as SceneKeys;
        this.scene.stop();
        this.scene.wake(previousSceneKey);
      });
    }).setScale(0.5);
    Phaser.Display.Align.In.Center(
      this.deleteButton,
      this.renderedDaruma,
      this.CANVAS_WIDTH * 0.2,
      this.CANVAS_HEIGHT * -0.2,
    );
    this.add.existing(this.deleteButton);
  }
}

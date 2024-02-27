import { DarumaService } from '../external_interfaces/daruma.service';
import { DarumaColors } from '../model/daruma-colors';
import { DarumaBodyColor, DarumaModel } from '../model/daruma-model';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import {
  DarumaImageButton,
  DarumaTextButton,
} from '../ui_components/daruma-button';
import { DarumaEditingTopNav } from '../ui_components/daruma-editing-top-nav';
import { DarumaSprite } from '../ui_components/daruma-sprite';
import { TextAreaContainer } from '../ui_components/text-area-container';
import { showDebugBounds } from '../utils';

export class DarumaEditingView extends Phaser.Scene {
  private model!: DarumaModel;
  private renderedDaruma!: DarumaSprite; //interactive

  private saveButton!: DarumaTextButton;
  private resetButton!: DarumaTextButton;

  private goalButton!: DarumaTextButton;
  private darumaText!: Phaser.GameObjects.Text;

  private leftCarouselButton!: DarumaImageButton;
  private rightCarouselButton!: DarumaImageButton;

  private CANVAS_WIDTH!: number;
  private CANVAS_HEIGHT!: number;

  constructor() {
    super({ key: SceneKeys.DARUMA_EDITING });
  }

  create() {
    this.add.existing(new DarumaEditingTopNav(this));

    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = this.sys.game.canvas;
    this.CANVAS_HEIGHT = CANVAS_HEIGHT;
    this.CANVAS_WIDTH = CANVAS_WIDTH;

    this.renderDaruma();
    this.addSaveRestartButtons();
    this.addGoalButton();
    this.setGoalText();
    this.addCarousel();
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

  private renderDaruma() {
    this.renderedDaruma = new DarumaSprite(this, 0, 0, this.model);
    this.renderedDaruma.x = this.CANVAS_WIDTH / 2;
    this.renderedDaruma.y = this.CANVAS_HEIGHT * 0.4;
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

  private addGoalButton() {
    const yOffset = Math.min(
      this.CANVAS_HEIGHT * 0.3,
      this.renderedDaruma.getBounds().height,
    );
    this.goalButton = new DarumaTextButton(this, 0, 0, 'GOAL', () => {
      console.log('GOAL button pressed');
      this.scene.switch(SceneKeys.DARUMA_GOAL_INPUT);
    }).setScale(0.5);
    Phaser.Display.Align.In.Center(
      this.goalButton,
      this.renderedDaruma,
      0,
      yOffset,
    );
    this.add.existing(this.goalButton);

    //The first time I wake, I get the goal (this assumes this screen can only be awoken by DarumaGoalInput)
    this.events.on(Phaser.Scenes.Events.WAKE, () => {
      this.model.goals = this.registry.get(RegistryKeys.EDITED_DARUMA_GOAL);
      //Clear registry for the next time
      this.registry.set(RegistryKeys.EDITED_DARUMA_GOAL, undefined);
      this.setGoalText();
    });
  }

  private addSaveRestartButtons() {
    const yOffset = Math.min(
      this.CANVAS_HEIGHT * 0.4,
      this.renderedDaruma.getBounds().height,
    );
    this.saveButton = new DarumaTextButton(this, 0, 0, 'Save', () => {
      DarumaService.instance.save(this.model).subscribe((res) => {
        //Upon saving, go to the previous scene
        const previousSceneKey = this.registry.get(
          RegistryKeys.PREVIOUS_SCENE,
        ) as SceneKeys;
        this.scene.stop();
        this.scene.wake(previousSceneKey);
      });
    }).setScale(0.6);
    Phaser.Display.Align.In.Center(
      this.saveButton,
      this.renderedDaruma,
      -this.CANVAS_WIDTH * 0.2,
      yOffset,
    );
    this.add.existing(this.saveButton);

    this.resetButton = new DarumaTextButton(this, 0, 0, 'Reset', () => {
      this.model = {
        id: this.model.id,
        bodyColor: DarumaBodyColor.EMPTY_DOTTED,
        leftEye: false,
        rightEye: false,
        goals: '',
      };
      this.setGoalText();
      this.renderedDaruma.updateModel(this.model);
    }).setScale(0.6);
    Phaser.Display.Align.In.Center(
      this.resetButton,
      this.renderedDaruma,
      this.CANVAS_WIDTH * 0.2,
      yOffset,
    );
    this.add.existing(this.resetButton);
  }

  private setGoalText() {
    const textToSet =
      this.model.goals.length > 0 ? this.model.goals : '-no text yet-';
    if (this.darumaText) {
      this.darumaText.setText(textToSet);
      return;
    }
    const yOffset = Math.min(
      this.CANVAS_HEIGHT * 0.2,
      this.renderedDaruma.getBounds().height,
    );
    this.darumaText = new Phaser.GameObjects.Text(this, 0, 0, textToSet, {
      fontSize: 24,
      color: DarumaColors.STRING.WHITE,
    });

    Phaser.Display.Align.In.Center(
      this.darumaText,
      this.renderedDaruma,
      0,
      yOffset,
    );
    this.add.existing(this.darumaText);
  }

  private addCarousel() {
    const renderedDarumaWidth = this.renderedDaruma.getBounds().width;
    const separationFromRenderedDaruma =
      renderedDarumaWidth / 2 + renderedDarumaWidth * 0.1;
    this.leftCarouselButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_left_carousel.png',
      () => {
        console.log('left carousel pressed');
      },
    );
    Phaser.Display.Align.In.Center(
      this.leftCarouselButton,
      this.renderedDaruma,
      -separationFromRenderedDaruma,
      0,
    );
    this.add.existing(this.leftCarouselButton);

    this.rightCarouselButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_right_carousel.png',
      () => {
        console.log('right carousel pressed');
      },
    );
    Phaser.Display.Align.In.Center(
      this.rightCarouselButton,
      this.renderedDaruma,
      separationFromRenderedDaruma,
      0,
    );
    this.add.existing(this.rightCarouselButton);

    this.leftCarouselButton.setScale(0.3);
    this.rightCarouselButton.setScale(0.3);
  }
}

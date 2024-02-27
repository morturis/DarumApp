import { DarumaService } from '../external_interfaces/daruma.service';
import { DarumaColors } from '../model/daruma-colors';
import {
  DarumaBodyColor,
  DarumaBottomSkin,
  DarumaModel,
  DarumaTopSkin,
} from '../model/daruma-model';
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

  private leftTopSkinCarouselButton!: DarumaImageButton;
  private rightTopSkinCarouselButton!: DarumaImageButton;

  private leftBottomSkinCarouselButton!: DarumaImageButton;
  private rightBottomSkinCarouselButton!: DarumaImageButton;

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
    this.addTopSkinCarousel();
    this.addBottomSkinCarousel();
  }

  preload() {
    const defaultModel: DarumaModel = {
      leftEye: false,
      rightEye: false,
      bodyColor: DarumaBodyColor.EMPTY_DOTTED,
      goals: '',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
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
        //TODO prompt requiring color, and text

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
        topSkin: DarumaTopSkin.NOTHING,
        bottomSkin: DarumaBottomSkin.NOTHING,
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
    const carouselColors: DarumaBodyColor[] = Object.values(
      DarumaBodyColor,
    ).filter((color) => color !== DarumaBodyColor.EMPTY_DOTTED);

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
        const indexOfCurrentColor = Math.max(
          carouselColors.findIndex((color) => color === this.model.bodyColor),
          0,
        );
        this.model.bodyColor = carouselColors.at(
          indexOfCurrentColor - 1,
        ) as DarumaBodyColor;
        this.renderedDaruma.updateModel(this.model);
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
        const indexOfCurrentColor = carouselColors.findIndex(
          (color) => color === this.model.bodyColor,
        );

        this.model.bodyColor = carouselColors.at(
          (indexOfCurrentColor + 1) % carouselColors.length,
        ) as DarumaBodyColor;
        this.renderedDaruma.updateModel(this.model);
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

  private addTopSkinCarousel() {
    const carouselContents = Object.values(DarumaTopSkin);
    const { width: renderedDarumaWidth, height: renderedDarumaHeight } =
      this.renderedDaruma.getBounds();
    const xSeparationFromRenderedDaruma =
      renderedDarumaWidth / 2 + renderedDarumaWidth * 0.075;
    const ySeparationFromRenderedDaruma =
      renderedDarumaHeight / 2 - renderedDarumaHeight * 0.2;
    this.leftTopSkinCarouselButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_left_carousel.png',
      () => {
        const indexOfCurrentColor = Math.max(
          carouselContents.findIndex((skin) => skin === this.model.topSkin),
          0,
        );
        this.model.topSkin = carouselContents.at(
          indexOfCurrentColor - 1,
        ) as DarumaTopSkin;
        this.renderedDaruma.updateModel(this.model);
      },
    );
    Phaser.Display.Align.In.Center(
      this.leftTopSkinCarouselButton,
      this.renderedDaruma,
      -xSeparationFromRenderedDaruma,
      -ySeparationFromRenderedDaruma,
    );
    this.add.existing(this.leftTopSkinCarouselButton);

    this.rightTopSkinCarouselButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_right_carousel.png',
      () => {
        const indexOfCurrentSkin = carouselContents.findIndex(
          (skin) => skin === this.model.topSkin,
        );

        this.model.topSkin = carouselContents.at(
          (indexOfCurrentSkin + 1) % carouselContents.length,
        ) as DarumaTopSkin;
        this.renderedDaruma.updateModel(this.model);
      },
    );
    Phaser.Display.Align.In.Center(
      this.rightTopSkinCarouselButton,
      this.renderedDaruma,
      xSeparationFromRenderedDaruma,
      -ySeparationFromRenderedDaruma,
    );
    this.add.existing(this.rightTopSkinCarouselButton);

    this.leftTopSkinCarouselButton.setScale(0.15);
    this.rightTopSkinCarouselButton.setScale(0.15);
  }

  private addBottomSkinCarousel() {
    const carouselContents = Object.values(DarumaBottomSkin);
    const { width: renderedDarumaWidth, height: renderedDarumaHeight } =
      this.renderedDaruma.getBounds();
    const xSeparationFromRenderedDaruma =
      renderedDarumaWidth / 2 + renderedDarumaWidth * 0.075;
    const ySeparationFromRenderedDaruma =
      renderedDarumaHeight / 2 - renderedDarumaHeight * 0.2;
    this.leftBottomSkinCarouselButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_left_carousel.png',
      () => {
        const indexOfCurrentColor = Math.max(
          carouselContents.findIndex((skin) => skin === this.model.bottomSkin),
          0,
        );
        this.model.bottomSkin = carouselContents.at(
          indexOfCurrentColor - 1,
        ) as DarumaBottomSkin;
        this.renderedDaruma.updateModel(this.model);
      },
    );
    Phaser.Display.Align.In.Center(
      this.leftBottomSkinCarouselButton,
      this.renderedDaruma,
      -xSeparationFromRenderedDaruma,
      ySeparationFromRenderedDaruma,
    );
    this.add.existing(this.leftBottomSkinCarouselButton);

    this.rightBottomSkinCarouselButton = new DarumaImageButton(
      this,
      0,
      0,
      'daruma_buttons',
      'daruma_right_carousel.png',
      () => {
        const indexOfCurrentSkin = carouselContents.findIndex(
          (skin) => skin === this.model.bottomSkin,
        );

        this.model.bottomSkin = carouselContents.at(
          (indexOfCurrentSkin + 1) % carouselContents.length,
        ) as DarumaBottomSkin;
        this.renderedDaruma.updateModel(this.model);
      },
    );
    Phaser.Display.Align.In.Center(
      this.rightBottomSkinCarouselButton,
      this.renderedDaruma,
      xSeparationFromRenderedDaruma,
      ySeparationFromRenderedDaruma,
    );
    this.add.existing(this.rightBottomSkinCarouselButton);

    this.leftBottomSkinCarouselButton.setScale(0.15);
    this.rightBottomSkinCarouselButton.setScale(0.15);
  }
}

import { DarumaService } from '../external_interfaces/daruma.service';
import {
  DarumaBodyColor,
  DarumaBottomSkin,
  DarumaModel,
  DarumaTopSkin,
} from '../model/daruma-model';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaBaseTopNav } from '../ui_components/daruma-base-top-nav';
import { DarumaImageButton } from '../ui_components/daruma-button';
import { DarumaConfirmDialog } from '../ui_components/daruma-confirm-dialog';
import { DarumaSprite } from '../ui_components/daruma-sprite';

export class DarumaEyePainting extends Phaser.Scene {
  private model!: DarumaModel;
  private renderedDaruma!: DarumaSprite; //interactive
  private goalText!: Phaser.GameObjects.Text;
  private topNav!: DarumaBaseTopNav;

  private CANVAS_WIDTH!: number;
  private CANVAS_HEIGHT!: number;

  constructor() {
    super({ key: SceneKeys.DARUMA_EYE_PAINTING });
  }

  create() {
    this.topNav = new DarumaBaseTopNav(this);
    this.add.existing(this.topNav);

    this.addDeleteButtonToTopNav();

    const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = this.sys.game.canvas;
    this.CANVAS_HEIGHT = CANVAS_HEIGHT;
    this.CANVAS_WIDTH = CANVAS_WIDTH;

    this.renderDaruma();
    this.addGoalText();
  }
  preload() {
    const defaultModel = {
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

    //TODO get from database? use registry only for ID?}
  }

  private addDeleteButtonToTopNav() {
    this.topNav.addExtraButton(
      new DarumaImageButton(
        this,
        0,
        0,
        'daruma_buttons',
        'daruma_delete_button.png',
        () => {
          const dialogConfirmPrompt = new DarumaConfirmDialog(
            this,
            0,
            0,
            () => {
              DarumaService.instance.delete(this.model).subscribe(() => {
                const previousSceneKey = this.registry.get(
                  RegistryKeys.PREVIOUS_SCENE,
                ) as SceneKeys;
                this.scene.stop();
                if (!previousSceneKey) this.scene.start(SceneKeys.MAIN);
                else this.scene.wake(previousSceneKey);
              });
            },
            'Delete Daruma?',
          );
          Phaser.Display.Align.In.Center(
            dialogConfirmPrompt,
            this.topNav,
            0,
            this.CANVAS_HEIGHT * 0.4,
          );
          this.add.existing(dialogConfirmPrompt);
        },
      ),
    );
  }
  private renderDaruma() {
    this.renderedDaruma = new DarumaSprite(this, 0, 0, this.model);
    this.renderedDaruma.x = this.CANVAS_WIDTH / 2;
    this.renderedDaruma.y = this.CANVAS_HEIGHT * 0.3;
    this.add.existing(this.renderedDaruma);

    this.renderedDaruma.setLeftEyeCallback(() => {
      this.model.leftEye = !this.model.leftEye;
      this.renderedDaruma.updateModel(this.model);
      DarumaService.instance.save(this.model).subscribe((daruma) => {
        console.log('Updated eye');
      });
    });
    this.renderedDaruma.setRightEyeCallback(() => {
      this.model.rightEye = !this.model.rightEye;
      this.renderedDaruma.updateModel(this.model);
      DarumaService.instance.save(this.model).subscribe((daruma) => {
        console.log('Updated eye');
      });
    });
  }

  private addGoalText() {
    this.goalText = new Phaser.GameObjects.Text(
      this,
      0,
      0,
      this.model.goals,
      {},
    );
    Phaser.Display.Align.In.Center(
      this.goalText,
      this.renderedDaruma,
      0,
      this.CANVAS_HEIGHT * 0.25,
    );
    this.add.existing(this.goalText);
  }
}

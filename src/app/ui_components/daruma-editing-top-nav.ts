import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaImageButton } from './daruma-button';

//TODO Should not be a scene
export class DarumaEditingTopNav extends Phaser.GameObjects.Container {
  private backButton!: DarumaImageButton;
  private logoImage!: Phaser.GameObjects.Image;
  private resetButton!: DarumaImageButton;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.addButtons();
    this.x = this.scene.game.canvas.width / 2;
    this.y = 50;
  }

  private addButtons() {
    this.backButton = new DarumaImageButton(
      this.scene,
      -100,
      0,
      'daruma_action_buttons',
      'daruma_back_button.png',
      () => {
        const previousSceneKey = this.scene.registry.get(
          RegistryKeys.PREVIOUS_SCENE,
        ) as SceneKeys;
        this.scene.scene.wake(previousSceneKey);
        this.scene.scene.stop();
      },
    ).setScale(0.15);
    this.logoImage = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'daruma_screen_buttons',
      'daruma_create_button_selected.png',
    ).setScale(0.15);
    this.resetButton = new DarumaImageButton(
      this.scene,
      100,
      0,
      'daruma_action_buttons',
      'daruma_reset_button.png',
      () => {
        //TODO probably overkill to restart the whole scene
        this.scene.scene.restart();
      },
    ).setScale(0.15);

    this.add([this.backButton, this.logoImage]);
  }
}

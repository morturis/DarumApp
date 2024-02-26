import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaImageButton } from './daruma-button';

export class DarumaBaseTopNav extends Phaser.GameObjects.Container {
  private createButton!: DarumaImageButton;
  private libraryButton!: DarumaImageButton;
  private archiveButton!: DarumaImageButton;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.addButtons();
    this.x = this.scene.game.canvas.width / 2;
    this.y = 50;
  }

  private addButtons() {
    this.createButton = new DarumaImageButton(
      this.scene,
      -100,
      0,
      'daruma_buttons',
      'daruma_create_button.png',
      () => {
        this.scene.registry.set(
          RegistryKeys.PREVIOUS_SCENE,
          this.scene.scene.key,
        );
        this.scene.scene.switch(SceneKeys.DARUMA_EDITING);
      },
    ).setScale(0.2);
    this.libraryButton = new DarumaImageButton(
      this.scene,
      0,
      0,
      'daruma_buttons',
      'daruma_library_button.png',
      () => {
        this.scene.scene.stop();
        this.scene.scene.start(SceneKeys.DARUMA_LIBRARY);
      },
    ).setScale(0.2);
    this.archiveButton = new DarumaImageButton(
      this.scene,
      100,
      0,
      'daruma_buttons',
      'daruma_archive_button.png',
      () => {
        this.scene.scene.stop();
        this.scene.scene.start(SceneKeys.DARUMA_ARCHIVE);
      },
    ).setScale(0.2);

    this.add([this.createButton, this.libraryButton, this.archiveButton]);
    this.setDepth(999);
  }
}

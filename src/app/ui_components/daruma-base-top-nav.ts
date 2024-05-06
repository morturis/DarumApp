import { Scene } from 'phaser';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaImageButton } from './daruma-button';

export class DarumaBaseTopNav extends Phaser.GameObjects.Container {
  private createButton!: DarumaImageButton;
  private libraryButton!: DarumaImageButton;
  private archiveButton!: DarumaImageButton;

  private extraButton?: DarumaImageButton;

  private buttonXOffset!: number;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.buttonXOffset = this.scene.game.canvas.width * 0.1;
    this.x = this.scene.game.canvas.width / 2;
    this.y = 50;
    this.addButtons();
    this.setDepth(999);
  }

  private addButtons() {
    const currentSceneKey = this.scene.scene.key;
    this.createButton = new DarumaImageButton(
      this.scene,
      -this.buttonXOffset,
      0,
      'daruma_screen_buttons',
      currentSceneKey === SceneKeys.DARUMA_EDITING
        ? 'daruma_create_button_selected.png'
        : 'daruma_create_button.png',
      () => {
        this.scene.registry.set(
          RegistryKeys.PREVIOUS_SCENE,
          this.scene.scene.key,
        );
        this.scene.scene.switch(SceneKeys.DARUMA_EDITING);
      },
    ).setScale(0.15);
    this.libraryButton = new DarumaImageButton(
      this.scene,
      0,
      0,
      'daruma_screen_buttons',
      currentSceneKey === SceneKeys.DARUMA_LIBRARY
        ? 'daruma_library_button_selected.png'
        : 'daruma_library_button.png',
      () => {
        this.scene.scene.stop();
        this.scene.scene.start(SceneKeys.DARUMA_LIBRARY);
      },
    ).setScale(0.15);
    this.archiveButton = new DarumaImageButton(
      this.scene,
      this.buttonXOffset,
      0,
      'daruma_screen_buttons',
      currentSceneKey === SceneKeys.DARUMA_ARCHIVE
        ? 'daruma_archive_button_selected.png'
        : 'daruma_archive_button.png',
      () => {
        this.scene.scene.stop();
        this.scene.scene.start(SceneKeys.DARUMA_ARCHIVE);
      },
    ).setScale(0.15);

    this.add([this.createButton, this.libraryButton, this.archiveButton]);
  }

  addExtraButton(button: DarumaImageButton) {
    this.extraButton = button;
    this.extraButton.x = 2 * this.buttonXOffset + button.x;
    this.extraButton.setScale(0.1);

    this.add(this.extraButton);
  }
}

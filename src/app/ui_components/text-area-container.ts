import { RegistryKeys } from '../model/registry-keys';
import { isMobileDevice } from '../utils';

export class TextAreaContainer extends Phaser.GameObjects.Container {
  private nameForm!: Phaser.GameObjects.Graphics;

  private placeholderText: string;
  private textAreaWidth: number;
  private textAreaHeight: number;

  constructor(
    scene: Phaser.Scene,
    placeholderText: string,
    width: number = 300,
    height: number = 64,
  ) {
    super(scene);
    this.placeholderText = placeholderText;
    this.textAreaWidth = width;
    this.textAreaHeight = height;

    this.addTextArea();
    this.add(this.nameForm);
  }

  addTextArea() {
    const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE);

    this.nameForm = new Phaser.GameObjects.Graphics(this.scene, {});
    this.nameForm.fillStyle(0xffffff);
    this.nameForm.fillRect(
      -this.textAreaWidth / 2,
      -this.textAreaHeight / 2,
      this.textAreaWidth,
      this.textAreaHeight,
    );
    this.nameForm.setInteractive(
      new Phaser.Geom.Rectangle(
        -this.textAreaWidth / 2,
        -this.textAreaHeight / 2,
        this.textAreaWidth,
        this.textAreaHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    this.activateForm();
  }

  // Activate/ deactivate the input form
  private activateForm() {
    this.on('pointerup', () => {
      const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE);

      if (gameState.isEnteringName) return;
      // isEnteringName is used to turn on and off the recording of key strokes.
      gameState.isEnteringName = true;

      // Reset name form
      if (gameState.name === this.placeholderText) {
        gameState.name = '';
      }

      // // Add blinking cursor
      // gameState.formCursor.setAlpha(0);
      // cursorTween.resume();

      // Activate the on-screen keyboard for mobile devices
      if (isMobileDevice()) {
        gameState.hiddenInput.focus();
      }

      // deactivateNameForm() must be called after a short delay to ensure that the pointerup
      // event that called activateNameForm() doesn't inadvertently call it as well.
      this.scene.time.delayedCall(200, () => {
        this.deactivateForm();
      });

      this.scene.registry.set(RegistryKeys.GAME_STATE, gameState);
    });
  }
  private deactivateForm() {
    this.scene.input.off('pointerup');
    const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE);
    this.scene.input.once('pointerup', () => {
      if (!gameState.isEnteringName) return;

      let delayTime = 0;

      // Reset form if it's empty
      if (!gameState.name) {
        gameState.name = 'Enter your name...';
        delayTime = 100; // Gives Update() time to update the name field before !isEnteringName.
      }

      // Deactivates typing
      this.scene.time.delayedCall(delayTime, () => {
        gameState.isEnteringName = false;
      });

      //   // Remove cursor
      //   gameState.formCursor.setAlpha(0);
      //   cursorTween.pause();

      // Deactivate the on-screen keyboard for mobile devices
      if (isMobileDevice()) {
        gameState.hiddenInput.blur();
      }
      this.scene.registry.set(RegistryKeys.GAME_STATE, gameState);
    });
  }
}

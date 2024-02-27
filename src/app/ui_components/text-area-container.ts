import { DarumaColors } from '../model/daruma-colors';
import { RegistryKeys } from '../model/registry-keys';
import { isMobileDevice } from '../utils';

/**
 * @deprecated use TextAreaInput instead
 */
export class TextAreaContainer extends Phaser.GameObjects.Container {
  private textArea!: Phaser.GameObjects.Graphics;
  private textAreaHitArea!: Phaser.GameObjects.Shape;
  private text!: Phaser.GameObjects.Text;

  private placeholderText: string;

  private TEXT_AREA_WIDTH: number;
  private TEXT_AREA_HEIGHT: number;

  constructor(
    scene: Phaser.Scene,
    placeholderText: string,
    width: number = 300,
    height: number = 64,
  ) {
    super(scene);
    this.placeholderText = placeholderText;
    this.TEXT_AREA_WIDTH = width;
    this.TEXT_AREA_HEIGHT = height;

    this.addTextArea();
    this.addText();
    this.add(this.textArea);
  }

  addTextArea() {
    const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE);

    this.textArea = new Phaser.GameObjects.Graphics(this.scene, {});
    this.textArea.fillStyle(0xffffff);
    this.textArea.fillRect(
      -this.TEXT_AREA_WIDTH / 2,
      -this.TEXT_AREA_HEIGHT / 2,
      this.TEXT_AREA_WIDTH,
      this.TEXT_AREA_HEIGHT,
    );

    const rectangle = new Phaser.Geom.Rectangle(
      -this.TEXT_AREA_WIDTH / 2,
      -this.TEXT_AREA_HEIGHT / 2,
      this.TEXT_AREA_WIDTH,
      this.TEXT_AREA_HEIGHT,
    );
    this.textAreaHitArea = new Phaser.GameObjects.Shape(
      this.scene,
      'abc',
      rectangle,
    );
    this.setInteractive(rectangle, Phaser.Geom.Rectangle.Contains);
    this.add(this.textArea);

    this.activateForm();

    // Log key strokes if isEnteringName === true
    this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE) || {};
      if (!gameState.isEnteringName) return;

      // Cap the name length to keep the text from overflowing the form
      const maxNameLength = 16;

      // Implement backspace
      //keycode is deprecated and should be "Backspace"
      //if (event.keyCode === 8 && gameState.name.length > 0) {
      if (event.code === 'Backspace' && gameState.name.length > 0) {
        gameState.name = gameState.name.slice(0, -1);

        // Add any other characters you want to allow
      } else if (
        event.key.length === 1 &&
        event.key.match(/[a-zA-Z0-9\s\-_]/) &&
        gameState.name.length < maxNameLength
      ) {
        gameState.name += event.key;

        // Gently informs the player that its time to stop typing
      } else if (gameState.name.length === maxNameLength) {
        this.scene.cameras.main.shake(30, 0.001, false);
      }
    });
  }

  addText() {
    this.text = new Phaser.GameObjects.Text(
      this.scene,
      this.TEXT_AREA_WIDTH,
      this.TEXT_AREA_HEIGHT,
      this.placeholderText,
      { fontSize: 24, color: DarumaColors.STRING.GRAY, align: 'center' },
    ).setDepth(999);
    Phaser.Display.Align.In.Center(this.text, this.textAreaHitArea, 0, 0);
    this.scene.add.existing(this.text);
  }

  // Activate/ deactivate the input form
  private activateForm() {
    this.on('pointerup', () => {
      const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE) || {};

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
    const gameState = this.scene.registry.get(RegistryKeys.GAME_STATE) || {};
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

  getText() {
    return 'test';
  }
}

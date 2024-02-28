import { ConfirmDialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import { DarumaColors } from '../model/daruma-colors';

export class DarumaConfirmDialog extends Phaser.GameObjects.Container {
  private dialog!: ConfirmDialog;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    action: () => void,
    title: string,
    content: string,
    confirmText?: string,
    cancelText?: string,
  ) {
    super(scene);

    this.createDialog(action, x, y, title, content, confirmText, cancelText);
  }

  private createDialog(
    action: () => void,
    x: number,
    y: number,
    title: string,
    content: string,
    confirmText?: string,
    cancelText?: string,
  ) {
    const rexUI = (this.scene as Phaser.Scene & { rexUI?: UIPlugin }).rexUI;

    var style: ConfirmDialog.IConfig = {
      width: 300,
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        title: 20,
        content: 30,
        action: 15,
      },

      background: {
        color: DarumaColors.HEX.BLACK,
        strokeColor: DarumaColors.HEX.WHITE,
        radius: 20,
      },

      title: {
        space: { left: 5, right: 5, top: 5, bottom: 5 },
        text: {
          fontSize: 24,
        },
        background: {
          color: DarumaColors.HEX.BLACK,
        },
      },

      content: {
        space: { left: 5, right: 5, top: 5, bottom: 5 },
        text: {
          fontSize: 20,
        },
      },

      buttonMode: 2,
      button: {
        space: { left: 10, right: 10, top: 10, bottom: 10 },
        background: {
          color: DarumaColors.HEX.BLACK,
          strokeColor: DarumaColors.HEX.WHITE,
          radius: 10,

          'hover.strokeColor': DarumaColors.HEX.BLACK,
        },
      },

      align: {
        actions: 'center',
      },
    };
    this.dialog = new ConfirmDialog(this.scene, style);
    this.dialog.setPosition(x, y);
    this.dialog.resetDisplayContent({
      title: title || '-no title-',
      content: content || '-no content-',
      buttonA: confirmText || 'Confirm',
      buttonB: cancelText || 'Cancel',
    });
    this.dialog.layout();
    this.dialog.modalPromise().then(action);

    this.add(this.dialog);
  }
}

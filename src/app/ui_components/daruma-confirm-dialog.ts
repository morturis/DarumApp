import {
  ConfirmDialog,
  Dialog,
  SimpleLabel,
} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import { DarumaColors } from '../model/daruma-colors';
import { ModalBehavoir } from 'phaser3-rex-plugins/plugins/modal';

export class DarumaConfirmDialog extends Phaser.GameObjects.Container {
  private dialog!: ConfirmDialog;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    action: () => void,
    title: string,
    content?: string,
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
    content?: string,
    confirmText?: string,
    cancelText?: string,
  ) {
    const titleStyle: SimpleLabel.IConfig = {
      align: 'center',
      text: {
        fontSize: 24,
      },
    };
    const contentStyle: SimpleLabel.IConfig = {
      align: 'center',
      text: {
        fontSize: 20,
      },
    };
    const style: ConfirmDialog.IConfig = {
      space: {
        left: 15,
        right: 15,
        top: title ? 30 : 15,
        bottom: 20, //space between buttons and bottom edge
        title: content ? 0 : 10,
        content: content ? 20 : 0,
        action: 25,
      },

      background: {
        color: DarumaColors.HEX.BLACK,
        strokeColor: DarumaColors.HEX.WHITE,
        radius: 20,
      },

      title: title ? titleStyle : undefined,

      content: content ? contentStyle : undefined,

      buttonMode: 2,
      button: {
        space: { left: 10, right: 10, top: 10, bottom: 10 },
        text: {
          color: DarumaColors.HEX.BLACK, //button text color, possibly an addition!
        },
        background: {
          color: DarumaColors.HEX.WHITE, //fondo del boton
          strokeColor: DarumaColors.HEX.BLACK, //borde del boton
          radius: 10,
          'hover.color': DarumaColors.HEX.GRAY,
          'hover.strokeColor': DarumaColors.HEX.BLACK,
        },
      },

      align: {
        actions: 'center',
      },
    };
    this.dialog = new ConfirmDialog(this.scene, style);
    this.dialog.setPosition(x, y);
    this.dialog.setDraggable('title');
    this.dialog.resetDisplayContent({
      title: title,
      content: content,
      buttonA: confirmText || 'Confirm',
      buttonB: cancelText || 'Cancel',
    });
    this.dialog.layout();
    this.dialog.modalPromise().then((data) => {
      if ((data as Dialog.CloseEventDataType).index === 1) return;
      else action();
    });

    this.add(this.dialog);
  }
}

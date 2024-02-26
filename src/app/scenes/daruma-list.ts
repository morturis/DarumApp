import { DarumaModel } from '../model/daruma-model';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaBaseTopNav } from '../ui_components/daruma-base-top-nav';
import { DarumaSprite } from '../ui_components/daruma-sprite';

export class DarumaList extends Phaser.Scene {
  archivedDarumas: DarumaModel[] = [];
  renderedDarumas: DarumaSprite[] = [];

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({
      ...config,
      pack: {
        files: [
          {
            type: 'plugin',
            key: 'rexawaitloaderplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexawaitloaderplugin.min.js',
            start: true,
          },
        ],
      },
    });
  }

  create() {
    console.log('create started');
    this.add.existing(new DarumaBaseTopNav(this));

    this.updateRenderedDarumas();
  }

  //This is just a default method
  preload() {
    throw new Error('Method not implemented');
  }

  updateRenderedDarumas() {
    this.renderedDarumas.map((daruma) => daruma.destroy);
    this.renderedDarumas = [];
    this.archivedDarumas.forEach((model: DarumaModel) => {
      //No need to set X or Y because I will align them later
      const render = new DarumaSprite(this, 0, 0, model);
      render.setBodyCallback(() => {
        this.registry.set(RegistryKeys.PREVIOUS_SCENE, this.scene.key);
        this.registry.set(RegistryKeys.EDITED_DARUMA, model);
        this.scene.switch(SceneKeys.DARUMA_EYE_PAINTING);
      });
      this.renderedDarumas.push(render);
      this.add.existing(render);
    });

    if (!this.renderedDarumas[0]) return;
    const { width: DARUMA_WIDTH, height: DARUMA_HEIGHT } =
      this.renderedDarumas[0].getBounds();
    Phaser.Actions.GridAlign(this.renderedDarumas, {
      width: 2,
      height: 3,
      cellWidth: DARUMA_WIDTH,
      cellHeight: DARUMA_HEIGHT,
      x: (this.sys.game.canvas.width - DARUMA_WIDTH) / 2,
      y: 200,
    });
  }
}

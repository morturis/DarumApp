import { DarumaModel } from '../model/daruma-model';
import { RegistryKeys } from '../model/registry-keys';
import { SceneKeys } from '../model/scene-keys';
import { DarumaBaseTopNav } from '../ui_components/daruma-base-top-nav';
import { DarumaSprite } from '../ui_components/daruma-sprite';
import { DarumaTabs } from '../ui_components/daruma-tabs';

export class DarumaList extends Phaser.Scene {
  modelDarumas: DarumaModel[] = [];
  renderedDarumas: DarumaSprite[] = [];
  private tabs!: DarumaTabs;
  private topNavBar!: DarumaBaseTopNav;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({
      ...config,
    });
  }

  create() {
    console.log('create started');
    this.topNavBar = new DarumaBaseTopNav(this);
    const navBarHeight = this.topNavBar.getBounds().height;
    this.add.existing(this.topNavBar);
    this.tabs = new DarumaTabs(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + navBarHeight * 0.8,
    );

    this.updateRenderedDarumas();

    //Set up refreshing on waking
    this.events.on(Phaser.Scenes.Events.WAKE, () => {
      this.loadDarumas();
    });
  }

  preload() {
    this.loadDarumas();
  }

  loadDarumas() {
    throw new Error('Method not implemented');
  }

  updateRenderedDarumas() {
    this.renderedDarumas.map((daruma) => daruma.destroy());
    this.renderedDarumas = [];
    this.modelDarumas.forEach((model: DarumaModel) => {
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
    this.tabs.updateTabs(this.renderedDarumas, 6);
    // const { width: DARUMA_WIDTH, height: DARUMA_HEIGHT } =
    //   this.renderedDarumas[0].getBounds();
    // Phaser.Actions.GridAlign(this.renderedDarumas, {
    //   width: 2,
    //   height: Math.ceil(this.renderedDarumas.length / 2),
    //   cellWidth: DARUMA_WIDTH,
    //   cellHeight: DARUMA_HEIGHT,
    //   x: (this.sys.game.canvas.width - DARUMA_WIDTH) / 2,
    //   y: 200,
    // });
  }
}

import { Label, TabPages, Tabs, TextArea } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { DarumaColors } from '../model/daruma-colors';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectanglecanvas';

export class DarumaTabs extends Phaser.GameObjects.Group {
  private tabs!: TabPages;
  private x: number;
  private y: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);
    this.x = x;
    this.y = y;

    this.createTabPages();
  }

  private createTabPages() {
    const rectangle: RoundRectangle = new RoundRectangle(
      this.scene,
      0,
      0,
      0,
      0,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    this.scene.add.existing(rectangle);

    const tabsConfig: TabPages.IConfig = {
      x: this.x, y: this.y,
      width: this.scene.sys.canvas.width, height: this.scene.sys.canvas.height * .85,
      background: rectangle,
      tabs: {
        space: { item: 3 },
      },
      align: {
        tabs: 'center'
      },
      tabsPosition: "bottom",
      space: { left: 10, right: 10, top: 50, bottom: 10, item: 10 }
    };
    this.tabs = new TabPages(this.scene, tabsConfig);
    this.tabs.drawBounds(this.scene.add.graphics(), DarumaColors.HEX.WHITE);

  }

  updateTabs(allContents: Phaser.GameObjects.Container[], numberPerPage: number) {
    const { width: UNIT_WIDTH, height: UNIT_HEIGHT } = allContents[0].getBounds();

    for (let i = 0; i < allContents.length; i = i + numberPerPage) {
      const contentOfThisPage: Phaser.GameObjects.GameObject[] = allContents.slice(i, i + numberPerPage);
      const containerForThisPage = new Phaser.GameObjects.Container(this.scene);
      containerForThisPage.add(contentOfThisPage);
      Phaser.Actions.GridAlign(contentOfThisPage, {
        width: 2,
        height: 3,
        cellWidth: UNIT_WIDTH,
        cellHeight: UNIT_HEIGHT,
        x: -UNIT_WIDTH / 2, //0 means the middle of the first unit
        y: -UNIT_HEIGHT, //0 means the middle of the first unit
      });
      this.scene.add.existing(containerForThisPage);
      const tabKey = `${(i / 6) + 1}`;
      this.tabs.addPage(tabKey, this.createLabel(tabKey), containerForThisPage);
    }
    this.tabs.layout();
    this.tabs.swapFirstPage();

  }

  private createLabel(tabKey?: string) {
    const labelBackground = new RoundRectangle(
      this.scene,
      0,
      0,
      300,
      300,
      4,
      DarumaColors.HEX.WHITE,
      undefined,
      undefined,
    );
    this.scene.add.existing(labelBackground);

    const labelText = new Phaser.GameObjects.Text(this.scene, 0, 0, tabKey || 'title', {
      fontSize: 24,
      color: DarumaColors.STRING.BLACK,
    });
    this.scene.add.existing(labelText);

    const labelConfig: Label.IConfig = {
      text: labelText,
      background: labelBackground,
    };
    const label = new Label(this.scene, labelConfig);
    return this.scene.add.existing(label);
  }
}

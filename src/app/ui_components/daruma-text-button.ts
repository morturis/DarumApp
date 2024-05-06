import { DarumaColors } from "../model/daruma-colors";

export class DarumaTextButton extends Phaser.GameObjects.Container {
    private text!: Phaser.GameObjects.Text;
    private image: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        action: () => void,
    ) {
        super(scene, x, y);

        this.image = new Phaser.GameObjects.Image(
            scene,
            x,
            y,
            'daruma_action_buttons',
            'daruma_text_button.png',
        );
        this.image.setScale(0.4);
        this.add(this.image);

        this.text = new Phaser.GameObjects.Text(scene, x, y, text, {
            fontSize: 60,
            strokeThickness: 6,
            align: 'center',
            color: DarumaColors.STRING.BLACK,
            stroke: DarumaColors.STRING.BLACK,
        });
        Phaser.Display.Align.In.Center(this.text, this.image);
        this.add(this.text);

        this.setSize(this.image.width, this.image.height);
        this.image.setInteractive();

        this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, action);
        this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.image.setTint(DarumaColors.HEX.GRAY); //slightly darken
            this.text?.setColor(DarumaColors.STRING.WHITE);
        });
        this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.image.setTint();
            this.text?.setColor(DarumaColors.STRING.BLACK);
        });
    }
}
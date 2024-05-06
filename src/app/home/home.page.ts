import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { DarumaService } from '../external_interfaces/daruma.service';
import { DarumaArchive } from '../scenes/daruma-archive';
import { DarumaCreationView } from '../scenes/daruma-creation-view';
import { DarumaLibrary } from '../scenes/daruma-library';
import { MainScene } from '../scenes/main-scene';
import { DarumaEyePainting } from '../scenes/daruma-eye-painting';
import { DarumaGoalInput } from '../scenes/daruma-goal-input';
import { DarumaColors } from '../model/daruma-colors';

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const MIN_WIDTH = 240;
const MIN_HEIGHT = 260;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [DarumaArchive],
})
export class HomePage implements OnInit {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(private darumaService: DarumaService) {
    this.config = {
      type: Phaser.AUTO,
      height: window.innerHeight,
      width: window.innerWidth,
      //backgroundColor: DarumaColors.HEX.PINK,
      scene: [
        MainScene,
        DarumaArchive,
        DarumaLibrary,
        DarumaCreationView,
        DarumaEyePainting,
        DarumaGoalInput,
      ],
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameContainer',
        min: {
          width: MIN_WIDTH,
          height: MIN_HEIGHT,
        },
        max: {
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
        },
      },
      parent: 'gameContainer',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: { y: 0, x: 0 },
        },
      },
    };
  }
  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

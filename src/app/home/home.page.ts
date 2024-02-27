import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { DarumaService } from '../external_interfaces/daruma.service';
import { DarumaArchive } from '../scenes/daruma-archive';
import { DarumaEditingView } from '../scenes/daruma-editing-view';
import { DarumaLibrary } from '../scenes/daruma-library';
import { MainScene } from '../scenes/main-scene';
import { DarumaEyePainting } from '../scenes/daruma-eye-painting';
import { DarumaGoalInput } from '../scenes/daruma-goal-input';

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
      scene: [
        MainScene,
        DarumaArchive,
        DarumaLibrary,
        DarumaEditingView,
        DarumaEyePainting,
        DarumaGoalInput,
      ],
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

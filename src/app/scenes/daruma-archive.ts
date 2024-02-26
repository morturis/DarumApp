import { Injectable } from '@angular/core';
import { DarumaService } from '../external_interfaces/daruma.service';
import { SceneKeys } from '../model/scene-keys';
import { DarumaList } from './daruma-list';

@Injectable()
export class DarumaArchive extends DarumaList {
  constructor() {
    super({ key: SceneKeys.DARUMA_ARCHIVE });
  }
  override preload() {
    this.archivedDarumas = [];
    this.renderedDarumas = [];

    //This call will keep going even after the scene has been created
    //Could be made async by using the asyncLoader plugin
    //FIXME using services statically is very hacky
    //TODO add spinner?
    DarumaService.instance.getList(1).subscribe((data) => {
      this.archivedDarumas = [...data];
      this.updateRenderedDarumas();
    });
  }
}

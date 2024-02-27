import { DarumaService } from '../external_interfaces/daruma.service';
import { SceneKeys } from '../model/scene-keys';
import { DarumaList } from './daruma-list';

export class DarumaLibrary extends DarumaList {
  constructor() {
    super({ key: SceneKeys.DARUMA_LIBRARY });
  }
  override loadDarumas() {
    this.archivedDarumas = [];
    this.renderedDarumas = [];

    //This call will keep going even after the scene has been created
    //Could be made async by using the asyncLoader plugin
    //FIXME using services statically is very hacky
    //TODO add spinner?
    DarumaService.instance.getList(1).subscribe((data) => {
      //Filter, get only those with <2 eyes
      this.archivedDarumas = [
        ...data.filter((daruma) => !(daruma.leftEye && daruma.rightEye)),
      ];
      this.updateRenderedDarumas();
    });
  }
}

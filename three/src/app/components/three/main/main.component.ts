import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { THREEMethods } from 'src/app/class/THREEmethods';
import {
  ConfigHandlerService,
  activeLabel,
} from 'src/app/service/config-handler.service';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

@Component({
  selector: 'three-main',
  template: ` <div #threecontainer class="w-full h-full"></div> `,
})
export class MainComponent implements OnInit {
  @ViewChild('threecontainer', { static: true })
  threeContainer!: ElementRef<HTMLDivElement>;
  file: null | File = null;
  zoom: number | undefined;

  THREEmethods!: THREEMethods;
  constructor(private configHandlerService: ConfigHandlerService) {}

  ngOnInit(): void {
    this.THREEmethods = new THREEMethods(this.threeContainer, 10);
    this.configHandlerService.file$.subscribe((_file) => {
      this.THREEmethods.disposePrevMesh('svg');
      this.file = _file;
      if (this.file) this.THREEmethods.loadSvg(this.file);
    });
    this.configHandlerService.rectangle$.subscribe((rec) => {
      if (!rec) {
        this.THREEmethods.disposePrevMesh('rec');
      } else {
        const mesh = this.THREEmethods.scene.getObjectsByProperty('name', 'rec');
        if (!mesh.length) {
          this.THREEmethods.createRecLabel(rec)
        } else {
          this.THREEmethods.updateRect(rec)
        }
      }
    });


    this.configHandlerService.config$.subscribe((cfg) => {
      this.zoom = cfg.env.zoom
      this.THREEmethods.setzoom = cfg.env.zoom
    });
  }
}

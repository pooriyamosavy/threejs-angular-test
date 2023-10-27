import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { activeLabel } from '../service/config-handler.service';

export class THREEMethods {
  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private svgLoader: SVGLoader;
  private camera: THREE.OrthographicCamera;

  constructor(
    private threeContainer: ElementRef<HTMLDivElement>,
    private zoom: number
  ) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.svgLoader = new SVGLoader();
    this.camera = new THREE.OrthographicCamera(
      this.threeContainer.nativeElement.offsetWidth / -2,
      this.threeContainer.nativeElement.offsetWidth / 2,
      this.threeContainer.nativeElement.clientHeight / 2,
      this.threeContainer.nativeElement.clientHeight / -2,
      1,
      1000
    );
    this.camera.lookAt(0, 0, 0);
    this.scene.background = new THREE.Color('#fff');
    this.renderer.setSize(
      this.threeContainer.nativeElement.offsetWidth,
      this.threeContainer.nativeElement.offsetHeight
    );
    this.threeContainer.nativeElement.appendChild(this.renderer.domElement);
    this.camera.position.z = 100;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }

  disposePrevMesh(name: string) {
    const mesh = this.scene.getObjectsByProperty('name', name);
    if (mesh.length)
      mesh.forEach((m) => {
        this.scene.remove(m);
      });
  }

  loadSvg(file: File) {
    this.svgLoader.load(URL.createObjectURL(file), (data) => {
      const paths = data.paths;
      const group = new THREE.Group();
      group.name = 'svg';
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const shapes = SVGLoader.createShapes(path);
        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.geometry.center();
          mesh.name = 'svg';
          group.add(mesh);
          this.scene.add(mesh);
        }
      }
      this.scene.add(group);
      console.log(this.scene.children);
    });
  }

  createTexture(rec: Exclude<activeLabel, undefined>) {
    const canvas = document.createElement('canvas');
    canvas.width = rec.w;
    canvas.height = rec.h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `30px Arial`;
      ctx.fillStyle = 'black';
      ctx.fillText(
        rec.text,
        (rec.w - ctx.measureText(rec.text).width) / 2,
        (rec.h + 15) / 2
      );
      ctx.textAlign = 'center';
    }
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  createRecLabel(rec: Exclude<activeLabel, undefined>) {
    const texture = this.createTexture(rec);
    const geometry = new THREE.PlaneGeometry(rec.w, rec.h);
    geometry.name = 'rec';
    geometry.name = 'rec';
    const material = new THREE.MeshBasicMaterial({
      color: rec.color,
      side: THREE.DoubleSide,
      map: texture,
    });
    material.name = 'rec';
    material.transparent = true;
    const plane = new THREE.Mesh(geometry, material);
    plane.name = 'rec';
    plane.position.set(rec.x, rec.y, 2);
    this.scene.add(plane);
  }

  updateRect(rec: Exclude<activeLabel, undefined>) {
    const mesh = this.scene.getObjectsByProperty('name', 'rec');
    mesh.forEach((m) => {
      if (m instanceof THREE.Mesh) {
        m.position.set(rec.x, rec.y, 2)
        console.log('m', m.geometry)
        if (m.material instanceof THREE.MeshBasicMaterial) {
          const texture = this.createTexture(rec);
          m.material.map = texture;
          m.material.color = new THREE.Color( rec.color )
        }
        if(m.geometry instanceof THREE.PlaneGeometry) {
          const newGeometry = new THREE.PlaneGeometry(rec.w, rec.h)
          m.geometry.dispose()
          m.geometry = newGeometry
        }
      }
    });
  }

  set setzoom (num: number) {
    this.zoom = num
    this.camera.zoom = num / 10
    this.camera.updateProjectionMatrix()
  }
}

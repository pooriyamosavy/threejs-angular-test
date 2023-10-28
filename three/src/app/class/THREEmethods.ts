import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import {
  ConfigHandlerService,
  activeLabel,
} from '../service/config-handler.service';

export class THREEMethods {
  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private svgLoader: SVGLoader;
  private camera: THREE.OrthographicCamera;
  private imageLoader: THREE.ImageLoader;

  constructor(
    private threeContainer: ElementRef<HTMLDivElement>,
    private zoom: number,
    private configHandlerService: ConfigHandlerService
  ) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.svgLoader = new SVGLoader();
    this.imageLoader = new THREE.ImageLoader();
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
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    this.renderer.setSize(
      this.threeContainer.nativeElement.offsetWidth,
      this.threeContainer.nativeElement.offsetHeight
    );
    this.renderer.domElement.addEventListener('click', (e) => {
      pointer.x =
        (e.offsetX / this.threeContainer.nativeElement.offsetWidth) * 2 - 1;
      pointer.y =
        -(e.offsetY / this.threeContainer.nativeElement.offsetHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children);
      if (intersects.length) {
        this.configHandlerService.setX_AND_Y({
          x: intersects[0].point.x,
          y: intersects[0].point.y,
        });
        // cube.position.set(intersects[0].point.x, intersects[0].point.y, 10);
      }
      console.log(intersects);
    });
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

  loadSimpleSvg(file: File) {
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
    });
  }

  loadComplexSvg(file: File) {
    this.svgLoader.load(URL.createObjectURL(file), (data) => {
      const svgGroup = new THREE.Group();

      data.paths.forEach((path, i) => {
        const material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const shapes = path.toShapes(false);
        shapes.forEach((shape, j) => {
          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 20,
            bevelEnabled: false,
          });
          const mesh = new THREE.Mesh(geometry, material);
          svgGroup.add(mesh);
        });
      });
      const box = new THREE.Box3().setFromObject(svgGroup);
      const size = new THREE.Vector3();
      box.getSize(size);

      const yOffset = size.y / -2;
      const xOffset = size.x / -2;

      svgGroup.children.forEach((item) => {
        item.position.x = xOffset;
        item.position.y = yOffset;
      });

      svgGroup.scale.y *= -1;

      svgGroup.scale.y *= 0.1;
      svgGroup.scale.x *= 0.1;
      svgGroup.scale.z *= 0.1;

      this.scene.add(svgGroup);
    });
  }

  LoadSvgAsPng(file: File) {
    this.svgLoader.load(URL.createObjectURL(file), (loadedFile) => {
      const svg = loadedFile.xml;
      const serializer = new XMLSerializer();
      const copy = svg.cloneNode(true);
      const data = serializer.serializeToString(copy);
      const blob = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      this.imageLoader.load(url, (img) => {
        // const map = new THREE.TextureLoader().load( url );
        // map.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
        // map.minFilter = THREE.LinearFilter;
        const map = this.createBgTexture(img, img.width * 10, img.height * 10);
        // map.encoding = THREE.sRGBEncoding;
        map.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.PlaneGeometry(
          800,
          800 * (img.height / img.width),
          1000,
          1000
        );
        geometry.name = 'svg';
        const material = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          map,
        });
        material.name = 'svg';
        const plane = new THREE.Mesh(geometry, material);
        plane.name = 'svg';
        this.scene.add(plane);
      });
    });
  }

  createBgTexture(image: CanvasImageSource, w: number, h: number) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, w, h);
      ctx.textAlign = 'center';
    }
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  createLabelTexture(rec: Exclude<activeLabel, undefined>) {
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
    const texture = this.createLabelTexture(rec);
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
        m.position.set(rec.x, rec.y, 2);
        console.log('m', m.geometry);
        if (m.material instanceof THREE.MeshBasicMaterial) {
          const texture = this.createLabelTexture(rec);
          m.material.map = texture;
          m.material.color = new THREE.Color(rec.color);
        }
        if (m.geometry instanceof THREE.PlaneGeometry) {
          const newGeometry = new THREE.PlaneGeometry(rec.w, rec.h);
          m.geometry.dispose();
          m.geometry = newGeometry;
        }
      }
    });
  }

  set setzoom(num: number) {
    this.zoom = num;
    this.camera.zoom = num / 10;
    this.camera.updateProjectionMatrix();
  }
}

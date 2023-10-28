import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigHandlerService {
  private config = new BehaviorSubject<config>({
    env: {
      zoom: 10,
      activeItem: undefined,
    },
  });
  private activeLabel = new BehaviorSubject<activeLabel>(undefined);
  private file = new BehaviorSubject<File | null>(null);

  constructor() {}

  get config$(): Observable<config> {
    return this.config.asObservable();
  }

  addZoom() {
    if (this.config.value.env.zoom !== 20) {
      this.config.next({
        ...this.config.value,
        env: {
          ...this.config.value.env,
          zoom: this.config.value.env.zoom + 1,
        },
      });
    }
  }

  subZoom() {
    if (this.config.value.env.zoom !== 1) {
      this.config.next({
        ...this.config.value,
        env: {
          ...this.config.value.env,
          zoom: this.config.value.env.zoom - 1,
        },
      });
    }
  }

  set setActiveItem(item: string | undefined) {
    const cfg = { ...this.config.value };
    cfg.env.activeItem = item;
    this.config.next(cfg);
  }

  get file$(): Observable<File | null> {
    return this.file.asObservable();
  }

  set setFile(_file: File) {
    this.file.next(_file);
  }

  set setRectangle(label: activeLabel) {
    this.activeLabel.next(label);
  }

  get rectangle$() {
    return this.activeLabel.asObservable();
  }

  set rectText(text: string) {
    console.log(this.activeLabel);
    if (this.activeLabel.value) {
      this.activeLabel.next({
        ...this.activeLabel.value,
        text,
      });
    }
  }

  saveConfig({ color, height, label, width, x, y }: saveConfigParams) {
    if (this.activeLabel.value)
      this.activeLabel.next({
        ...this.activeLabel.value,
        color: color,
        h: height,
        text: label,
        w: width,
        x,
        y,
      });
  }

  setX_AND_Y({ x, y }: { x: number; y: number }) {
    if (this.activeLabel.value) {
      this.activeLabel.next({
        ...this.activeLabel.value,
        x,
        y,
      });
    }
  }
}

export type saveConfigParams = {
  color: string;
  height: number;
  width: number;
  label: string;
  x: number;
  y: number;
};

export type config = {
  env: {
    zoom: number;
    activeItem: string | undefined;
  };
};

export type activeLabel =
  | undefined
  | {
      shape: 'rectangle';
      x: number;
      y: number;
      w: number;
      h: number;
      text: string;
      color: string;
    };

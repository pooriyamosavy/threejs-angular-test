import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfigHandlerService } from 'src/app/service/config-handler.service';

@Component({
  selector: 'comp-modal-labelconfig',
  templateUrl: './label-config.component.html',
})
export class LabelConfigComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  activeTab: string = 'action';
  tabs = ['action', 'content', 'view', 'animation'];

  view: view = {
    color: '',
    height: 100,
    width: 100,
    x: 0,
    y: 0
  };

  content: {
    label: string
  } = {
    label: ""
  }

  constructor(private configHandlerService: ConfigHandlerService) {}

  ngOnInit(): void {
    this.configHandlerService.rectangle$.subscribe((rec)=>{
      console.log({rec})
      if(rec){
        console.log(rec)
        this.view.color = rec.color ?? this.view.color,
        this.view.height = rec.h ?? this.view.height,
        this.view.width = rec.w ?? this.view.width,
        this.content.label = rec.text ?? this.content.label,
        this.view.x = rec.x ?? this.view.x,
        this.view.y = rec.y ?? this.view.y
      }
    })
  }

  onClose(e: Event): void {
    this.closeEvent.emit();
  }

  colorChange(event: Event) {
    this.view.color = (event.target as HTMLInputElement).value;
  }
  heightChange(event: Event) {
    this.view.height = +(event.target as HTMLInputElement).value;
  }
  widthChange(event: Event) {
    this.view.width = +(event.target as HTMLInputElement).value;
  }
  labelChange(event: Event) {
    this.content.label = (event.target as HTMLInputElement).value
  }
  xChange(event: Event) {
    this.view.x = +(event.target as HTMLInputElement).value;
  }
  yChange(event: Event) {
    this.view.y = +(event.target as HTMLInputElement).value;
  }

  submit() {
    this.configHandlerService.saveConfig({
      color: this.view.color,
      height: this.view.height,
      label: this.content.label,
      width: this.view.width,
      x: this.view.x,
      y: this.view.y
    })
    this.closeEvent.emit()
  }

}

export type view = {
  color: string;
  height: number;
  width: number;
  x: number,
  y: number
};
export type inputName = 'colot' | 'height' | 'width';

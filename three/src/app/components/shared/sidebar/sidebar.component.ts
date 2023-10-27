import { Component, OnInit } from '@angular/core';
import { ConfigHandlerService } from 'src/app/service/config-handler.service';

@Component({
  selector: 'comp-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  zoom: number | undefined;
  constructor(private configHandlerService: ConfigHandlerService) {}

  ngOnInit(): void {
    this.configHandlerService.config$.subscribe((cfg)=>{
      this.zoom = cfg.env.zoom
    })
  }

  onTextChange(event: Event) {
    const target = event.target as HTMLInputElement
    const text = target.value
    this.configHandlerService.rectText = text
  }

  addZoom() {
    this.configHandlerService.addZoom()
  }

  subZoom() {
    this.configHandlerService.subZoom()
  }
}

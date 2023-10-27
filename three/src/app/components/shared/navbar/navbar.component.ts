import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ConfigHandlerService,
  activeLabel,
} from 'src/app/service/config-handler.service';

@Component({
  selector: 'comp-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  activelabel: activeLabel;
  constructor(
    private configHandlerService: ConfigHandlerService,
    private httpClient: HttpClient
  ) {
    this.configHandlerService.rectangle$.subscribe((rec) => {
      this.activelabel = rec;
    });
  }

  showdataStructure(): void {
    const body = {
      data: {
        id: 'label_019278347234023',
        shape: {
          elementId: 'label_2394872394',
          shape: this.activelabel?.shape,
          view: {
            fill: this.activelabel?.color,
            height: this.activelabel?.h,
            width: this.activelabel?.w,
            x: this.activelabel?.x,
            y: this.activelabel?.y,
          },
          text: {
            elementId: 'lable_21083974623',
            view: {
              font: 'Arial',
              fontSize: '30px',
            },
          },
          content: {
            label: this.activelabel?.text,
            dynamic: { type: null },
          },
        },
      },
      action: { type: null },
      animation: { type: null },
    };

    console.log(body)

    this.httpClient.post('localhost:3000', body).subscribe((res)=>{
      console.log(res)
    })
    
  }
  modal: string | null = null;
}

import { Component } from '@angular/core';
import { ConfigHandlerService } from 'src/app/service/config-handler.service';

@Component({
  selector: 'comp-accordion',
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  public activeItem: string | undefined;
  public accordion_items: accordion_items_type = accordionItems;

  constructor(private configHandlerService: ConfigHandlerService) {
    this.configHandlerService.config$.subscribe(({ env }) => {
      this.activeItem = env.activeItem;
    });
  }

  public openAndCloseAccordion(_title: string): void {
    const index = this.accordion_items.findIndex(
      ({ title }) => title === _title
    );
    for (let i = 0; i < this.accordion_items.length; i++) {
      if (i === index) {
        this.accordion_items[i].open = !this.accordion_items[i].open;
      } else {
        this.accordion_items[i].open = false;
      }
    }
  }

  public activateItem(item: string): void {
    this.configHandlerService.setActiveItem = this.activeItem === item ? undefined : item;
    if(item === 'rectangle') {
      this.configHandlerService.setRectangle = {
        color: "#ff0000",
        h: 100,
        shape: "rectangle",
        text: "",
        w: 100,
        x: 0,
        y: 0
      }
    }
  }
}

export type accordion_items_type = {
  title: string;
  open: boolean;
  items: {
    title: string;
    icon: string;
  }[];
}[];

const accordionItems = [
  {
    title: 'background',
    open: false,
    items: [],
  },
  {
    title: 'label',
    open: false,
    items: [
      {
        title: 'circle',
        icon: 'circle',
      },
      {
        title: 'rectangle',
        icon: 'rectangle',
      },
      {
        title: 'ellipse',
        icon: 'exposure_zero',
      },
      {
        title: 'text',
        icon: 'text_format',
      },
    ],
  },
  {
    title: 'component',
    open: false,
    items: [],
  },
];

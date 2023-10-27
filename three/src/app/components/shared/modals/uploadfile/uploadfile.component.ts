import { Component, EventEmitter, Output } from '@angular/core';
import { ConfigHandlerService } from 'src/app/service/config-handler.service';

@Component({
  selector: 'comp-modal-uploadfile',
  templateUrl: './uploadfile.component.html',
})
export class UploadfileComponent {
  @Output() closeEvent = new EventEmitter<any>();
  public errorMsg: string | null = null;
  public file: File | null = null;

  constructor(private configHandlerService: ConfigHandlerService) {}

  onClose(e: Event): void {
    this.closeEvent.emit();
  }

  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      this.file = file;
      this.errorMsg = null;
    } else {
      this.file = null;
      this.errorMsg = 'the type must be svg';
    }
  }

  submit() {
    this.configHandlerService.setFile = this.file as File;
    this.closeEvent.emit();
  }
}

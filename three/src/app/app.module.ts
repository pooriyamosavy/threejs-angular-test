import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './module/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './page/home/home.component';
import { MainComponent } from './components/three/main/main.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { AccordionComponent } from './components/shared/accordion/accordion.component';
import { UploadfileComponent } from './components/shared/modals/uploadfile/uploadfile.component';
import { LabelConfigComponent } from './components/shared/modals/label-config/label-config.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    AccordionComponent,
    UploadfileComponent,
    LabelConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

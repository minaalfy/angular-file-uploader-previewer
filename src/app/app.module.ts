import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from  '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

import { AppComponent } from './app.component';
import { TxtreaderComponent } from './txtreader/txtreader.component';
import { ImgpreviewerComponent } from './imgpreviewer/imgpreviewer.component';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';

registerPlugin(FilePondPluginFileValidateType);
registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginFileRename);

@NgModule({
  declarations: [
    AppComponent, TxtreaderComponent, ImgpreviewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    NgxExtendedPdfViewerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    FilePondModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

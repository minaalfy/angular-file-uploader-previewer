# AngularFileUploaderPreviewer

Angular file uploader previewer is an angular project demonstrating how to combine [ngx-filepond](https://github.com/pqina/ngx-filepond), [NgbModal](https://ng-bootstrap.github.io/#/components/modal/examples), [NgbCarousel](https://ng-bootstrap.github.io/#/components/carousel/examples), [ngx-extended-pdf-viewer](https://github.com/stephanrauh/ngx-extended-pdf-viewer) plus 2 added components "TxtreaderComponent & ImgpreviewerComponent" to provide a complete attachment control to enable upload and display "pdf files, images, text files"

You can find Firebase Demo [Here](https://angular-file-upload-preview.firebaseapp.com)

And you can find documentation [Here](https://angular-file-upload-preview.firebaseapp.com/documentation)

## Components

-   **File Uploader** "Using [ngx-filepond](https://github.com/pqina/ngx-filepond)"
-   **Carousel inside Modal**
-   **Text Reader**
-   **Image Previewer**
-   **PDF Previewer** - "using [ngx-extended-pdf-viewer](https://github.com/stephanrauh/ngx-extended-pdf-viewer)"

## Features

-   Upload Files
   -   Accept specific file types "In this example PDFs, text files, images
   -   Accept specific file size
   -   Rename files "to remove special characters from the file name"
   -   Generate Thmbs for PDFs by taking snapshot from pdf first page
   -   Preview Full file previewer on thumbnail click
   
-   Carousel inside Modal as Previewer slider

-   Image Previewer
   -   Seperate component to be used any were
   -   Toolbar for "zooming - fliping - rotattion - panning - download"

-   Text Reader
   -   Read text files and preview it's contents

-   PDF Previewer "please check it's features [here](https://github.com/stephanrauh/ngx-extended-pdf-viewer)

## Dependencies

-   [@ng-bootstrap/ng-bootstrap](https://ng-bootstrap.github.io)
-   [ngx-extended-pdf-viewer](https://github.com/stephanrauh/ngx-extended-pdf-viewer)
-   [ngx-filepond](https://github.com/pqina/ngx-filepond)
    -   [filepond-plugin-file-rename](https://github.com/pqina/filepond-plugin-file-rename)
    -   [filepond-plugin-file-validate-size](https://github.com/pqina/filepond-plugin-file-validate-size)
    -   [filepond-plugin-file-validate-type](https://github.com/pqina/filepond-plugin-file-validate-type)

## Usage documentation

First create angular project using [Angular CLI](https://cli.angular.io/)
Then Run 
```bash
  npm install ngx-filepond filepond  @ng-bootstrap/ng-bootstrap ngx-extended-pdf-viewer --save
```
Then Import these into in `src/app/app.module.ts`
```ts
  import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
  import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
  import { FilePondModule, registerPlugin } from 'ngx-filepond';
  import { HttpClientModule } from  '@angular/common/http'; // needed for TxtreaderComponent
  imports: [
    BrowserModule,
    NgbModule,
    NgxExtendedPdfViewerModule,
    FilePondModule,
    HttpClientModule //Required by TxtreaderComponent
  ],
```


If you need to enable preview images then add the ImgpreviewerComponent into your project by coping the imgpreviewer folder into your desired path and import this component in `src/app/app.module.ts` 
If you need to enable preview text files then add the TxtreaderComponent into your project by coping the txtreader folder into your desired path and import this component in `src/app/app.module.ts` 

```ts
  import { ImgpreviewerComponent } from './imgpreviewer/imgpreviewer.component';
  import { TxtreaderComponent } from './txtreader/txtreader.component';
  declarations: [
    AppComponent, TxtreaderComponent, ImgpreviewerComponent
  ]
```

If you need to enable file type validation run `npm install filepond-plugin-file-validate-type --save`
Then import it and register it in `src/app/app.module.ts`
```ts
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
registerPlugin(FilePondPluginFileValidateType);
```

If you need to enable file size validation run `npm install filepond-plugin-file-validate-size --save`
```ts
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilePondPluginFileValidateSize);
```
If you need to enable file rename run `npm install filepond-plugin-file-rename --save`
```ts
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
registerPlugin(FilePondPluginFileRename);
```

### Server Side
In this project I've used firebase storage as upload server and if you want to use it then you should follow the next steps
Install angular fire by running `npm install firebase @angular/fire --save`
Then in your environments/environments.ts add the object 
```ts
  export const environment = {
    production: false,
    firebase: {
      apiKey: 'AIzaSyCVr4A34Lu_GBF42yHCtAfcyWhBRizDKAc',
      authDomain: 'angular-file-upload-preview.firebaseapp.com',
      databaseURL: 'https://angular-file-upload-preview.firebaseio.com',
      projectId: 'angular-file-upload-preview',
      storageBucket: 'angular-file-upload-preview.appspot.com',
      messagingSenderId: '582497285196'
    }
  };
```
Then Import these into in `src/app/app.module.ts`
```ts
  import { AngularFireModule } from '@angular/fire';
  import { AngularFireStorageModule } from '@angular/fire/storage';
  import { environment } from '../environments/environment';
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
```
### Utilities Functions

We have 4 public static functions wrapped in the class Utils in file `src/utilities/utilities.ts`
```ts
import * as pdfjsLib from "ngx-extended-pdf-viewer/assets/pdf.js";
export default class Utils {
  /**
  * You can convert it to any unique ID generator function.
  */
  public static uniqueId() {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  }

  /**
  * take blob file and return url for it.
  */
  public static generateUploadedFileUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
  * Take firebase storage file ref "this.storage.ref(filename)" and return its url + meta date in an object.
  */
  public static async getFileDate(file) {
    let url = await file.getDownloadURL().toPromise();
    let meta = await file.getMetadata().toPromise();
    return { url: url, meta: meta };
  }

  /**
  * Take pdf source file or url and return a thumb url generated from a snapshot from firstpage in the pdf file.
  */
  public static generatePDFThumb(src) {
    return new Promise((resolve, reject) => {
      pdfjsLib
        .getDocument(src)
        .promise.then(function(pdf) {
          pdf.getPage(1).then(function(page) {
            var viewport = page.getViewport(0.7);
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
              canvasContext: ctx,
              viewport: viewport
            };
            page.render(renderContext).then(function() {
              ctx.globalCompositeOperation = "destination-over";
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              let thumb = canvas.toDataURL();
              canvas.remove();
              resolve(thumb);
            });
          });
        })
        .catch(console.error);
    });
  }
}

```

### Wrap it all
To wrap it all go to your component `src/app/app.component.ts`

```ts
import { Component, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize, tap } from "rxjs/operators";
import * as pdfjsLib from "ngx-extended-pdf-viewer/assets/pdf.js";
```

Then add the following parameters
```ts
  files: any[] = [];
  pondFiles: any[] = [];
  activeId: string;
  @ViewChild("filePond") filePond: any;
  pondOptions = {
    labelIdle: "Drop file here",
    allowMultiple: true,
    // The following 2 properties for the file rename
    allowFileRename: true,
    fileRenameFunction: file => {
      return file.name.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "");
    },
        // The server property is customized to work with firebase for more infor please read https://pqina.nl/filepond/docs/patterns/api/server/
    server: {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const path = `files/${new Date().getTime()}_${file.name}`;
        file.id = this.uniqueId();
        const uploadTask = this.storage.upload(path, file);
        const ref = this.storage.ref(path);
        uploadTask
          .snapshotChanges()
          .pipe(
            tap(snap => {
              progress(true, 1024, 1024);
            }),
            finalize(() => {
              ref.getDownloadURL().subscribe(downloadURL => {
                load(downloadURL);
                return {
                  abort: () => {
                    abort();
                  }
                };
              });
            })
          )
          .subscribe();
      },
      load: (source, load, error, progress, abort, headers) => {
        fetch(source)
          .then(function(e) {
            load(e.url);
          })
          .catch(function() {});
        return {
          abort: e => {
            console.log(e);
            abort();
          }
        };
      }
    },
    dropValidation: true,
    instantUpload: true,
    acceptedFileTypes: ["image/*", "text/plain", "application/pdf"],
    allowFileSizeValidation: true,
    maxFileSize: "2MB"
  };
```

Then in the constructor function please import NgbModal, AngularFireStorage
```ts
  constructor(
    private modalService: NgbModal,
    private storage: AngularFireStorage
  ) { }
```

Please read a complete [documentation](https://angular-file-upload-preview.firebaseapp.com/documentation/components/AppComponent.html) for the `src/app/app.component.ts` methods and parameters

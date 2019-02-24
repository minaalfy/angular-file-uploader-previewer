import { Component, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize, tap } from "rxjs/operators";
import Utils from "../utilities/utilities";
/**
* Class AppComponent is our main angular component to upload and preview "text files, PDFs, images" and preview
*/
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  /** files property to be our files array to be binded and displayed */
  files: any[] = [];
  /** activeId property to be used for the carousel as a current slide id */
  activeId: string;
  /** declare filePond as filepond instance */
  @ViewChild("filePond") filePond: any;

  /**
  * FilePond Options object.
  */
  pondOptions = {
    labelIdle: "Drop file here",
    allowMultiple: true,
    allowFileRename: true,
    fileRenameFunction: file => {
      return file.name.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "");
    },
    server: {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const path = `files/${new Date().getTime()}_${file.name}`;
        file.id = Utils.uniqueId();
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

  /** We just define NgbModal,AngularFireStorage in the constructor  */
  constructor(
    private modalService: NgbModal,
    private storage: AngularFireStorage
  ) { }

  /**
  * Add files "returnced from the serve" to filepond component.
  */
  async pushPondFiles(files) {
    const pondFiles = [];
    for (let i = 0; i < files.length; i++) {
      const filedate = await Utils.getFileDate(files[i]);
      let id = Utils.uniqueId();
      this.files[i] = {
        src: filedate.url,
        name: filedate.meta.name,
        size: filedate.meta.size,
        id,
        contentType: filedate.meta.contentType.split("/")[0],
        type: filedate.meta.name.split(".").pop()
      };
      this.createThumb(
        filedate.meta.contentType,
        filedate.meta.name,
        filedate.url,
        this.files[i]
      );
      pondFiles[i] = {
        source: filedate.url,
        options: {
          type: "local",
          file: {
            id: id,
            name: filedate.meta.name,
            size: filedate.meta.size,
            type: filedate.meta.name.split(".").pop()
          }
        }
      };
      this.filePond.pond.setOptions({ files: pondFiles });
    }
  }

  /**
  * Read data from filepond file instance and create object and push it to our files array.
  */
  async pushFile(file) {
    const obj: any = {
      name: file.name,
      size: file.size,
      id: file.id,
      contentType: file.type.split("/")[0],
      type: file.name.split(".").pop()
    };
    obj.src = await Utils.generateUploadedFileUrl(file);
    this.createThumb(file.type, file.name, obj.src, obj);
    this.files.push(obj);
  }

  /**
  * Add Thumb to the file "Thumb will be the same as photo source in case of images or generated from pdf first page or placeholder for txt files.
  */
  async createThumb(contentType, name, url, obj) {
    if (contentType.split("/")[0] === "image") {
      obj.thumb = url;
    } else if (name.split(".").pop() === "pdf") {
      obj.thumb = await Utils.generatePDFThumb(obj.src);
    } else {
      obj.thumb = "https://firebasestorage.googleapis.com/v0/b/angular-file-upload-preview.appspot.com/o/text.png?alt=media&token=07736b8e-3c71-4557-a4fc-8067bbb47139";
    }
  }
  /**
  * Remove file from filepond and hence trigger pondHandleRemoveFile which will remove it from the thumbnails list.
  */
  removeFile(id) {
    const file = this.filePond.pond.getFiles().find(a => a.file.id === id);
    this.filePond.pond.removeFile(file.id);
  }

  // Filepond functions
  /**
  * This Event fires after filepond initialized then we can add to it the files comes from the server.
  */
  pondHandleInit() {
    //  console.log("FilePond has initialised", this.filePond);
    //  Simulate retreive 3 files from the server and display it.
    this.pushPondFiles([
      this.storage.ref("lorem.txt"),
      this.storage.ref("pdf-test.pdf"),
      this.storage.ref("planet.jpeg")
    ]);
  }
  /**
  * This Event fires after file uploaded successfuly so we can push this file to our files array to be displayed.
  */
  pondHandleProcessFile(event: any) {
    this.pushFile(event.file.file);
  }
  /**
  * This Event fires after file removedfrom filepond so we can delete this file from our files array to not be displayed.
  */
  pondHandleRemoveFile(event: any) {
    //    console.log(event);
    //    this.removeFile(event.file.file.id);
    this.files.splice(
      this.files.findIndex(a => a.id === event.file.file.id),
      1
    );
  }
  // End of Filepond functions

  // Modal and Carousel Functions
  /**
  * update the active slide ID from the modal.
  */
  logSlide(ev: any) {
    this.activeId = ev.current;
  }
  /**
  * Open ngbootstrap modal with current slide activated and add specific class modal-reader to the modal.
  */
  open(content: any, slide: string) {
    this.activeId = slide;
    this.modalService.open(content, { windowClass: "modal-reader" });
  }
  // Modal and Carousel Functions
}

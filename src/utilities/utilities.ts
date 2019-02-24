import * as pdfjsLib from "ngx-extended-pdf-viewer/assets/pdf.js";
/**
* Class Utils is just a wrapper for the 4 public static functions.
*/
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
  * Take blob file and return url for it.
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

import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
/**
* Class TxtreaderComponent is my angular component to preview .txt files with toolbar for "increase fontsize, decrease fontsize, download"
*/
@Component({
  selector: "app-txtreader",
  templateUrl: "./txtreader.component.html",
  styleUrls: ["./txtreader.component.scss"]
})
export class TxtreaderComponent implements OnInit {
  /** src input is the source for the .txt file intended to be previewed */
  @Input() src: string;
  /** data property to be container for the .txt file content */
  data: string;
  /** data property used to bind the fontsize */
  size: number = 100;

  /** We just define httpClient in the constructor  */
  constructor(private httpClient: HttpClient) {}

  /**
  * On init call the method readfile
  */
  ngOnInit() {
    this.readFile(this.src);
  }
  /**
  * Make Httprequest for the input .txt file then assign the result to the parameter data
  */
  readFile(src) {
    this.httpClient.get(src,{ responseType: 'text' }).subscribe((data:any) => {
      this.data = data;
      console.log(data.length)
    });
  }
}

import { Component, Input } from "@angular/core";
/**
* Class ImgpreviewerComponent is my angular component to preview images with toolbar for "zoomIn, zoomOut, rotateClockwise, rotateCounterClockwise, flipVertical, flipHorizontal, Panning, mousewheel scroll zooming, download"
*/
@Component({
  selector: "app-imgpreviewer",
  templateUrl: "./imgpreviewer.component.html",
  styleUrls: ["./imgpreviewer.component.scss"]
})
export class ImgpreviewerComponent {
  /** src input is the source for the image intended to be previewed */
  @Input() src: string;
  /** rotation property to be used in css transform rotate property */
  rotation: number = 0;
  /** scale property to be used in css transform scale property */
  scale: number = 1;
  /** scale property to be used in css transform translateX property */
  translateX: number = 0;
  /** scale property to be used in css transform translateY property */
  translateY: number = 0;
  /** prevX property help in calculate the css transform translateX property */
  prevX: number;
  /** prevY property help in calculate the css transform translateY property */
  prevY: number;
  /** zoomFactor property is static value for scale factor on zooming */
  zoomFactor: number = 0.1;
  /** flipV property to be used in css transform scale property it's boolean for (negative || positive) scaleY */
  flipV: boolean = false;
  /** flipH property to be used in css transform scale property it's boolean for (negative || positive) scaleX */
  flipH: boolean = false;
  /**
  * Style property to be binded on the image ngStyle
  */
  style = {
    transform: "",
    msTransform: "",
    oTransform: "",
    webkitTransform: ""
  };

  /**
  * Increase the scale by the zoomFactor then update the image css style transform by the new scale
  */
  zoomIn() {
    this.scale *= 1 + this.zoomFactor;
    this.updateStyle();
  }

  /**
  * Decrease the scale by the zoomFactor then update the image css style transform by the new scale
  */
  zoomOut() {
    if (this.scale > this.zoomFactor) {
      this.scale /= 1 + this.zoomFactor;
    }
    this.updateStyle();
  }

  /**
  * Apply zoomOut or zoomIn depend on  the captured mouse scrollwheel
  */
  scrollZoom(evt:any) {
    evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
    return false;
  }

  /**
  * Increase the rotation by 90 degree then update the image css style transform by the new rotation
  */
  rotateClockwise() {
    this.rotation += 90;
    this.updateStyle();
  }
  /**
  * Decrease the rotation by 90 degree then update the image css style transform by the new rotation
  */
  rotateCounterClockwise() {
    this.rotation -= 90;
    this.updateStyle();
  }

  /**
  * Toggle flipV then update the image css style transform by the new scale
  */
  flipVertical() {
    this.flipV =!this.flipV;
    this.updateStyle();
  }

  /**
  * Toggle flipH then update the image css style transform by the new scale
  */
  flipHorizontal() {
    this.flipH =!this.flipH;
    this.updateStyle();
  }


  /**
  * Calculate the panning values (translateX, translateY) then update the image css style transform by the new translation
  */
  onDragOver(evt:any) {
    this.translateX += evt.clientX - this.prevX;
    this.translateY += evt.clientY - this.prevY;
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
    this.updateStyle();
  }

  /**
  * Calculate the panning start points (prevX, prevY)
  */
  onDragStart(evt:any) {
    if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
      evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
    }
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
  }

  /**
  * Reset (scale, rotation, translateX, translateY) then update the image css style transform
  */
  reset() {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  /**
  * Take all transformation value from the class variables (flipV, flipH, translateX, translateY, rotation, scale) then update the image css style transform property
  */
  updateStyle() {
    const flippedV = (this.flipV ? -1 : 1);
    const flippedH = (this.flipH ? -1 : 1);
    this.style.transform = `translate(${this.translateX}px, ${
      this.translateY
    }px) rotate(${this.rotation}deg) scale(${flippedH * this.scale}, ${flippedV * this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
  }
}

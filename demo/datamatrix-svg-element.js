import { MatrixcodeSvgElementBase } from "./matrixcode-svg-element-base.js"
import bwipjs from "./bwip-js.mjs"

class DataMatrixSvg extends MatrixcodeSvgElementBase {

  constructor() {
    super();
  }

  updateValue(value) {
    this.datamatrix = bwipjs.raw('datamatrix', value, {});
  }

  getWidth() {
    return this.datamatrix[0].pixx;
  }

  getHeight() {
    return this.datamatrix[0].pixy;
  }

  isFilled(x, y) {
    return this.datamatrix[0].pixs[y * this.getWidth() + x] == 1;
  }
}

customElements.define("datamatrix-svg", DataMatrixSvg);
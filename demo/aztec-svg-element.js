import { MatrixcodeSvgElementBase } from "./matrixcode-svg-element-base.js"
import bwipjs from "./bwip-js.mjs"

class AztecSvg extends MatrixcodeSvgElementBase {

  constructor() {
    super();
  }

  updateValue(value) {
    this.aztec = bwipjs.raw('azteccode', value, {});
  }

  getWidth() {
    return this.aztec[0].pixx;
  }

  getHeight() {
    return this.aztec[0].pixy;
  }

  isFilled(x, y) {
    return this.aztec[0].pixs[y * this.getWidth() + x] == 1;
  }
}

customElements.define("aztec-svg", AztecSvg);
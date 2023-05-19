// import qrcodegen from "qrcodegen-v1.8.0-es6.js"
import { MatrixcodeSvgElementBase } from "./matrixcode-svg-element-base.js"

class QrcodeSvg extends MatrixcodeSvgElementBase {

  constructor() {
    super();
  }

  update() {
    this.quiet = Number(this.hasAttribute("quiet") ? this.getAttribute("quiet") : "4");
    super.update();
  }

  updateValue(value) {
    const QRC = qrcodegen.QrCode;
    this.qr = QRC.encodeText(value, QRC.Ecc.MEDIUM);
  }

  getWidth() {
    return this.qr.size + 2 * this.quiet;
  }

  getHeight() {
    return this.qr.size + 2 * this.quiet;
  }

  isFilled(x, y) {
    return (x - this.quiet) >= 0 && 
      (x - this.quiet) < this.qr.size && 
      (y - this.quiet) >= 0 && 
      (y - this.quiet) < this.qr.size && 
      this.qr.getModule(x - this.quiet, y - this.quiet);
  }
}

customElements.define("qrcode-svg", QrcodeSvg);